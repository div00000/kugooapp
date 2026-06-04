import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RestaurantCard, type RestaurantLite } from "@/components/RestaurantCard";
import { cn } from "@/lib/utils";

export default function Restaurants() {
  const { data: restaurants, isLoading } = useQuery<RestaurantLite[]>({ queryKey: ["/api/restaurants"] });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set((restaurants ?? []).map((r) => r.category)))];

  const filtered = (restaurants ?? []).filter((r) => {
    const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === "All" || r.category === category;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="min-h-screen bg-kugoo-nude-light">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl bg-kugoo-green p-8 text-white sm:p-10">
          <h1 className="font-display text-3xl font-700 sm:text-4xl">Order from the best near you</h1>
          <p className="mt-2 text-white/70">Hot meals, groceries and essentials — delivered on time, everytime.</p>
          <div className="mt-6 flex items-center gap-2 rounded-full bg-white p-2">
            <Search className="ml-3 h-5 w-5 text-kugoo-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="w-full bg-transparent py-2 text-kugoo-ink outline-none"
            />
          </div>
        </div>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
          <SlidersHorizontal className="mt-2.5 h-5 w-5 shrink-0 text-kugoo-ink/40" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-600 transition",
                category === c ? "bg-kugoo-orange text-white" : "bg-white text-kugoo-ink/70 hover:bg-kugoo-nude",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => <RestaurantCard key={r.id} r={r} />)}
          </div>
        ) : (
          <div className="mt-16 text-center text-kugoo-ink/50">No restaurants match your search.</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
