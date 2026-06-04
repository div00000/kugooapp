import { Link } from "wouter";
import { Instagram, Twitter, Youtube, Facebook, Apple, Play } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mesh-bg text-kugoo-nude-light">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="light" className="h-10 w-auto rounded-lg" />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Kugoo is a reliable delivery company making everyday essentials easily accessible — food and basic electronics, delivered fast and secure.
            </p>
            <p className="mt-4 font-display text-lg font-600 text-kugoo-orange-light">On time, Everytime.</p>
          </div>

          <div>
            <h4 className="font-display font-600 text-white">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link href="/restaurants" className="hover:text-white">Restaurants</Link></li>
              <li><Link href="/track" className="hover:text-white">Track Order</Link></li>
              <li><Link href="/signup" className="hover:text-white">Become a Rider</Link></li>
              <li><Link href="/signup" className="hover:text-white">Partner with us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-600 text-white">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Data & Consent</a></li>
              <li><a href="#" className="hover:text-white">Accessibility</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-600 text-white">Get the app</h4>
            <div className="mt-4 flex flex-col gap-3">
              <a href="#" className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/20">
                <Apple className="h-6 w-6" />
                <span className="text-left text-xs leading-tight">Download on the<br /><span className="text-sm font-600">App Store</span></span>
              </a>
              <a href="#" className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/20">
                <Play className="h-6 w-6" />
                <span className="text-left text-xs leading-tight">Get it on<br /><span className="text-sm font-600">Google Play</span></span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-sm text-white/60">© {new Date().getFullYear()} Kugoo. All rights reserved.</p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-kugoo-orange">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
