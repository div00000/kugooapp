import { Link, useLocation } from "wouter";
import { useState } from "react";
import { ShoppingBag, User, Menu, X, MapPin, LogOut, LayoutDashboard } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const dashboardFor: Record<string, string> = {
  merchant: "/merchant",
  rider: "/rider",
  admin: "/admin",
};

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  const links = [
    { href: "/restaurants", label: "Restaurants" },
    { href: "/track", label: "Track Order" },
    { href: "/#features", label: "How it works" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors",
        transparent ? "bg-transparent" : "glass shadow-sm",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo variant={transparent ? "light" : "green"} className="h-9 w-auto rounded-lg" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-semibold transition-colors hover:text-kugoo-orange",
                transparent ? "text-white/90" : "text-kugoo-ink/80",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/checkout"
            className={cn(
              "relative grid h-11 w-11 place-items-center rounded-full transition",
              transparent ? "bg-white/15 text-white hover:bg-white/25" : "bg-kugoo-nude text-kugoo-green hover:bg-kugoo-nude-dark",
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-kugoo-orange text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              {dashboardFor[user.role] && (
                <Link href={dashboardFor[user.role]} className="btn-ghost px-4 py-2.5 text-sm">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              )}
              <Link href="/account" className="grid h-11 w-11 place-items-center rounded-full bg-kugoo-green text-white">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className={cn("text-sm font-semibold px-3", transparent ? "text-white" : "text-kugoo-green")}>
                Log in
              </Link>
              <Link href="/signup" className="btn-primary px-5 py-2.5 text-sm">
                Sign up
              </Link>
            </div>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full md:hidden",
              transparent ? "bg-white/15 text-white" : "bg-kugoo-nude text-kugoo-green",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/40 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 font-semibold text-kugoo-ink hover:bg-kugoo-nude">
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-kugoo-nude-dark" />
            {user ? (
              <>
                {dashboardFor[user.role] && (
                  <Link href={dashboardFor[user.role]} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 font-semibold text-kugoo-green hover:bg-kugoo-nude">
                    Dashboard
                  </Link>
                )}
                <Link href="/account" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 font-semibold text-kugoo-ink hover:bg-kugoo-nude">
                  My Account
                </Link>
                <button
                  onClick={() => { logout(); setOpen(false); navigate("/"); }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left font-semibold text-kugoo-orange hover:bg-kugoo-nude"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost flex-1 py-2.5 text-sm">Log in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary flex-1 py-2.5 text-sm">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
