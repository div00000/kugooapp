import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, Search, MapPin, Bike, Store, ShieldCheck, Sparkles,
  Smartphone, Clock, Zap, MessageCircle, Star, ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RestaurantCard, type RestaurantLite } from "@/components/RestaurantCard";
import { Logo } from "@/components/Logo";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const steps = [
  { icon: Search, title: "Discover", text: "Browse top restaurants, trending meals and featured vendors near you.", scene: "01" },
  { icon: Store, title: "Vendor prepares", text: "Your favourite kitchen accepts and freshly prepares your order.", scene: "02" },
  { icon: Bike, title: "Rider picks up", text: "The nearest available rider is matched and heads to the vendor.", scene: "03" },
  { icon: MapPin, title: "Live journey", text: "Watch your rider move toward you in real time with a live ETA.", scene: "04" },
  { icon: Sparkles, title: "Delivered", text: "Hot, fresh and on time — every single time.", scene: "05" },
];

const features = [
  { icon: Zap, title: "Real-time tracking", text: "Follow your rider on a live map with precise ETAs like \"arriving in 27 minutes\"." },
  { icon: MessageCircle, title: "Zaam AI & WhatsApp", text: "Order, discover and track through our AI assistant or directly on WhatsApp." },
  { icon: ShieldCheck, title: "Secure payments", text: "Cards, wallets and bank transfers with encrypted, logged transactions." },
  { icon: Clock, title: "On time, everytime", text: "Smart rider matching and route optimisation for the fastest possible delivery." },
];

export default function Landing() {
  const { data: restaurants } = useQuery<RestaurantLite[]>({ queryKey: ["/api/restaurants"] });
  const featured = (restaurants ?? []).filter((r) => r.isFeatured).slice(0, 3);
  const display = featured.length ? featured : (restaurants ?? []).slice(0, 3);

  return (
    <div className="min-h-screen bg-kugoo-nude-light">
      {/* HERO */}
      <div className="relative overflow-hidden hero-gradient">
        <Navbar transparent />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-kugoo-orange/30 blur-3xl" />
          <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-kugoo-nude/20 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-32 lg:pt-24">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
            <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-kugoo-nude-light backdrop-blur">
              <Sparkles className="h-4 w-4 text-kugoo-orange-light" /> Now delivering across Lagos
            </motion.span>
            <motion.h1 variants={fadeUp} className="mt-6 font-display text-5xl font-700 leading-[1.05] text-white text-shadow sm:text-6xl lg:text-7xl">
              Everyday essentials,<br />
              <span className="text-kugoo-orange-light">delivered fast.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-md text-lg text-white/80">
              Kugoo gets hot food and basic electronics to your door with careful handling and live tracking.
              <span className="font-600 text-white"> On time, everytime.</span>
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/restaurants" className="btn-primary text-base">
                Order now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/track" className="btn-ghost border-white/30 bg-white/10 text-white hover:bg-white/20 text-base">
                Track an order
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-8 text-white">
              {[["50k+", "Happy customers"], ["1,200+", "Vendors"], ["4.9★", "Avg. rating"]].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-2xl font-700">{n}</p>
                  <p className="text-xs text-white/60">{l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto hidden w-full max-w-md lg:block"
          >
            <div className="animate-float">
              <div className="glass rounded-[2.5rem] p-5 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious meal"
                  className="h-72 w-full rounded-3xl object-cover"
                />
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-kugoo-green text-white"><Bike className="h-6 w-6" /></div>
                    <div>
                      <p className="text-sm font-600 text-kugoo-ink">Emeka is on the way</p>
                      <p className="text-xs text-kugoo-ink/60">Arriving in 12 min · 1.2km away</p>
                    </div>
                  </div>
                  <span className="chip bg-kugoo-green/10 text-kugoo-green">Live</span>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-8 top-10 rounded-2xl bg-white p-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-kugoo-orange text-kugoo-orange" />
                <span className="text-sm font-600">4.9 rating</span>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -right-6 bottom-16 rounded-2xl bg-kugoo-orange p-3 text-white shadow-xl"
            >
              <p className="text-xs">Order total</p>
              <p className="font-display text-lg font-700">₦8,500</p>
            </motion.div>
          </motion.div>
        </div>

        <svg className="absolute bottom-0 w-full text-kugoo-nude-light" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 64L48 58.7C96 53 192 43 288 48C384 53 480 75 576 80C672 85 768 75 864 64C960 53 1056 43 1152 48C1248 53 1344 75 1392 85.3L1440 96V120H0V64Z" />
        </svg>
      </div>

      {/* SEARCH STRIP */}
      <div className="mx-auto -mt-6 max-w-3xl px-4">
        <div className="flex items-center gap-3 rounded-full bg-white p-2 shadow-soft">
          <div className="flex flex-1 items-center gap-2 px-3">
            <MapPin className="h-5 w-5 text-kugoo-orange" />
            <input placeholder="Deliver to — Lekki Phase 1, Lagos" className="w-full bg-transparent py-2.5 text-sm outline-none" />
          </div>
          <Link href="/restaurants" className="btn-primary px-6 py-3">
            <Search className="h-4 w-4" /> Find food
          </Link>
        </div>
      </div>

      {/* HOW IT WORKS — scroll story */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <span className="chip mx-auto bg-kugoo-orange/10 text-kugoo-orange">The Kugoo journey</span>
          <h2 className="mt-4 font-display text-4xl font-700 text-kugoo-ink sm:text-5xl">From craving to doorstep</h2>
          <p className="mx-auto mt-3 max-w-xl text-kugoo-ink/60">Every order moves through a smooth, transparent flow you can watch in real time.</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-3xl bg-white p-6 shadow-soft"
            >
              <span className="font-display text-5xl font-700 text-kugoo-nude-dark">{s.scene}</span>
              <div className="mt-3 grid h-12 w-12 place-items-center rounded-2xl bg-kugoo-green text-white">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-600 text-kugoo-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-kugoo-ink/60">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED RESTAURANTS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="chip bg-kugoo-green/10 text-kugoo-green">Featured</span>
            <h2 className="mt-3 font-display text-3xl font-700 text-kugoo-ink sm:text-4xl">Top kitchens near you</h2>
          </div>
          <Link href="/restaurants" className="hidden items-center gap-1 font-600 text-kugoo-orange hover:gap-2 sm:flex">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {display.map((r) => <RestaurantCard key={r.id} r={r} />)}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-white p-6 shadow-soft"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-kugoo-orange to-kugoo-orange-dark text-white">
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-lg font-600 text-kugoo-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-kugoo-ink/60">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ZAAM BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] mesh-bg p-10 sm:p-16">
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="chip bg-white/15 text-white"><Sparkles className="h-3.5 w-3.5" /> Meet Zaam</span>
              <h2 className="mt-4 font-display text-4xl font-700 text-white">Your AI food companion</h2>
              <p className="mt-3 max-w-md text-white/80">
                "I want spicy rice under ₦5,000." "Where is my rider?" Zaam understands you — on the app and on WhatsApp — recommending meals, placing orders and tracking deliveries instantly.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Recommend food", "Track KG-2026-000001", "Show nearby restaurants"].map((q) => (
                  <span key={q} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">"{q}"</span>
                ))}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-xs rounded-3xl bg-white p-4 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-kugoo-nude pb-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-kugoo-orange text-white"><Sparkles className="h-4 w-4" /></div>
                  <span className="font-600">Zaam</span>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-kugoo-orange px-3 py-2 text-white">Recommend something spicy</p>
                  <p className="w-fit rounded-2xl rounded-bl-sm bg-kugoo-nude-light px-3 py-2">Try the Suya Platter at Mama's Jollof Palace — ⭐4.9, ready in 22 min! 🌶️</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 rounded-[2.5rem] bg-kugoo-green p-10 sm:p-16 lg:grid-cols-2">
          <div>
            <Logo variant="light" className="h-12 w-auto rounded-lg" />
            <h2 className="mt-6 font-display text-4xl font-700 text-white">Get Kugoo on your phone</h2>
            <p className="mt-3 max-w-md text-white/80">Order in seconds, track in real time and let Zaam handle the rest. Available on iOS and Android.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="flex items-center gap-3 rounded-2xl bg-black px-5 py-3 text-white"><Smartphone className="h-6 w-6" /><span className="text-left text-xs">Download on the<br /><span className="text-sm font-600">App Store</span></span></a>
              <a href="#" className="flex items-center gap-3 rounded-2xl bg-black px-5 py-3 text-white"><Smartphone className="h-6 w-6" /><span className="text-left text-xs">Get it on<br /><span className="text-sm font-600">Google Play</span></span></a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="animate-float rounded-[2rem] bg-white/10 p-3 backdrop-blur">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80" alt="App" className="h-80 w-64 rounded-3xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
