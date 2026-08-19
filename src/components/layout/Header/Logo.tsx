import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ basePath, inverse = false }: { basePath: string; inverse?: boolean }) {
  return (
    <Link href={basePath} className="group flex items-center gap-3">
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-1.5 ring-1",
          inverse ? "ring-white/20" : "ring-black/5 shadow-sm"
        )}
      >
        <Image
          src="/images/brand/fmt-coat-of-arms.png"
          alt="Coat of Arms of the Federal Republic of Nigeria"
          width={150}
          height={127}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display text-sm font-semibold sm:text-base",
            inverse ? "text-white" : "text-ink"
          )}
        >
          Federal Ministry of Transportation
        </span>
        <span
          className={cn(
            "text-[11px] uppercase tracking-[0.14em]",
            inverse ? "text-white/60" : "text-ink-muted"
          )}
        >
          Federal Republic of Nigeria
        </span>
      </span>
    </Link>
  );
}
