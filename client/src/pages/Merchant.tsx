import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Store, DollarSign, ShoppingBag, TrendingUp, Plus, Check, X, Clock, Trash2, Loader2 } from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { naira, STATUS_LABELS, cn } from "@/lib/utils";

interface MenuItem { id: number; name: string; price: number; category: string; description: string; imageUrl: string; isAvailable: boolean; }
interface Restaurant { id: number; name: string; description: string; rating: number; menu: MenuItem[]; }
interface Order { id: number; trackingId: string; status: string; total: number; vendorEarning: number; items: { name: string; quantity: number }[]; createdAt: string; }

const nextStatus: Record<string, string> = { pending: "accepted", accepted: "preparing", preparing: "ready" };

export default function Merchant() {
  const { data: restaurant } = useQuery<Restaurant>({ queryKey: ["/api/merchant/restaurant"] });
  const { data: orders } = useQuery<Order[]>({ queryKey: ["/api/merchant/orders"] });
  const [tab, setTab] = useState<"orders" | "menu">("orders");
  const [showAdd, setShowAdd] = useState(false);

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => apiRequest("PATCH", `/api/orders/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/merchant/orders"] }),
  });
  const deleteItem = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/merchant/menu/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/merchant/restaurant"] }),
  });

  const activeOrders = (orders ?? []).filter((o) => !["delivered", "cancelled"].includes(o.status));
  const revenue = (orders ?? []).filter((o) => o.status === "delivered").reduce((s, o) => s + o.vendorEarning, 0);
  const today = (orders ?? []).length;

  return (
    <DashboardShell title={`${restaurant?.name ?? "Merchant"} Portal`} subtitle="Manage your menu, process orders and track revenue.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active orders" value={String(activeOrders.length)} icon={Clock} />
        <StatCard label="Total orders" value={String(today)} icon={ShoppingBag} />
        <StatCard label="Earnings (delivered)" value={naira(revenue)} icon={DollarSign} />
        <StatCard label="Rating" value={`${restaurant?.rating ?? "—"} ⭐`} icon={TrendingUp} />
      </div>

      <div className="mt-8 flex gap-2">
        {(["orders", "menu"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("rounded-full px-5 py-2 text-sm font-600 capitalize", tab === t ? "bg-kugoo-green text-white" : "bg-white text-kugoo-ink/60")}>{t}</button>
        ))}
      </div>

      {tab === "orders" ? (
        <div className="mt-5 space-y-3">
          {(orders ?? []).length === 0 && <div className="card p-10 text-center text-kugoo-ink/50">No orders yet.</div>}
          {(orders ?? []).map((o) => (
            <div key={o.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-600 text-kugoo-ink">{o.trackingId}</p>
                  <span className="chip bg-kugoo-orange/10 text-kugoo-orange">{STATUS_LABELS[o.status]}</span>
                </div>
                <p className="mt-1 text-sm text-kugoo-ink/60">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display font-700 text-kugoo-green">{naira(o.total)}</span>
                {nextStatus[o.status] && (
                  <button onClick={() => updateStatus.mutate({ id: o.id, status: nextStatus[o.status] })} className="btn-primary px-4 py-2 text-sm">
                    <Check className="h-4 w-4" /> {nextStatus[o.status] === "accepted" ? "Accept" : nextStatus[o.status] === "ready" ? "Mark ready" : "Start prep"}
                  </button>
                )}
                {o.status === "pending" && (
                  <button onClick={() => updateStatus.mutate({ id: o.id, status: "cancelled" })} className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-500"><X className="h-4 w-4" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex justify-end">
            <button onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2 text-sm"><Plus className="h-4 w-4" /> Add item</button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {restaurant?.menu.map((m) => (
              <div key={m.id} className="card flex items-center gap-3 p-3">
                <img src={m.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-600 text-kugoo-ink">{m.name}</p>
                  <p className="text-sm text-kugoo-green">{naira(m.price)} · {m.category}</p>
                </div>
                <button onClick={() => deleteItem.mutate(m.id)} className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} />}
    </DashboardShell>
  );
}

function AddItemModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", price: "", category: "Mains", description: "", imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" });
  const add = useMutation({
    mutationFn: () => apiRequest("POST", "/api/merchant/menu", { ...form, price: Number(form.price) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/merchant/restaurant"] }); onClose(); },
  });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-xl font-700">Add menu item</h2>
        <div className="mt-4 space-y-3">
          <input placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          <input placeholder="Price (₦)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input resize-none" />
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={() => add.mutate()} disabled={!form.name || !form.price || add.isPending} className="btn-primary flex-1">
            {add.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add item"}
          </button>
        </div>
      </div>
    </div>
  );
}
