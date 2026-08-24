import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";

export interface CardGridItem {
  id: string;
  title: string;
  description: string;
  href?: string;
  external?: boolean;
  badge?: string;
  imageUrl?: string;
  icon?: LucideIcon;
}

/**
 * Generic, config-driven card grid reused across Departments, Agencies,
 * and E-Services. Visual differences between directions come entirely
 * from the `bg-surface-raised` / `rounded-card` / `shadow-card` tokens —
 * this component itself never branches on direction. Cards with an
 * `imageUrl` get a photo strip, cards with an `icon` get an icon badge
 * instead (icon takes precedence when both are present), and cards with
 * neither stay plain text.
 */
export function CardGrid({
  items,
  columns = 3,
  className,
}: {
  items: CardGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const Wrapper = ({ href, external, children }: { href?: string; external?: boolean; children: ReactNode }) => {
    if (!href) return <div className="h-full">{children}</div>;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className="block h-full">
        {children}
      </Link>
    );
  };

  return (
    <ScrollRevealGroup
      className={cn(
        "grid gap-5",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {items.map((item) => {
        const ItemIcon = item.icon;
        return (
          <ScrollRevealItem key={item.id}>
            <Wrapper href={item.href} external={item.external}>
              <div className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface-raised shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-cta">
                {ItemIcon ? (
                  <div className="flex flex-col p-6 pb-0">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-cta transition-colors group-hover:bg-cta group-hover:text-white">
                      <ItemIcon size={22} aria-hidden />
                    </span>
                  </div>
                ) : (
                  item.imageUrl && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt=""
                        width={600}
                        height={375}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )
                )}
                <div className="flex flex-1 flex-col p-6">
                  {item.badge && (
                    <span className="mb-3 inline-block w-fit rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
                  {item.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cta">
                      Learn more
                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  )}
                </div>
              </div>
            </Wrapper>
          </ScrollRevealItem>
        );
      })}
    </ScrollRevealGroup>
  );
}
