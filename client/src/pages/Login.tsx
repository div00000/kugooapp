import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { useAuth } from "@/lib/auth";

const demoAccounts = [
  { label: "Customer", email: "customer@kugoo.app" },
  { label: "Merchant", email: "merchant@kugoo.app" },
  { label: "Rider", email: "rider@kugoo.app" },
  { label: "Admin", email: "admin@kugoo.app" },
];

const redirectFor: Record<string, string> = { merchant: "/merchant", rider: "/rider", admin: "/admin", customer: "/restaurants" };

export default function Login() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(redirectFor[user.role] || "/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to order, track and manage your Kugoo account."
      footer={<>Don't have an account? <Link href="/signup" className="font-600 text-kugoo-orange">Sign up</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        <div>
          <label className="mb-1 block text-sm font-600 text-kugoo-ink">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-600 text-kugoo-ink">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log in"}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-center text-xs font-600 uppercase tracking-wide text-kugoo-ink/40">Try a demo account (pwd: password123)</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {demoAccounts.map((d) => (
            <button
              key={d.email}
              onClick={() => { setEmail(d.email); setPassword("password123"); }}
              className="rounded-2xl border border-kugoo-nude-dark bg-white px-3 py-2 text-sm font-600 text-kugoo-green hover:bg-kugoo-nude"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
