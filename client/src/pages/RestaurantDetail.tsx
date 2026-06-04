import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, Bike, Plus, Minus, ShoppingBag, Flame, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { naira, cn } from "@/lib/utils";

interface MenuItem {
  id: number; name: string; description: string; price: number; imageUrl: string;
  category: string; isPopular: boolean; spicy: boolean; isAvailable: boolean;
}
interface RestaurantFull {
  id: number; name: string; description: string; category: string; coverUrl: string; imageUrl: string;
  rating: number; reviewCount: number; deliveryTime: number; deliveryFee: number; minOrder: number;
  address: string; menu: MenuItem[];
}

export default function RestaurantDetail() {
  const [, params] = useRoute("/restaurant/:id");
  const id = Number(params?.id);
  const { data: r, isLoading } = useQuery<RestaurantFull>({ queryKey: [`/api/restaurants/${id}`] });
  const { addItem, count, subtotal } = useCart();
  const [activeCat, setActiveCat] = useState<string>("");

  if (isLoading || !r) {
    return (
      <div className="min-h-screen bg-kugoo-nude-light">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="h-64 animate-pulse rounded-3xl bg-white/60" />
        </div>
      </div>
    );
  }

  const cats = Array.from(new Set(r.menu.map((m) => m.category)));
  const visibleCat = activeCat || cats[0];

  return (
    <div className="min-h-screen bg-kugoo-nude-light pb-24">
      <Navbar />

      <div className="relative h-56 sm:h-72">
        <img src={r.coverUrl || r.imageUrl} alt={r.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <Link href="/restaurants" className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-kugoo-ink">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="-mt-16 rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="chip bg-kugoo-orange/10 text-kugoo-orange">{r.category}</span>
              <h1 className="mt-2 font-display text-3xl font-700 text-kugoo-ink">{r.name}</h1>
              <p className="mt-1 max-w-xl text-sm text-kugoo-ink/60">{r.description}</p>
              <p className="mt-1 text-xs text-kugoo-ink/40">{r.address}</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center"><Star className="mx-auto h-5 w-5 fill-kugoo-green text-kugoo-green" /><p className="mt-1 font-600">{r.rating}</p><p className="text-xs text-kugoo-ink/50">{r.reviewCount}</p></div>
              <div className="text-center"><Clock className="mx-auto h-5 w-5 text-kugoo-green" /><p className="mt-1 font-600">{r.deliveryTime}m</p><p className="text-xs text-kugoo-ink/50">delivery</p></div>
              <div className="text-center"><Bike className="mx-auto h-5 w-5 text-kugoo-green" /><p className="mt-1 font-600">{naira(r.deliveryFee)}</p><p className="text-xs text-kugoo-ink/50">fee</p></div>
            </div>
          </div>
        </div>

        <div className="no-scrollbar sticky top-16 z-20 mt-6 flex gap-2 overflow-x-auto bg-kugoo-nude-light py-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-600 transition",
                visibleCat === c ? "bg-kugoo-green text-white" : "bg-white text-kugoo-ink/70",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {r.menu.filter((m) => m.category === visibleCat).map((m) => (
            <div key={m.id} className="flex gap-4 rounded-3xl bg-white p-3 shadow-soft">
              <img src={m.imageUrl} alt={m.name} className="h-24 w-24 shrink-0 rounded-2xl object-cover" loading="lazy" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start gap-2">
                  <h3 className="font-600 text-kugoo-ink">{m.name}</h3>
                  {m.isPopular && <span className="chip bg-kugoo-orange/10 text-kugoo-orange">Popular</span>}
                  {m.spicy && <Flame className="h-4 w-4 text-kugoo-orange" />}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-kugoo-ink/60">{m.description}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-display font-600 text-kugoo-green">{naira(m.price)}</span>
                  <button
                    onClick={() => addItem({ menuItemId: m.id, name: m.name, price: m.price, quantity: 1, imageUrl: m.imageUrl }, r.id, r.name)}
                    className="flex items-center gap-1 rounded-full bg-kugoo-orange px-3 py-1.5 text-sm font-600 text-white transition hover:bg-kugoo-orange-dark active:scale-95"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
          >
            <Link href="/checkout" className="flex items-center justify-between rounded-full bg-kugoo-green px-6 py-4 text-white shadow-2xl">
              <span className="flex items-center gap-2 font-600"><ShoppingBag className="h-5 w-5" /> {count} item{count > 1 ? "s" : ""}</span>
              <span className="font-display font-700">View cart · {naira(subtotal)}</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
