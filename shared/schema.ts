import { pgTable, serial, text, integer, boolean, timestamp, doublePrecision, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["customer", "merchant", "rider", "admin"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "rider_assigned",
  "picked_up",
  "delivering",
  "delivered",
  "cancelled",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("customer"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("Restaurant"),
  imageUrl: text("image_url").notNull().default(""),
  coverUrl: text("cover_url").notNull().default(""),
  rating: doublePrecision("rating").notNull().default(4.7),
  reviewCount: integer("review_count").notNull().default(0),
  deliveryTime: integer("delivery_time").notNull().default(25),
  deliveryFee: integer("delivery_fee").notNull().default(500),
  minOrder: integer("min_order").notNull().default(1000),
  address: text("address").notNull().default("Lagos, Nigeria"),
  lat: doublePrecision("lat").notNull().default(6.5244),
  lng: doublePrecision("lng").notNull().default(3.3792),
  isFeatured: boolean("is_featured").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  isOpen: boolean("is_open").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurants.id),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull().default(""),
  category: text("category").notNull().default("Mains"),
  isPopular: boolean("is_popular").notNull().default(false),
  isAvailable: boolean("is_available").notNull().default(true),
  spicy: boolean("spicy").notNull().default(false),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  trackingId: text("tracking_id").notNull().unique(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurants.id),
  riderId: integer("rider_id").references(() => users.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  items: jsonb("items").notNull().$type<OrderItem[]>(),
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull(),
  serviceFee: integer("service_fee").notNull().default(0),
  total: integer("total").notNull(),
  vendorEarning: integer("vendor_earning").notNull().default(0),
  riderEarning: integer("rider_earning").notNull().default(0),
  platformEarning: integer("platform_earning").notNull().default(0),
  address: text("address").notNull(),
  note: text("note").notNull().default(""),
  paymentMethod: text("payment_method").notNull().default("card"),
  etaMinutes: integer("eta_minutes").notNull().default(30),
  riderLat: doublePrecision("rider_lat"),
  riderLng: doublePrecision("rider_lng"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commissionSettings = pgTable("commission_settings", {
  id: serial("id").primaryKey(),
  vendorPercent: doublePrecision("vendor_percent").notNull().default(85),
  riderPercent: doublePrecision("rider_percent").notNull().default(10),
  platformPercent: doublePrecision("platform_percent").notNull().default(5),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  restaurants: many(restaurants),
}));

export const restaurantsRelations = relations(restaurants, ({ many, one }) => ({
  menuItems: many(menuItems),
  owner: one(users, { fields: [restaurants.ownerId], references: [users.id] }),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  restaurant: one(restaurants, { fields: [menuItems.restaurantId], references: [restaurants.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(users, { fields: [orders.customerId], references: [users.id] }),
  restaurant: one(restaurants, { fields: [orders.restaurantId], references: [restaurants.id] }),
  rider: one(users, { fields: [orders.riderId], references: [users.id] }),
}));

export type OrderItem = {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
};

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertRestaurantSchema = createInsertSchema(restaurants).omit({ id: true, createdAt: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(["customer", "merchant", "rider", "admin"]).default("customer"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type User = typeof users.$inferSelect;
export type PublicUser = Omit<User, "passwordHash">;
export type Restaurant = typeof restaurants.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type CommissionSetting = typeof commissionSettings.$inferSelect;
