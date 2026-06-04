import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Package, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { naira, STATUS_LABELS } from "@/lib/utils";

interface Order {
  id: number; trackingId: string; status: string; total: number; createdAt: string;
  items: { name: string; quantity: number }[];
}

const statusColor: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function Orders() {
  const { data: orders, isLoading } = useQuery<Order[]>({ queryKey: ["/api/orders/mine"] });

  return (
    <div className="min-h-screen bg-kugoo-nude-light">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-700 text-kugoo-ink">Your orders</h1>
        <p className="mt-1 text-kugoo-ink/60">Track current deliveries and revisit past orders.</p>

        {isLoading ? (
          <div className="mt-8 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-3xl bg-white/60" />)}</div>
        ) : orders?.length ? (
          <div className="mt-8 space-y-3">
            {orders.map((o) => (
              <Link key={o.id} href={`/track/${o.trackingId}`} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-soft transition hover:shadow-md">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-kugoo-nude text-kugoo-green"><Package className="h-6 w-6" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-600 text-kugoo-ink">{o.trackingId}</p>
                    <span className={`chip ${statusColor[o.status] ?? "bg-kugoo-orange/10 text-kugoo-orange"}`}>{STATUS_LABELS[o.status]}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-kugoo-ink/50">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-700 text-kugoo-green">{naira(o.total)}</p>
                  <ChevronRight className="ml-auto h-4 w-4 text-kugoo-ink/30" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl bg-white p-10 text-center shadow-soft">
            <Package className="mx-auto h-10 w-10 text-kugoo-green" />
            <p className="mt-3 text-kugoo-ink/60">No orders yet.</p>
            <Link href="/restaurants" className="btn-primary mt-5">Order now</Link>
          </div>
        )}
      </div>
    </div>
  );
}
