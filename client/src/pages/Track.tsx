import { useEffect, useState, useRef } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { Search, MapPin, Bike, Phone, Check, Package, Store, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { apiRequest } from "@/lib/queryClient";
import { naira, STATUS_LABELS, STATUS_STEPS } from "@/lib/utils";

interface TrackOrder {
  id: number; trackingId: string; status: string; total: number; etaMinutes: number;
  address: string; items: { name: string; quantity: number; price: number }[];
  riderLat: number | null; riderLng: number | null;
  restaurant: { name: string; lat: number; lng: number; imageUrl: string } | null;
  rider: { name: string; phone: string | null; avatarUrl: string | null } | null;
}

export default function Track() {
  const [, params] = useRoute("/track/:trackingId?");
  const [, navigate] = useLocation();
  const [input, setInput] = useState(params?.trackingId ?? "");
  const [order, setOrder] = useState<TrackOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const load = async (tid: string) => {
    setError(""); setLoading(true); setOrder(null);
    try {
      const data = await apiRequest("GET", `/api/orders/track/${tid}`);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.trackingId) load(params.trackingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.trackingId]);

  // WebSocket live updates
  useEffect(() => {
    if (!order) return;
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/ws`);
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ type: "subscribe", trackingId: order.trackingId }));
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "order_update") {
          setOrder((prev) => (prev ? { ...prev, ...msg.order } : prev));
        }
      } catch { /* ignore */ }
    };
    return () => ws.close();
  }, [order?.trackingId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) navigate(`/track/${input.trim().toUpperCase()}`);
  };

  const stepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const progress = order?.status === "delivered" ? 100 : Math.max(8, (stepIndex / (STATUS_STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-kugoo-nude-light">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-700 text-kugoo-ink">Track your order</h1>
        <p className="mt-1 text-kugoo-ink/60">Enter your tracking ID to see live delivery progress.</p>

        <form onSubmit={submit} className="mt-6 flex items-center gap-2 rounded-full bg-white p-2 shadow-soft">
          <Search className="ml-3 h-5 w-5 text-kugoo-ink/40" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. KG-2026-000001"
            className="w-full bg-transparent py-2 uppercase text-kugoo-ink outline-none"
          />
          <button type="submit" className="btn-primary px-6 py-2.5">Track</button>
        </form>

        {loading && <div className="mt-10 text-center text-kugoo-ink/50">Locating your order...</div>}
        {error && <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        {order && (
          <div className="mt-8 space-y-6">
            {/* Live map mock */}
            <div className="relative h-64 overflow-hidden rounded-3xl bg-kugoo-green">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
              {/* route line */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <line x1="15%" y1="75%" x2="80%" y2="25%" stroke="#F0592B" strokeWidth="3" strokeDasharray="8 8" />
              </svg>
              {/* vendor */}
              <div className="absolute left-[12%] top-[72%] flex flex-col items-center text-white">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-kugoo-green shadow-lg"><Store className="h-4 w-4" /></div>
              </div>
              {/* customer */}
              <div className="absolute right-[16%] top-[20%] flex flex-col items-center text-white">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-kugoo-nude text-kugoo-green shadow-lg"><MapPin className="h-4 w-4" /></div>
              </div>
              {/* rider moving */}
              <motion.div
                animate={{ left: ["18%", "76%"], top: ["70%", "26%"] }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute"
                style={{ left: `${18 + (order.status === "delivered" ? 58 : stepIndex * 8)}%` }}
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-kugoo-orange text-white shadow-glow"><Bike className="h-5 w-5" /></div>
              </motion.div>
              <div className="absolute bottom-3 left-3 rounded-2xl bg-white/90 px-4 py-2">
                <p className="text-xs text-kugoo-ink/60">Estimated arrival</p>
                <p className="font-display text-lg font-700 text-kugoo-green">
                  {order.status === "delivered" ? "Delivered 🎉" : `${order.etaMinutes} min`}
                </p>
              </div>
            </div>

            {/* Status header */}
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-kugoo-ink/40">Tracking ID</p>
                  <p className="font-display text-lg font-700 text-kugoo-ink">{order.trackingId}</p>
                </div>
                <span className="chip bg-kugoo-orange/10 text-kugoo-orange">{STATUS_LABELS[order.status]}</span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-kugoo-nude">
                <motion.div className="h-full rounded-full bg-kugoo-orange" animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} />
              </div>

              <div className="mt-5 space-y-3">
                {STATUS_STEPS.slice(0, 8).map((s, i) => {
                  const done = i <= stepIndex;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${done ? "bg-kugoo-green text-white" : "bg-kugoo-nude text-kugoo-ink/40"}`}>
                        {done ? <Check className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
                      </div>
                      <span className={`text-sm ${done ? "font-600 text-kugoo-ink" : "text-kugoo-ink/40"}`}>{STATUS_LABELS[s]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rider card */}
            {order.rider && (
              <div className="card flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  {order.rider.avatarUrl ? (
                    <img src={order.rider.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-kugoo-green text-white"><Bike className="h-6 w-6" /></div>
                  )}
                  <div>
                    <p className="font-600 text-kugoo-ink">{order.rider.name}</p>
                    <p className="text-xs text-kugoo-ink/50">Your Kugoo rider</p>
                  </div>
                </div>
                <a href={`tel:${order.rider.phone ?? ""}`} className="grid h-11 w-11 place-items-center rounded-full bg-kugoo-green text-white"><Phone className="h-5 w-5" /></a>
              </div>
            )}

            {/* Order summary */}
            <div className="card p-5">
              <h3 className="font-display font-600">Order summary</h3>
              <p className="mt-1 text-sm text-kugoo-ink/60">{order.restaurant?.name}</p>
              <div className="mt-3 space-y-1 text-sm">
                {order.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-kugoo-ink/70">{it.quantity}× {it.name}</span>
                    <span className="font-600">{naira(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-kugoo-nude-dark pt-3">
                <span className="font-700">Total</span>
                <span className="font-display font-700 text-kugoo-green">{naira(order.total)}</span>
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-xs text-kugoo-ink/50"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {order.address}</p>
            </div>

            <div className="rounded-3xl bg-kugoo-green/5 p-4 text-center text-sm text-kugoo-green">
              <Sparkles className="mx-auto mb-1 h-4 w-4" />
              Ask Zaam "Where is my rider?" for instant updates anytime.
            </div>
          </div>
        )}

        {!order && !loading && !error && (
          <div className="mt-10 rounded-3xl bg-white p-8 text-center shadow-soft">
            <Package className="mx-auto h-10 w-10 text-kugoo-green" />
            <p className="mt-3 text-kugoo-ink/60">Your live tracking will appear here. Try a demo: place an order, or <Link href="/orders" className="font-600 text-kugoo-orange">view your orders</Link>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
