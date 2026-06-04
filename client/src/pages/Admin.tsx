import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Users, Store, Bike, DollarSign, ShoppingBag, TrendingUp, Save, Loader2 } from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { naira, STATUS_LABELS, cn } from "@/lib/utils";

interface Stats {
  totalUsers: number; totalRestaurants: number; totalRiders: number; totalOrders: number;
  totalRevenue: number; platformCommission: number;
  ordersByStatus: Record<string, number>;
  recentOrders: { id: number; trackingId: string; status: string; total: number; restaurantName: string }[];
  topRestaurants: { name: string; orders: number; revenue: number }[];
}
interface Commission { id: number; vendorPercent: number; riderPercent: number; platformPercent: number; }

export default function Admin() {
  const { data: stats } = useQuery<Stats>({ queryKey: ["/api/admin/stats"], refetchInterval: 8000 });
  const { data: commission } = useQuery<Commission>({ queryKey: ["/api/admin/commission"] });

  return (
    <DashboardShell title="Admin Control Center" subtitle="Platform-wide analytics, commissions and operations.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Users" value={String(stats?.totalUsers ?? "—")} icon={Users} />
        <StatCard label="Restaurants" value={String(stats?.totalRestaurants ?? "—")} icon={Store} />
        <StatCard label="Riders" value={String(stats?.totalRiders ?? "—")} icon={Bike} />
        <StatCard label="Orders" value={String(stats?.totalOrders ?? "—")} icon={ShoppingBag} />
        <StatCard label="GMV" value={stats ? naira(stats.totalRevenue) : "—"} icon={DollarSign} />
        <StatCard label="Commission" value={stats ? naira(stats.platformCommission) : "—"} icon={TrendingUp} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-700 text-kugoo-ink">Recent orders</h2>
          <div className="mt-4 space-y-2">
            {(stats?.recentOrders ?? []).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-2xl bg-kugoo-nude-light px-4 py-3">
                <div>
                  <p className="font-600 text-kugoo-ink">{o.trackingId}</p>
                  <p className="text-xs text-kugoo-ink/50">{o.restaurantName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="chip bg-kugoo-orange/10 text-kugoo-orange">{STATUS_LABELS[o.status]}</span>
                  <span className="font-display font-700 text-kugoo-green">{naira(o.total)}</span>
                </div>
              </div>
            ))}
            {(stats?.recentOrders ?? []).length === 0 && <p className="py-8 text-center text-kugoo-ink/50">No orders yet.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display text-lg font-700 text-kugoo-ink">Orders by status</h2>
            <div className="mt-4 space-y-2">
              {Object.entries(stats?.ordersByStatus ?? {}).map(([s, n]) => (
                <div key={s} className="flex items-center justify-between text-sm">
                  <span className="text-kugoo-ink/60">{STATUS_LABELS[s] ?? s}</span>
                  <span className="font-600 text-kugoo-ink">{n}</span>
                </div>
              ))}
            </div>
          </div>
          <CommissionCard commission={commission} />
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h2 className="font-display text-lg font-700 text-kugoo-ink">Top restaurants</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(stats?.topRestaurants ?? []).map((r, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-kugoo-nude-light p-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-kugoo-green font-display font-700 text-white">{i + 1}</div>
              <div>
                <p className="font-600 text-kugoo-ink">{r.name}</p>
                <p className="text-xs text-kugoo-ink/50">{r.orders} orders · {naira(r.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

function CommissionCard({ commission }: { commission?: Commission }) {
  const [form, setForm] = useState<Commission | null>(null);
  const current = form ?? commission;
  const save = useMutation({
    mutationFn: () => apiRequest("PATCH", "/api/admin/commission", {
      vendorPercent: current?.vendorPercent, riderPercent: current?.riderPercent, platformPercent: current?.platformPercent,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/commission"] }),
  });
  if (!current) return null;
  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-700 text-kugoo-ink">Commission settings</h2>
      <div className="mt-4 space-y-3">
        {([["vendorPercent", "Vendor commission %"], ["riderPercent", "Rider commission %"], ["platformPercent", "Platform fee %"]] as const).map(([key, label]) => (
          <div key={key}>
            <label className="text-xs text-kugoo-ink/50">{label}</label>
            <input
              type="number"
              value={current[key]}
              onChange={(e) => setForm({ ...current, [key]: Number(e.target.value) })}
              className="input mt-1"
            />
          </div>
        ))}
      </div>
      <button onClick={() => save.mutate()} disabled={save.isPending} className={cn("btn-primary mt-4 w-full py-2.5 text-sm")}>
        {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save changes</>}
      </button>
      {save.isSuccess && <p className="mt-2 text-center text-xs text-kugoo-green">Saved!</p>}
    </div>
  );
}
