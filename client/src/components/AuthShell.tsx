import { Link } from "wouter";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden mesh-bg p-12 text-white lg:flex">
        <Link href="/"><Logo variant="light" className="h-11 w-auto rounded-lg" /></Link>
        <div>
          <h2 className="font-display text-4xl font-700 leading-tight">Everyday essentials,<br />delivered fast.</h2>
          <p className="mt-4 max-w-sm text-white/70">Join thousands ordering food and essentials on Kugoo. On time, everytime.</p>
        </div>
        <p className="text-sm text-white/50">© {new Date().getFullYear()} Kugoo</p>
        <div className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-kugoo-orange/30 blur-3xl" />
      </div>
      <div className="flex items-center justify-center bg-kugoo-nude-light p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-block lg:hidden"><Logo variant="green" className="h-10 w-auto rounded-lg" /></Link>
          <h1 className="font-display text-3xl font-700 text-kugoo-ink">{title}</h1>
          <p className="mt-1 text-kugoo-ink/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-kugoo-ink/60">{footer}</div>
        </div>
      </div>
    </div>
  );
}
