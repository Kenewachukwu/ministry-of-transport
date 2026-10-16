import Link from "next/link";
import { Building2, FileText, Wrench, Users, Landmark, Phone, type LucideIcon } from "lucide-react";
import { ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";
import { navConfig } from "@/content/nav.config";

interface Topic {
  label: string;
  href: string;
  icon: LucideIcon;
}

// "Resources" is read from the navigation so this tile can never drift from
// the menu's own label and link (Ministry review, Oct 2026).
const resourcesNav = navConfig.find((item) => item.label === "Resources");

const topics: Topic[] = [
  { label: "Departments", href: "/about/departments", icon: Building2 },
  { label: "Agencies", href: "/about/agencies", icon: Landmark },
  { label: "E-Services", href: "/e-services", icon: Wrench },
  { label: resourcesNav?.label ?? "Resources", href: resourcesNav?.href ?? "/resources", icon: FileText },
  { label: "Stakeholders", href: "/about/stakeholders", icon: Users },
  { label: "Contact Us", href: "/contact", icon: Phone },
];

/**
 * On-page directory — adapted from Lagos State's A–Z services directory to
 * this ministry's smaller topic set. Surfaces the whole IA as browsable tiles
 * rather than hiding depth in a mega-menu. Six tiles: two even rows of three.
 */
export function TopicDirectory({ basePath }: { basePath: string }) {
  return (
    <ScrollRevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {topics.map(({ label, href, icon: TopicIcon }) => (
        <ScrollRevealItem key={label}>
          <Link
            href={`${basePath}${href}`}
            className="group flex flex-col items-center gap-3 rounded-card border border-border bg-surface-raised p-6 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-cta hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-cta transition-colors group-hover:bg-cta group-hover:text-white">
              <TopicIcon size={20} aria-hidden />
            </span>
            <span className="text-sm font-semibold text-ink">{label}</span>
          </Link>
        </ScrollRevealItem>
      ))}
    </ScrollRevealGroup>
  );
}
