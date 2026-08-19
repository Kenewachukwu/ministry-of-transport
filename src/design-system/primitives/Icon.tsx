import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Icon({
  icon: IconComponent,
  className,
  size = 20,
}: {
  icon: LucideIcon;
  className?: string;
  size?: number;
}) {
  return <IconComponent size={size} className={cn("shrink-0", className)} aria-hidden />;
}
