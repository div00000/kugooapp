import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function naira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export const STATUS_LABELS: Record<string, string> = {
  pending: "Order placed",
  accepted: "Accepted by vendor",
  preparing: "Preparing your food",
  ready: "Food is ready",
  rider_assigned: "Rider assigned",
  picked_up: "Picked up",
  delivering: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_STEPS = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "rider_assigned",
  "picked_up",
  "delivering",
  "delivered",
];
