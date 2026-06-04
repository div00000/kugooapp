import { Link } from "wouter";
import { Star, Clock, Bike } from "lucide-react";
import { motion } from "framer-motion";
import { naira } from "@/lib/utils";

export interface RestaurantLite {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  deliveryTime: number;
  deliveryFee: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isOpen?: boolean;
}

export function RestaurantCard({ r }: { r: RestaurantLite }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
      <Link href={`/restaurant/${r.id}`} className="group block overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="relative h-44 overflow-hidden">
          <img
            src={r.imageUrl}
            alt={r.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {r.isTrending && <span className="chip bg-kugoo-orange text-white">🔥 Trending</span>}
            {r.isFeatured && <span className="chip bg-white/90 text-kugoo-green">⭐ Featured</span>}
          </div>
          <div className="absolute bottom-3 right-3 chip bg-white/90 text-kugoo-ink">
            <Clock className="h-3 w-3" /> {r.deliveryTime} min
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-600 text-kugoo-ink">{r.name}</h3>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-kugoo-green/10 px-2 py-0.5 text-sm font-600 text-kugoo-green">
              <Star className="h-3.5 w-3.5 fill-kugoo-green" /> {r.rating}
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-kugoo-ink/60">{r.category} · {r.description}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-kugoo-ink/60">
            <span className="flex items-center gap-1"><Bike className="h-3.5 w-3.5" /> {naira(r.deliveryFee)} delivery</span>
            <span>{r.reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
