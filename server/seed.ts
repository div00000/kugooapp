import { db, pool } from "./db";
import { users, restaurants, menuItems, orders, commissionSettings } from "@shared/schema";
import { hashPassword } from "./auth";

const img = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

async function seed() {
  console.log("🌱 Seeding Kugoo database...");

  await db.delete(orders);
  await db.delete(menuItems);
  await db.delete(restaurants);
  await db.delete(users);
  await db.delete(commissionSettings);

  await db.insert(commissionSettings).values({ vendorPercent: 85, riderPercent: 10, platformPercent: 5 });

  const pw = await hashPassword("password123");
  const [customer, merchant, rider, admin, rider2] = await db
    .insert(users)
    .values([
      { name: "Ada Okeke", email: "customer@kugoo.app", phone: "+2348100000001", passwordHash: pw, role: "customer", avatarUrl: img("photo-1494790108377-be9c29b29330", 200) },
      { name: "Chef Bisi", email: "merchant@kugoo.app", phone: "+2348100000002", passwordHash: pw, role: "merchant", avatarUrl: img("photo-1577219491135-ce391730fb2c", 200) },
      { name: "Emeka Rider", email: "rider@kugoo.app", phone: "+2348100000003", passwordHash: pw, role: "rider", avatarUrl: img("photo-1599566150163-29194dcaad36", 200) },
      { name: "Kugoo Admin", email: "admin@kugoo.app", phone: "+2348100000004", passwordHash: pw, role: "admin" },
      { name: "Tunde Wheels", email: "rider2@kugoo.app", phone: "+2348100000005", passwordHash: pw, role: "rider" },
    ])
    .returning();

  const restaurantData = [
    {
      ownerId: merchant.id,
      name: "Mama's Jollof Palace",
      description: "Authentic Nigerian jollof, grilled meats and party rice cooked the traditional way.",
      category: "Nigerian",
      imageUrl: img("photo-1604329760661-e71dc83f8f26", 600),
      coverUrl: img("photo-1604329760661-e71dc83f8f26", 1200),
      rating: 4.9, reviewCount: 1240, deliveryTime: 22, deliveryFee: 600, minOrder: 2000,
      isFeatured: true, isTrending: true,
      menu: [
        { name: "Party Jollof Rice", description: "Smoky party jollof with fried plantain", price: 3500, category: "Mains", isPopular: true, spicy: true, imageUrl: img("photo-1596797038530-2c107229654b") },
        { name: "Jollof + Grilled Chicken", description: "Jollof rice with peppered grilled chicken", price: 5500, category: "Mains", isPopular: true, imageUrl: img("photo-1532550907401-a500c9a57435") },
        { name: "Fried Rice Special", description: "Nigerian fried rice with mixed veggies", price: 4000, category: "Mains", imageUrl: img("photo-1603133872878-684f208fb84b") },
        { name: "Suya Platter", description: "Spicy grilled beef skewers with yaji", price: 4500, category: "Grills", spicy: true, imageUrl: img("photo-1555939594-58d7cb561ad1") },
      ],
    },
    {
      ownerId: null,
      name: "Burger Republic",
      description: "Juicy smash burgers, loaded fries and thick milkshakes.",
      category: "Fast Food",
      imageUrl: img("photo-1568901346375-23c9450c58cd", 600),
      coverUrl: img("photo-1571091718767-18b5b1457add", 1200),
      rating: 4.7, reviewCount: 980, deliveryTime: 28, deliveryFee: 700, minOrder: 1500,
      isFeatured: true, isTrending: true,
      menu: [
        { name: "Classic Smash Burger", description: "Double beef, cheddar, secret sauce", price: 4800, category: "Burgers", isPopular: true, imageUrl: img("photo-1568901346375-23c9450c58cd") },
        { name: "Crispy Chicken Burger", description: "Buttermilk fried chicken, slaw", price: 4500, category: "Burgers", imageUrl: img("photo-1606755962773-d324e0a13086") },
        { name: "Loaded Fries", description: "Cheese, bacon bits, jalapeños", price: 2500, category: "Sides", spicy: true, imageUrl: img("photo-1573080496219-bb080dd4f877") },
        { name: "Oreo Milkshake", description: "Thick vanilla shake with Oreo", price: 2200, category: "Drinks", imageUrl: img("photo-1572490122747-3968b75cc699") },
      ],
    },
    {
      ownerId: null,
      name: "Pizza Lagos",
      description: "Stone-baked artisan pizzas with bold local toppings.",
      category: "Pizza",
      imageUrl: img("photo-1513104890138-7c749659a591", 600),
      coverUrl: img("photo-1513104890138-7c749659a591", 1200),
      rating: 4.8, reviewCount: 1530, deliveryTime: 32, deliveryFee: 800, minOrder: 3000,
      isFeatured: true, isTrending: false,
      menu: [
        { name: "Pepperoni Supreme", description: "Loaded pepperoni & mozzarella", price: 6500, category: "Pizza", isPopular: true, imageUrl: img("photo-1628840042765-356cda07504e") },
        { name: "BBQ Chicken Pizza", description: "Smoky BBQ chicken & onions", price: 7000, category: "Pizza", imageUrl: img("photo-1565299624946-b28f40a0ae38") },
        { name: "Margherita", description: "Classic tomato, basil, mozzarella", price: 5500, category: "Pizza", imageUrl: img("photo-1574071318508-1cdbab80d002") },
      ],
    },
    {
      ownerId: null,
      name: "Green Bowl",
      description: "Fresh salads, healthy bowls and cold-pressed juices.",
      category: "Healthy",
      imageUrl: img("photo-1512621776951-a57141f2eefd", 600),
      coverUrl: img("photo-1512621776951-a57141f2eefd", 1200),
      rating: 4.6, reviewCount: 640, deliveryTime: 20, deliveryFee: 600, minOrder: 2000,
      isTrending: true,
      menu: [
        { name: "Grilled Chicken Bowl", description: "Quinoa, greens, avocado", price: 5000, category: "Bowls", isPopular: true, imageUrl: img("photo-1546069901-ba9599a7e63c") },
        { name: "Caesar Salad", description: "Romaine, parmesan, croutons", price: 3800, category: "Salads", imageUrl: img("photo-1550304943-4f24f54ddde9") },
        { name: "Green Detox Juice", description: "Apple, cucumber, ginger, mint", price: 2000, category: "Drinks", imageUrl: img("photo-1622597467836-f3285f2131b8") },
      ],
    },
    {
      ownerId: null,
      name: "Sweet Tooth Bakery",
      description: "Decadent cakes, pastries and desserts baked fresh daily.",
      category: "Desserts",
      imageUrl: img("photo-1551024601-bec78aea704b", 600),
      coverUrl: img("photo-1486427944299-d1955d23e34d", 1200),
      rating: 4.9, reviewCount: 870, deliveryTime: 25, deliveryFee: 700, minOrder: 1500,
      isFeatured: false, isTrending: false,
      menu: [
        { name: "Red Velvet Slice", description: "Cream cheese frosting", price: 2800, category: "Cakes", isPopular: true, imageUrl: img("photo-1586788680434-30d324b2d46f") },
        { name: "Chocolate Donuts (6)", description: "Glazed chocolate donuts", price: 3500, category: "Pastries", imageUrl: img("photo-1551024506-0bccd828d307") },
        { name: "Cheesecake", description: "New York style cheesecake", price: 3200, category: "Cakes", imageUrl: img("photo-1533134242443-d4fd215305ad") },
      ],
    },
    {
      ownerId: null,
      name: "Shawarma King",
      description: "Loaded shawarmas, wraps and Middle-Eastern grills.",
      category: "Shawarma",
      imageUrl: img("photo-1561651823-34feb02250e4", 600),
      coverUrl: img("photo-1561651823-34feb02250e4", 1200),
      rating: 4.5, reviewCount: 1120, deliveryTime: 18, deliveryFee: 500, minOrder: 1000,
      isTrending: true,
      menu: [
        { name: "Double Chicken Shawarma", description: "Extra chicken, garlic sauce", price: 3000, category: "Wraps", isPopular: true, spicy: true, imageUrl: img("photo-1561651823-34feb02250e4") },
        { name: "Beef Shawarma", description: "Tender beef, pickles, sauce", price: 3200, category: "Wraps", imageUrl: img("photo-1529006557810-274b9b2fc783") },
        { name: "Falafel Wrap", description: "Crispy falafel, hummus, tahini", price: 2500, category: "Wraps", imageUrl: img("photo-1615870216519-2f9fa575fa5c") },
      ],
    },
  ];

  let firstRestaurantId = 0;
  const createdRestaurants: number[] = [];
  for (const r of restaurantData) {
    const { menu, ...rest } = r;
    const [created] = await db.insert(restaurants).values(rest).returning();
    if (!firstRestaurantId) firstRestaurantId = created.id;
    createdRestaurants.push(created.id);
    await db.insert(menuItems).values(menu.map((m) => ({ ...m, restaurantId: created.id })));
  }

  // A couple of demo orders for the customer at various stages
  const commission = { vendor: 85, riderP: 10 };
  const makeOrder = async (status: any, restaurantId: number, riderId: number | null) => {
    const subtotal = 8500;
    const deliveryFee = 600;
    const serviceFee = Math.round(subtotal * 0.03);
    const total = subtotal + deliveryFee + serviceFee;
    const vendorEarning = Math.round((subtotal * commission.vendor) / 100);
    const riderEarning = Math.round((subtotal * commission.riderP) / 100) + deliveryFee;
    const year = new Date().getFullYear();
    const trackingId = `KG-${year}-${Math.floor(100000 + Math.random() * 899999)}`;
    await db.insert(orders).values({
      trackingId,
      customerId: customer.id,
      restaurantId,
      riderId,
      status,
      items: [
        { menuItemId: 1, name: "Party Jollof Rice", price: 3500, quantity: 1 },
        { menuItemId: 2, name: "Jollof + Grilled Chicken", price: 5000, quantity: 1 },
      ],
      subtotal, deliveryFee, serviceFee, total,
      vendorEarning, riderEarning, platformEarning: total - vendorEarning - riderEarning,
      address: "12 Admiralty Way, Lekki Phase 1, Lagos",
      paymentMethod: "card",
      etaMinutes: 18,
    });
  };
  await makeOrder("delivering", createdRestaurants[0], rider.id);
  await makeOrder("preparing", createdRestaurants[1], null);
  await makeOrder("delivered", createdRestaurants[2], rider.id);

  console.log("✅ Seed complete!");
  console.log("Demo logins (password: password123):");
  console.log("  customer@kugoo.app | merchant@kugoo.app | rider@kugoo.app | admin@kugoo.app");
  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
