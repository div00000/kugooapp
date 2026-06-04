import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Home } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth";

export function DashboardShell({ title, subtitle, accent = "green", children }: {
  title: string; subtitle: string; accent?: "green" | "orange"; children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-kugoo-nude-light">
      <header className="border-b border-kugoo-nude-dark bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/"><Logo variant="green" className="h-9 w-auto rounded-lg" /></Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-ghost px-4 py-2 text-sm"><Home className="h-4 w-4" /> <span className="hidden sm:inline">Home</span></Link>
            <div className="hidden items-center gap-2 sm:flex">
              {user?.avatarUrl ? <img src={user.avatarUrl} className="h-9 w-9 rounded-full object-cover" alt="" /> : <div className="grid h-9 w-9 place-items-center rounded-full bg-kugoo-green text-white">{user?.name[0]}</div>}
              <span className="text-sm font-600 text-kugoo-ink">{user?.name}</span>
            </div>
            <button onClick={() => { logout(); navigate("/"); }} className="grid h-9 w-9 place-items-center rounded-full bg-kugoo-nude text-kugoo-green hover:bg-kugoo-nude-dark"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <div className={`${accent === "orange" ? "bg-kugoo-orange" : "mesh-bg"} text-white`}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h1 className="font-display text-3xl font-700">{title}</h1>
          <p className="mt-1 text-white/70">{subtitle}</p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, hint }: { label: string; value: string; icon: any; hint?: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-kugoo-ink/50">{label}</span>
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-kugoo-green/10 text-kugoo-green"><Icon className="h-5 w-5" /></div>
      </div>
      <p className="mt-3 font-display text-2xl font-700 text-kugoo-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-kugoo-ink/40">{hint}</p>}
    </div>
  );
}
