import { storage } from "./storage";

const naira = (n: number) => `₦${n.toLocaleString()}`;

export async function askZaam(message: string): Promise<{ reply: string; suggestions?: string[] }> {
  const text = message.toLowerCase().trim();

  // Tracking intent
  const trackMatch = text.match(/kg-\d{4}-[a-z0-9]{4,}/i);
  if (trackMatch || text.includes("track") || text.includes("where is my")) {
    if (trackMatch) {
      const order = await storage.getOrderByTracking(trackMatch[0]);
      if (order) {
        const r = await storage.getRestaurant(order.restaurantId);
        return {
          reply: `Order ${order.trackingId} from ${r?.name ?? "the vendor"} is currently "${order.status.replace(/_/g, " ")}". Estimated arrival in about ${order.etaMinutes} minutes. ${order.status === "delivering" ? "Your rider is on the way! 🛵" : ""}`,
        };
      }
      return { reply: `Hmm, I couldn't find an order with ID ${trackMatch[0]}. Please double-check the tracking ID.` };
    }
    return {
      reply: "Sure! Share your tracking ID (like KG-2026-XXXXXX) and I'll tell you exactly where your food is.",
      suggestions: ["Track my last order", "Show nearby restaurants"],
    };
  }

  // Recommendation / discovery
  if (text.includes("recommend") || text.includes("nearby") || text.includes("restaurant") || text.includes("hungry") || text.includes("food") || text.includes("show")) {
    const restaurants = await storage.listRestaurants();
    const top = restaurants.slice(0, 3);
    if (top.length) {
      const list = top.map((r) => `• ${r.name} — ${r.category}, ⭐ ${r.rating} (${r.deliveryTime} min)`).join("\n");
      return {
        reply: `Here are some top picks near you:\n${list}\n\nWant me to open one of these for you?`,
        suggestions: top.map((r) => `Order from ${r.name}`),
      };
    }
  }

  // Budget intent e.g. "spicy rice under 5000"
  const budgetMatch = text.match(/under\s*₦?\s*(\d[\d,]*)/);
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1].replace(/,/g, ""), 10);
    const restaurants = await storage.listRestaurants();
    const matches: { name: string; item: string; price: number }[] = [];
    for (const r of restaurants) {
      const items = await storage.listMenuItems(r.id);
      for (const i of items) {
        if (i.price <= budget && (!text.includes("spicy") || i.spicy)) {
          matches.push({ name: r.name, item: i.name, price: i.price });
        }
      }
    }
    if (matches.length) {
      const list = matches.slice(0, 4).map((m) => `• ${m.item} — ${naira(m.price)} at ${m.name}`).join("\n");
      return { reply: `Great picks under ${naira(budget)}:\n${list}` };
    }
    return { reply: `I couldn't find matching meals under ${naira(budget)} right now, but new vendors join daily!` };
  }

  // Promotions
  if (text.includes("promo") || text.includes("discount") || text.includes("offer")) {
    return {
      reply: "🎉 Today's promo: Free delivery on your first order over ₦5,000, plus 10% off from featured vendors. Want me to show featured restaurants?",
      suggestions: ["Show featured restaurants"],
    };
  }

  // Greeting / fallback
  if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.length < 3) {
    return {
      reply: "Hi, I'm Zaam — your Kugoo food assistant! 🍔 I can recommend meals, find restaurants, and track your deliveries. What are you craving?",
      suggestions: ["Recommend food", "Show nearby restaurants", "Today's promotion"],
    };
  }

  return {
    reply: "I'm Zaam, here to help you order and track food on Kugoo. Try asking me to recommend a meal, show nearby restaurants, or track an order with its KG- tracking ID.",
    suggestions: ["Recommend food", "Show nearby restaurants", "Today's promotion"],
  };
}
