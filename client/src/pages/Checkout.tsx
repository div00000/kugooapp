import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, CreditCard, Wallet, Building2, ShoppingBag, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { naira, cn } from "@/lib/utils";

const payments = [
  { value: "card", label: "Card", icon: CreditCard },
  { value: "wallet", label: "Wallet", icon: Wallet },
  { value: "transfer", label: "Bank transfer", icon: Building2 },
];

export default function Checkout() {
  const { items, restaurantId, restaurantName, updateQty, removeItem, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [address, setAddress] = useState("12 Admiralty Way, Lekki Phase 1, Lagos");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = items.length ? 600 : 0;
  const serviceFee = Math.round(subtotal * 0.03);
  const total = subtotal + deliveryFee + serviceFee;

  const placeOrder = async () => {
    if (!user) return navigate("/login");
    setError("");
    setLoading(true);
    try {
      const order = await apiRequest("POST", "/api/orders", {
        restaurantId,
        items: items.map((i) => ({ menuItemId: i.menuItemId, name: i.name, price: i.price, quantity: i.quantity })),
        address,
        note,
        paymentMethod: payment,
      });
      clear();
      navigate(`/track/${order.trackingId}`);
    } catch (err: any) {
      setError(err.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-kugoo-nude-light">
        <Navbar />
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-kugoo-nude"><ShoppingBag className="h-9 w-9 text-kugoo-green" /></div>
          <h1 className="mt-6 font-display text-2xl font-700 text-kugoo-ink">Your cart is empty</h1>
          <p className="mt-2 text-kugoo-ink/60">Add some delicious meals to get started.</p>
          <Link href="/restaurants" className="btn-primary mt-6">Browse restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kugoo-nude-light">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-700 text-kugoo-ink">Checkout</h1>
        <p className="mt-1 text-kugoo-ink/60">From <span className="font-600 text-kugoo-green">{restaurantName}</span></p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Items */}
            <div className="card p-5">
              <h2 className="font-display text-lg font-600">Your order</h2>
              <div className="mt-4 space-y-3">
                {items.map((i) => (
                  <div key={i.menuItemId} className="flex items-center gap-3">
                    {i.imageUrl && <img src={i.imageUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />}
                    <div className="flex-1">
                      <p className="font-600 text-kugoo-ink">{i.name}</p>
                      <p className="text-sm text-kugoo-green">{naira(i.price)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-kugoo-nude-light p-1">
                      <button onClick={() => updateQty(i.menuItemId, i.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-full bg-white"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-5 text-center text-sm font-600">{i.quantity}</span>
                      <button onClick={() => updateQty(i.menuItemId, i.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-white"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button onClick={() => removeItem(i.menuItemId)} className="text-kugoo-ink/30 hover:text-kugoo-orange"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="card p-5">
              <h2 className="font-display text-lg font-600">Delivery details</h2>
              <label className="mt-4 block text-sm font-600 text-kugoo-ink">Delivery address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="input mt-1" />
              <label className="mt-4 block text-sm font-600 text-kugoo-ink">Note to rider / vendor</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="e.g. Call when you arrive, gate code 1234" className="input mt-1 resize-none" />
            </div>

            {/* Payment */}
            <div className="card p-5">
              <h2 className="font-display text-lg font-600">Payment method</h2>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {payments.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPayment(p.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl border-2 px-2 py-3 text-xs font-600 transition",
                      payment === p.value ? "border-kugoo-orange bg-kugoo-orange/5 text-kugoo-orange" : "border-kugoo-nude-dark text-kugoo-ink/60",
                    )}
                  >
                    <p.icon className="h-5 w-5" /> {p.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-kugoo-ink/40">Demo checkout — no real charge. Powered by Paystack · Flutterwave · Korapay.</p>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <h2 className="font-display text-lg font-600">Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-kugoo-ink/60">Subtotal</span><span className="font-600">{naira(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-kugoo-ink/60">Delivery fee</span><span className="font-600">{naira(deliveryFee)}</span></div>
                <div className="flex justify-between"><span className="text-kugoo-ink/60">Service fee</span><span className="font-600">{naira(serviceFee)}</span></div>
                <div className="my-2 h-px bg-kugoo-nude-dark" />
                <div className="flex justify-between text-base"><span className="font-700">Total</span><span className="font-display font-700 text-kugoo-green">{naira(total)}</span></div>
              </div>
              {error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
              <button onClick={placeOrder} disabled={loading} className="btn-primary mt-5 w-full">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Place order · ${naira(total)}`}
              </button>
              {!user && <p className="mt-3 text-center text-xs text-kugoo-ink/50">You'll be asked to log in to complete your order.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
