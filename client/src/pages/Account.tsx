import { useState } from "react";
import { useLocation, Link } from "wouter";
import { LogOut, Trash2, Mail, Phone, Shield, Bell, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const roleBadge: Record<string, string> = {
  customer: "bg-kugoo-green/10 text-kugoo-green",
  merchant: "bg-kugoo-orange/10 text-kugoo-orange",
  rider: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
};

export default function Account() {
  const { user, logout, deleteAccount } = useAuth();
  const [, navigate] = useLocation();
  const [confirming, setConfirming] = useState(false);

  if (!user) return null;

  const handleDelete = async () => {
    await deleteAccount();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-kugoo-nude-light">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="card overflow-hidden">
          <div className="mesh-bg p-8 text-white">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-20 w-20 rounded-full border-4 border-white/30 object-cover" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white/20 font-display text-3xl font-700">{user.name[0]}</div>
              )}
              <div>
                <h1 className="font-display text-2xl font-700">{user.name}</h1>
                <span className={cn("chip mt-1 capitalize", roleBadge[user.role])}>{user.role}</span>
              </div>
            </div>
          </div>
          <div className="space-y-1 p-6">
            <Row icon={Mail} label="Email" value={user.email} />
            <Row icon={Phone} label="Phone" value={user.phone || "Not set"} />
            <Row icon={MapPin} label="Default address" value="12 Admiralty Way, Lekki Phase 1, Lagos" />
          </div>
        </div>

        <div className="card mt-6 p-6">
          <h2 className="font-display text-lg font-600">Preferences & privacy</h2>
          <div className="mt-4 space-y-3">
            {[
              { icon: Bell, label: "Push notifications", on: true },
              { icon: MapPin, label: "Location services", on: true },
              { icon: Shield, label: "Two-factor authentication", on: false },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-kugoo-ink/80"><p.icon className="h-4 w-4 text-kugoo-green" /> {p.label}</span>
                <div className={cn("flex h-6 w-11 items-center rounded-full p-1 transition", p.on ? "bg-kugoo-green" : "bg-kugoo-nude-dark")}>
                  <div className={cn("h-4 w-4 rounded-full bg-white transition", p.on && "translate-x-5")} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-6 p-6">
          <h2 className="font-display text-lg font-600">Quick links</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/orders" className="btn-ghost px-4 py-2 text-sm">My orders</Link>
            <Link href="/track" className="btn-ghost px-4 py-2 text-sm">Track order</Link>
            <Link href="/restaurants" className="btn-ghost px-4 py-2 text-sm">Order food</Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => { logout(); navigate("/"); }} className="btn-secondary flex-1">
            <LogOut className="h-4 w-4" /> Log out
          </button>
          {!confirming ? (
            <button onClick={() => setConfirming(true)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-6 py-3 font-semibold text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Delete account
            </button>
          ) : (
            <button onClick={handleDelete} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
              Confirm permanent deletion
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-kugoo-ink/40">Account deletion is permanent and removes all your data, in line with App Store & Google Play policies.</p>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-kugoo-nude-light">
      <Icon className="h-5 w-5 text-kugoo-green" />
      <div>
        <p className="text-xs text-kugoo-ink/40">{label}</p>
        <p className="font-600 text-kugoo-ink">{value}</p>
      </div>
    </div>
  );
}
