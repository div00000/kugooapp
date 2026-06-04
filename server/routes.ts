import type { Express, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import { storage } from "./storage";
import { askZaam } from "./zaam";
import {
  authenticate,
  requireRole,
  hashPassword,
  verifyPassword,
  signToken,
  toPublicUser,
  type AuthRequest,
} from "./auth";
import { signupSchema, loginSchema, type OrderItem, type Order } from "@shared/schema";

const trackingClients = new Map<string, Set<WebSocket>>();

function broadcast(trackingId: string, order: Order) {
  const set = trackingClients.get(trackingId);
  if (!set) return;
  const payload = JSON.stringify({ type: "order_update", order });
  for (const ws of set) {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  }
}

const STATUS_FLOW: Order["status"][] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "rider_assigned",
  "picked_up",
  "delivering",
  "delivered",
];

export async function registerRoutes(app: Express): Promise<Server> {
  // ---------------- Auth ----------------
  app.post("/api/auth/signup", async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
    const existing = await storage.getUserByEmail(parsed.data.email);
    if (existing) return res.status(409).json({ error: "An account with this email already exists" });
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await storage.createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash,
      role: parsed.data.role,
    });
    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  });

  app.post("/api/auth/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid credentials" });
    const user = await storage.getUserByEmail(parsed.data.email);
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  });

  app.get("/api/auth/me", authenticate, async (req: AuthRequest, res) => {
    const user = await storage.getUserById(req.userId!);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: toPublicUser(user) });
  });

  app.delete("/api/auth/me", authenticate, async (req: AuthRequest, res) => {
    await storage.deleteUser(req.userId!);
    res.json({ success: true });
  });

  // ---------------- Restaurants ----------------
  app.get("/api/restaurants", async (_req, res) => {
    res.json(await storage.listRestaurants());
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    const r = await storage.getRestaurant(Number(req.params.id));
    if (!r) return res.status(404).json({ error: "Restaurant not found" });
    const menu = await storage.listMenuItems(r.id);
    res.json({ ...r, menu });
  });

  // ---------------- Zaam AI ----------------
  app.post("/api/zaam", async (req, res) => {
    const message = String(req.body?.message ?? "");
    if (!message.trim()) return res.status(400).json({ error: "Message required" });
    res.json(await askZaam(message));
  });

  // ---------------- Orders ----------------
  const createOrderSchema = z.object({
    restaurantId: z.number(),
    items: z.array(
      z.object({ menuItemId: z.number(), name: z.string(), price: z.number(), quantity: z.number().min(1) }),
    ).min(1),
    address: z.string().min(3),
    note: z.string().optional(),
    paymentMethod: z.string().default("card"),
  });

  app.post("/api/orders", authenticate, async (req: AuthRequest, res) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
    const restaurant = await storage.getRestaurant(parsed.data.restaurantId);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const items = parsed.data.items as OrderItem[];
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = restaurant.deliveryFee;
    const serviceFee = Math.round(subtotal * 0.03);
    const total = subtotal + deliveryFee + serviceFee;

    const commission = await storage.getCommission();
    const vendorEarning = Math.round((subtotal * commission.vendorPercent) / 100);
    const riderEarning = Math.round((subtotal * commission.riderPercent) / 100) + deliveryFee;
    const platformEarning = total - vendorEarning - riderEarning;

    const order = await storage.createOrder({
      customerId: req.userId!,
      restaurantId: restaurant.id,
      status: "pending",
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      total,
      vendorEarning,
      riderEarning,
      platformEarning,
      address: parsed.data.address,
      note: parsed.data.note ?? "",
      paymentMethod: parsed.data.paymentMethod,
      etaMinutes: restaurant.deliveryTime + 10,
      riderLat: restaurant.lat,
      riderLng: restaurant.lng,
    });
    res.json(order);
  });

  app.get("/api/orders/mine", authenticate, async (req: AuthRequest, res) => {
    res.json(await storage.listOrdersByCustomer(req.userId!));
  });

  app.get("/api/orders/track/:trackingId", async (req, res) => {
    const order = await storage.getOrderByTracking(req.params.trackingId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const restaurant = await storage.getRestaurant(order.restaurantId);
    const rider = order.riderId ? await storage.getUserById(order.riderId) : null;
    res.json({ ...order, restaurant, rider: rider ? toPublicUser(rider) : null });
  });

  // Returns true if the user is entitled to view/act on this order.
  async function canAccessOrder(order: Order, userId: number, role: string): Promise<boolean> {
    if (role === "admin") return true;
    if (role === "customer") return order.customerId === userId;
    if (role === "rider") return order.riderId === userId;
    if (role === "merchant") {
      const restaurant = await storage.getRestaurantByOwner(userId);
      return !!restaurant && restaurant.id === order.restaurantId;
    }
    return false;
  }

  app.get("/api/orders/:id", authenticate, async (req: AuthRequest, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (!(await canAccessOrder(order, req.userId!, req.userRole!))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(order);
  });

  // Which roles are allowed to set which target statuses.
  const merchantStatuses = ["accepted", "preparing", "ready", "cancelled"];
  const riderStatuses = ["picked_up", "delivering", "delivered"];

  app.patch("/api/orders/:id/status", authenticate, async (req: AuthRequest, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (!(await canAccessOrder(order, req.userId!, req.userRole!))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const status = req.body?.status as Order["status"];
    if (!STATUS_FLOW.includes(status) && status !== "cancelled") {
      return res.status(400).json({ error: "Invalid status" });
    }
    const role = req.userRole!;
    const allowed =
      role === "admin" ||
      (role === "merchant" && merchantStatuses.includes(status)) ||
      (role === "rider" && riderStatuses.includes(status));
    if (!allowed) {
      return res.status(403).json({ error: "Not permitted to set this status" });
    }
    const updated = await storage.updateOrder(order.id, { status });
    broadcast(updated.trackingId, updated);
    res.json(updated);
  });

  // ---------------- Merchant ----------------
  app.get("/api/merchant/restaurant", authenticate, requireRole("merchant", "admin"), async (req: AuthRequest, res) => {
    let restaurant = await storage.getRestaurantByOwner(req.userId!);
    if (!restaurant) {
      const user = await storage.getUserById(req.userId!);
      restaurant = await storage.createRestaurant({
        ownerId: req.userId!,
        name: `${user?.name ?? "My"} Kitchen`,
        description: "Freshly prepared meals delivered fast.",
        category: "Restaurant",
      });
    }
    const menu = await storage.listMenuItems(restaurant.id);
    res.json({ ...restaurant, menu });
  });

  app.patch("/api/merchant/restaurant", authenticate, requireRole("merchant", "admin"), async (req: AuthRequest, res) => {
    const restaurant = await storage.getRestaurantByOwner(req.userId!);
    if (!restaurant) return res.status(404).json({ error: "No restaurant" });
    const updated = await storage.updateRestaurant(restaurant.id, req.body);
    res.json(updated);
  });

  app.get("/api/merchant/orders", authenticate, requireRole("merchant", "admin"), async (req: AuthRequest, res) => {
    const restaurant = await storage.getRestaurantByOwner(req.userId!);
    if (!restaurant) return res.json([]);
    res.json(await storage.listOrdersByRestaurant(restaurant.id));
  });

  app.post("/api/merchant/menu", authenticate, requireRole("merchant", "admin"), async (req: AuthRequest, res) => {
    const restaurant = await storage.getRestaurantByOwner(req.userId!);
    if (!restaurant) return res.status(404).json({ error: "No restaurant" });
    const item = await storage.createMenuItem({ ...req.body, restaurantId: restaurant.id });
    res.json(item);
  });

  // Confirms the menu item belongs to the caller's restaurant (admins bypass).
  async function ownsMenuItem(itemId: number, req: AuthRequest): Promise<boolean> {
    const item = await storage.getMenuItem(itemId);
    if (!item) return false;
    if (req.userRole === "admin") return true;
    const restaurant = await storage.getRestaurantByOwner(req.userId!);
    return !!restaurant && restaurant.id === item.restaurantId;
  }

  app.patch("/api/merchant/menu/:id", authenticate, requireRole("merchant", "admin"), async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    if (!(await ownsMenuItem(id, req))) return res.status(403).json({ error: "Forbidden" });
    res.json(await storage.updateMenuItem(id, req.body));
  });

  app.delete("/api/merchant/menu/:id", authenticate, requireRole("merchant", "admin"), async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    if (!(await ownsMenuItem(id, req))) return res.status(403).json({ error: "Forbidden" });
    await storage.deleteMenuItem(id);
    res.json({ success: true });
  });

  // ---------------- Rider ----------------
  app.get("/api/rider/available", authenticate, requireRole("rider", "admin"), async (_req, res) => {
    const deliveries = await storage.listAvailableDeliveries();
    const enriched = await Promise.all(
      deliveries.map(async (o) => ({ ...o, restaurant: await storage.getRestaurant(o.restaurantId) })),
    );
    res.json(enriched);
  });

  app.get("/api/rider/mine", authenticate, requireRole("rider", "admin"), async (req: AuthRequest, res) => {
    const orders = await storage.listOrdersByRider(req.userId!);
    const enriched = await Promise.all(
      orders.map(async (o) => ({ ...o, restaurant: await storage.getRestaurant(o.restaurantId) })),
    );
    res.json(enriched);
  });

  app.post("/api/rider/accept/:id", authenticate, requireRole("rider", "admin"), async (req: AuthRequest, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.riderId) return res.status(409).json({ error: "Delivery already taken" });
    if (order.status !== "ready") return res.status(409).json({ error: "Order not ready for pickup" });
    const updated = await storage.updateOrder(order.id, { riderId: req.userId!, status: "rider_assigned" });
    broadcast(updated.trackingId, updated);
    res.json(updated);
  });

  // ---------------- Admin ----------------
  app.get("/api/admin/stats", authenticate, requireRole("admin"), async (_req, res) => {
    res.json(await storage.getAdminStats());
  });

  app.get("/api/admin/users", authenticate, requireRole("admin"), async (_req, res) => {
    const list = await storage.listUsers();
    res.json(list.map(toPublicUser));
  });

  app.get("/api/admin/orders", authenticate, requireRole("admin"), async (_req, res) => {
    res.json(await storage.listAllOrders());
  });

  app.get("/api/admin/commission", authenticate, requireRole("admin"), async (_req, res) => {
    res.json(await storage.getCommission());
  });

  app.patch("/api/admin/commission", authenticate, requireRole("admin"), async (req, res) => {
    const body = req.body ?? {};
    const updates: Record<string, number> = {};
    for (const key of ["vendorPercent", "riderPercent", "platformPercent"] as const) {
      if (body[key] !== undefined) {
        const n = Number(body[key]);
        if (Number.isNaN(n) || n < 0 || n > 100) {
          return res.status(400).json({ error: `Invalid ${key}` });
        }
        updates[key] = n;
      }
    }
    res.json(await storage.updateCommission(updates));
  });

  const httpServer = createServer(app);

  // ---------------- WebSocket live tracking ----------------
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws) => {
    let subscribed: string | null = null;
    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "subscribe" && msg.trackingId) {
          subscribed = String(msg.trackingId).toUpperCase();
          if (!trackingClients.has(subscribed)) trackingClients.set(subscribed, new Set());
          trackingClients.get(subscribed)!.add(ws);
        }
      } catch {
        /* ignore */
      }
    });
    ws.on("close", () => {
      if (subscribed) trackingClients.get(subscribed)?.delete(ws);
    });
  });

  // ---------------- Auto-progression simulation engine ----------------
  startSimulation();

  return httpServer;
}

// Simulates the order lifecycle + rider movement so tracking feels live.
function startSimulation() {
  setInterval(async () => {
    try {
      const active = (await storage.listAllOrders()).filter(
        (o) => !["delivered", "cancelled", "pending"].includes(o.status),
      );
      for (const order of active) {
        const restaurant = await storage.getRestaurant(order.restaurantId);
        const updates: Record<string, unknown> = {};
        const idx = STATUS_FLOW.indexOf(order.status);

        // Advance status gradually (skip rider_assigned -> needs a rider; auto-assign if none after ready)
        if (order.status === "ready" && !order.riderId) {
          const riders = await storage.listRiders();
          if (riders.length) {
            updates.riderId = riders[Math.floor(Math.random() * riders.length)].id;
            updates.status = "rider_assigned";
          }
        } else if (idx >= 0 && idx < STATUS_FLOW.length - 1 && Math.random() > 0.4) {
          updates.status = STATUS_FLOW[idx + 1];
        }

        // Move rider toward customer + decrement ETA
        if (["picked_up", "delivering", "rider_assigned"].includes(order.status) && restaurant) {
          const targetLat = restaurant.lat + 0.02;
          const targetLng = restaurant.lng + 0.02;
          updates.riderLat = (order.riderLat ?? restaurant.lat) + (targetLat - (order.riderLat ?? restaurant.lat)) * 0.25;
          updates.riderLng = (order.riderLng ?? restaurant.lng) + (targetLng - (order.riderLng ?? restaurant.lng)) * 0.25;
          updates.etaMinutes = Math.max(1, order.etaMinutes - 2);
        }

        if (Object.keys(updates).length) {
          const updated = await storage.updateOrder(order.id, updates);
          broadcast(updated.trackingId, updated);
        }
      }
    } catch (err) {
      console.error("[simulation]", err);
    }
  }, 5000);
}
