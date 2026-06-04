import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bike, DollarSign, Package, MapPin, Check, Navigation, Power } from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { naira, STATUS_LABELS, cn } from "@/lib/utils";

interface Order {
  id: number; trackingId: string; status: string; total: number; riderEarning: number; address: string;
  items: { name: string; quantity: number }[]; restaurant?: { name: string };
}
const nextStatus: Record<string, string> = { rider_assigned: "picked_up", picked_up: "delivering", delivering: "delivered" };

export default function Rider() {
  const [online, setOnline] = useState(true);
  const { data: available } = useQuery<Order[]>({ queryKey: ["/api/rider/available"], refetchInterval: 5000 });
  const { data: mine } = useQuery<Order[]>({ queryKey: ["/api/rider/mine"], refetchInterval: 5000 });

  const accept = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/rider/accept/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/rider/available"] }); queryClient.invalidateQueries({ queryKey: ["/api/rider/mine"] }); },
  });
  const advance = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => apiRequest("PATCH", `/api/orders/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/rider/mine"] }),
  });

  const activeJobs = (mine ?? []).filter((o) => !["delivered", "cancelled"].includes(o.status));
  const completed = (mine ?? []).filter((o) => o.status === "delivered");
  const earnings = completed.reduce((s, o) => s + o.riderEarning, 0);

  return (
    <DashboardShell title="Rider Dashboard" subtitle="Accept deliveries, navigate and earn." accent="orange">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active jobs" value={String(activeJobs.length)} icon={Bike} />
        <StatCard label="Completed" value={String(completed.length)} icon={Check} />
        <StatCard label="Lifetime earnings" value={naira(earnings)} icon={DollarSign} />
        <StatCard label="Available now" value={String(available?.length ?? 0)} icon={Package} />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-3xl bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className={cn("grid h-11 w-11 place-items-center rounded-full", online ? "bg-kugoo-green text-white" : "bg-kugoo-nude text-kugoo-ink/40")}><Power className="h-5 w-5" /></div>
          <div>
            <p className="font-600 text-kugoo-ink">{online ? "You're online" : "You're offline"}</p>
            <p className="text-xs text-kugoo-ink/50">{online ? "Receiving delivery requests" : "Turn on to receive requests"}</p>
          </div>
        </div>
        <button onClick={() => setOnline((v) => !v)} className={cn("flex h-7 w-12 items-center rounded-full p-1 transition", online ? "bg-kugoo-green" : "bg-kugoo-nude-dark")}>
          <div className={cn("h-5 w-5 rounded-full bg-white transition", online && "translate-x-5")} />
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-700 text-kugoo-ink">Active deliveries</h2>
          <div className="mt-3 space-y-3">
            {activeJobs.length === 0 && <div className="card p-8 text-center text-kugoo-ink/50">No active deliveries.</div>}
            {activeJobs.map((o) => (
              <div key={o.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <p className="font-600 text-kugoo-ink">{o.trackingId}</p>
                  <span className="chip bg-kugoo-orange/10 text-kugoo-orange">{STATUS_LABELS[o.status]}</span>
                </div>
                <p className="mt-2 text-sm text-kugoo-ink/60">{o.restaurant?.name}</p>
                <p className="mt-1 flex items-start gap-1.5 text-sm text-kugoo-ink/70"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-kugoo-green" /> {o.address}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display font-700 text-kugoo-green">+{naira(o.riderEarning)}</span>
                  {nextStatus[o.status] && (
                    <button onClick={() => advance.mutate({ id: o.id, status: nextStatus[o.status] })} className="btn-primary px-4 py-2 text-sm">
                      <Navigation className="h-4 w-4" />
                      {o.status === "rider_assigned" ? "Confirm pickup" : o.status === "picked_up" ? "Start delivery" : "Mark delivered"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-700 text-kugoo-ink">Available requests</h2>
          <div className="mt-3 space-y-3">
            {!online && <div className="card p-8 text-center text-kugoo-ink/50">Go online to see requests.</div>}
            {online && (available ?? []).length === 0 && <div className="card p-8 text-center text-kugoo-ink/50">No requests right now. Hang tight!</div>}
            {online && (available ?? []).map((o) => (
              <div key={o.id} className="card border-2 border-kugoo-orange/20 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-600 text-kugoo-ink">{o.restaurant?.name}</p>
                  <span className="font-display font-700 text-kugoo-orange">+{naira(o.riderEarning)}</span>
                </div>
                <p className="mt-1 flex items-start gap-1.5 text-sm text-kugoo-ink/70"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-kugoo-green" /> {o.address}</p>
                <button onClick={() => accept.mutate(o.id)} disabled={accept.isPending} className="btn-secondary mt-4 w-full py-2.5 text-sm">
                  <Check className="h-4 w-4" /> Accept delivery
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
