import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Loader2, Utensils, Store, Bike } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { useAuth, type Role } from "@/lib/auth";
import { cn } from "@/lib/utils";

const roles: { value: Role; label: string; icon: typeof Utensils }[] = [
  { value: "customer", label: "Order food", icon: Utensils },
  { value: "merchant", label: "Sell food", icon: Store },
  { value: "rider", label: "Deliver & earn", icon: Bike },
];

const redirectFor: Record<string, string> = { merchant: "/merchant", rider: "/rider", admin: "/admin", customer: "/restaurants" };

export default function Signup() {
  const { signup } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [role, setRole] = useState<Role>("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await signup({ ...form, role });
      navigate(redirectFor[user.role] || "/");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Kugoo in seconds and start ordering."
      footer={<>Already have an account? <Link href="/login" className="font-600 text-kugoo-orange">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        <div className="grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <button
              type="button"
              key={r.value}
              onClick={() => setRole(r.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border-2 px-2 py-3 text-xs font-600 transition",
                role === r.value ? "border-kugoo-orange bg-kugoo-orange/5 text-kugoo-orange" : "border-kugoo-nude-dark text-kugoo-ink/60",
              )}
            >
              <r.icon className="h-5 w-5" /> {r.label}
            </button>
          ))}
        </div>
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
        <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
        <input required type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
