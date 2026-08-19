import Link from "next/link";
import {
  Building2,
  Train,
  FileText,
  Wrench,
  ShieldCheck,
  Users,
  Landmark,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { ScrollRevealGroup, ScrollRevealItem } from "@/design-system/motion/ScrollReveal";

interface Topic {
  label: string;
  href: string;
  icon: LucideIcon;
}

const topics: Topic[] = [
  { label: "Departments", href: "/about/departments", icon: Building2 },
  { label: "Agencies", href: "/about/agencies", icon: Landmark },
  { label: "Rail Services", href: "/about/departments", icon: Train },
  { label: "E-Services", href: "/e-services", icon: Wrench },
  { label: "Road Safety", href: "/about/stakeholders", icon: ShieldCheck },
  { label: "Resources & Documents", href: "/resources", icon: FileText },
  { label: "Stakeholders", href: "/about/stakeholders", icon: Users },
  { label: "Contact Us", href: "/contact", icon: Phone },
];

/**
 * Direction B only — Lagos State's on-page A–Z services directory, adapted
 * to this ministry's smaller topic set. Surfaces the whole IA as browsable
 * tiles rather than hiding depth in a mega-menu.
 */
export function TopicDirectory({ basePath }: { basePath: string }) {
  return (
    <ScrollRevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {topics.map(({ label, href, icon: TopicIcon }) => (
        <ScrollRevealItem key={label}>
          <Link
            href={`${basePath}${href}`}
            className="group flex flex-col items-center gap-3 rounded-card border border-border bg-surface-raised p-6 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-cta"
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
