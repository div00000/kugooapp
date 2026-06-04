import { db } from "./db";
import {
  users,
  restaurants,
  menuItems,
  orders,
  commissionSettings,
  type User,
  type Restaurant,
  type MenuItem,
  type Order,
  type CommissionSetting,
  type OrderItem,
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export const storage = {
  // ---- Users ----
  async getUserById(id: number): Promise<User | undefined> {
    const [u] = await db.select().from(users).where(eq(users.id, id));
    return u;
  },
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [u] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return u;
  },
  async createUser(data: typeof users.$inferInsert): Promise<User> {
    const [u] = await db
      .insert(users)
      .values({ ...data, email: data.email.toLowerCase() })
      .returning();
    return u;
  },
  async listUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  },
  async listRiders(): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, "rider"));
  },
  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  },

  // ---- Restaurants ----
  async listRestaurants(): Promise<Restaurant[]> {
    return db.select().from(restaurants).orderBy(desc(restaurants.rating));
  },
  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    const [r] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return r;
  },
  async getRestaurantByOwner(ownerId: number): Promise<Restaurant | undefined> {
    const [r] = await db.select().from(restaurants).where(eq(restaurants.ownerId, ownerId));
    return r;
  },
  async createRestaurant(data: typeof restaurants.$inferInsert): Promise<Restaurant> {
    const [r] = await db.insert(restaurants).values(data).returning();
    return r;
  },
  async updateRestaurant(id: number, data: Partial<typeof restaurants.$inferInsert>): Promise<Restaurant> {
    const [r] = await db.update(restaurants).set(data).where(eq(restaurants.id, id)).returning();
    return r;
  },

  // ---- Menu items ----
  async listMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
  },
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [m] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return m;
  },
  async createMenuItem(data: typeof menuItems.$inferInsert): Promise<MenuItem> {
    const [m] = await db.insert(menuItems).values(data).returning();
    return m;
  },
  async updateMenuItem(id: number, data: Partial<typeof menuItems.$inferInsert>): Promise<MenuItem> {
    const [m] = await db.update(menuItems).set(data).where(eq(menuItems.id, id)).returning();
    return m;
  },
  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  },

  // ---- Orders ----
  async createOrder(data: Omit<typeof orders.$inferInsert, "trackingId">): Promise<Order> {
    const year = new Date().getFullYear();
    const trackingId = `KG-${year}-${nanoid(6).toUpperCase().replace(/[^A-Z0-9]/g, "0")}`;
    const [o] = await db.insert(orders).values({ ...data, trackingId }).returning();
    return o;
  },
  async getOrder(id: number): Promise<Order | undefined> {
    const [o] = await db.select().from(orders).where(eq(orders.id, id));
    return o;
  },
  async getOrderByTracking(trackingId: string): Promise<Order | undefined> {
    const [o] = await db.select().from(orders).where(eq(orders.trackingId, trackingId.toUpperCase()));
    return o;
  },
  async listOrdersByCustomer(customerId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  },
  async listOrdersByRestaurant(restaurantId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.restaurantId, restaurantId)).orderBy(desc(orders.createdAt));
  },
  async listOrdersByRider(riderId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.riderId, riderId)).orderBy(desc(orders.createdAt));
  },
  async listAvailableDeliveries(): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .where(and(eq(orders.status, "ready"), sql`${orders.riderId} IS NULL`))
      .orderBy(desc(orders.createdAt));
  },
  async listAllOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
  },
  async updateOrder(id: number, data: Partial<typeof orders.$inferInsert>): Promise<Order> {
    const [o] = await db
      .update(orders)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return o;
  },

  // ---- Commission ----
  async getCommission(): Promise<CommissionSetting> {
    const [c] = await db.select().from(commissionSettings).limit(1);
    if (c) return c;
    const [created] = await db.insert(commissionSettings).values({}).returning();
    return created;
  },
  async updateCommission(data: Partial<typeof commissionSettings.$inferInsert>): Promise<CommissionSetting> {
    const current = await this.getCommission();
    const [c] = await db
      .update(commissionSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(commissionSettings.id, current.id))
      .returning();
    return c;
  },

  // ---- Analytics ----
  async getAdminStats() {
    const allOrders = await db.select().from(orders);
    const allUsers = await db.select().from(users);
    const allRestaurants = await db.select().from(restaurants);
    const delivered = allOrders.filter((o) => o.status === "delivered");
    const revenue = delivered.reduce((sum, o) => sum + o.total, 0);
    const platformCommission = delivered.reduce((sum, o) => sum + o.platformEarning, 0);

    const ordersByStatus: Record<string, number> = {};
    for (const o of allOrders) ordersByStatus[o.status] = (ordersByStatus[o.status] ?? 0) + 1;

    const restaurantName = new Map(allRestaurants.map((r) => [r.id, r.name]));
    const recentOrders = [...allOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map((o) => ({
        id: o.id,
        trackingId: o.trackingId,
        status: o.status,
        total: o.total,
        restaurantName: restaurantName.get(o.restaurantId) ?? "Unknown",
      }));

    const byRestaurant = new Map<number, { orders: number; revenue: number }>();
    for (const o of allOrders) {
      const cur = byRestaurant.get(o.restaurantId) ?? { orders: 0, revenue: 0 };
      cur.orders += 1;
      cur.revenue += o.total;
      byRestaurant.set(o.restaurantId, cur);
    }
    const topRestaurants = [...byRestaurant.entries()]
      .map(([id, v]) => ({ name: restaurantName.get(id) ?? "Unknown", orders: v.orders, revenue: v.revenue }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 6);

    return {
      totalOrders: allOrders.length,
      activeOrders: allOrders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length,
      totalRevenue: revenue,
      platformRevenue: platformCommission,
      platformCommission,
      totalUsers: allUsers.length,
      totalCustomers: allUsers.filter((u) => u.role === "customer").length,
      totalRiders: allUsers.filter((u) => u.role === "rider").length,
      totalMerchants: allUsers.filter((u) => u.role === "merchant").length,
      totalRestaurants: allRestaurants.length,
      ordersByStatus,
      recentOrders,
      topRestaurants,
      orders: allOrders,
    };
  },
};

export type { OrderItem };
