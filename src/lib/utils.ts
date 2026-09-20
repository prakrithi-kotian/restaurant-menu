import { AvailabilityStatus, MenuItem } from "@/types/database";

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
}

export function getRemainingMinutes(availableAt: string | null | undefined): number {
  if (!availableAt) return 0;
  const target = new Date(availableAt).getTime();
  const now = new Date().getTime();
  const diffMs = target - now;
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60));
}

export function isItemOrderable(item: MenuItem): boolean {
  if (item.availability_status === "available") return true;
  if (item.availability_status === "out_of_stock") return false;
  if (item.availability_status === "temporary_unavailable") {
    if (!item.available_at) return false;
    return getRemainingMinutes(item.available_at) <= 0;
  }
  return false;
}

export function getAvailabilityInfo(item: MenuItem): {
  status: AvailabilityStatus;
  label: string;
  subtext?: string;
  isAvailable: boolean;
} {
  if (item.availability_status === "available") {
    return {
      status: "available",
      label: "Available",
      isAvailable: true,
    };
  }

  if (item.availability_status === "out_of_stock") {
    return {
      status: "out_of_stock",
      label: "Currently unavailable",
      subtext: "Out of stock",
      isAvailable: false,
    };
  }

  // temporary_unavailable
  const remainingMinutes = getRemainingMinutes(item.available_at);
  if (remainingMinutes <= 0) {
    return {
      status: "available",
      label: "Available now",
      isAvailable: true,
    };
  }

  return {
    status: "temporary_unavailable",
    label: "Unavailable",
    subtext: `Available in ${remainingMinutes} min`,
    isAvailable: false,
  };
}
