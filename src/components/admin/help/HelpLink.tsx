import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { getGuide } from "@/lib/admin/help";

/** "Help with this page": a quiet link to the guide for the screen you are on. Renders nothing if the guide does not exist. */
export function HelpLink({ slug, label = "Help with this page" }: { slug: string; label?: string }) {
  const guide = getGuide(slug);
  if (!guide) return null;
  return (
    <Link
      href={`/admin/help/${guide.slug}`}
      className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-2 text-sm font-semibold text-ink-muted hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
    >
      <CircleHelp size={14} aria-hidden /> {label}
    </Link>
  );
}
