import { Link } from "wouter";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-kugoo-nude-light px-4 text-center">
      <Logo variant="green" className="h-12 w-auto rounded-lg" />
      <h1 className="mt-8 font-display text-7xl font-700 text-kugoo-green">404</h1>
      <p className="mt-2 text-kugoo-ink/60">Looks like this page took a wrong turn.</p>
      <Link href="/" className="btn-primary mt-6">Back home</Link>
    </div>
  );
}
