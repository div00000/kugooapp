import greenLogo from "@assets/WhatsApp_Image_2026-06-04_at_9.35.40_PM_1780613201325.jpeg";
import nudeOnGreen from "@assets/WhatsApp_Image_2026-06-04_at_9.38.17_PM_1780613201324.jpeg";
import { cn } from "@/lib/utils";

type Variant = "green" | "light" | "wordmark";

export function Logo({ variant = "green", className }: { variant?: Variant; className?: string }) {
  if (variant === "wordmark") {
    return (
      <span className={cn("font-display font-700 tracking-tight", className)}>
        <span className="text-kugoo-green">Kugoo</span>
        <span className="text-kugoo-orange">!</span>
      </span>
    );
  }
  const src = variant === "light" ? nudeOnGreen : greenLogo;
  return <img src={src} alt="Kugoo" className={cn("object-contain", className)} draggable={false} />;
}

/** Crisp inline pin mark used for compact spaces / favicons. */
export function KugooMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-kugoo-orange font-display text-white",
        className,
      )}
    >
      <span className="font-700">K!</span>
    </div>
  );
}
