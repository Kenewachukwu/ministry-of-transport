import Image from "next/image";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { ScrollReveal } from "@/design-system/motion/ScrollReveal";

export function WelcomeMessageBlock({
  title,
  signOff,
  body,
  photoUrl,
}: {
  title: string;
  signOff: string;
  body: string[];
  photoUrl?: string;
}) {
  return (
    <ScrollReveal className="grid gap-8 rounded-card border border-border bg-surface-raised p-8 shadow-card sm:grid-cols-[200px_1fr] sm:p-10">
      <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-card">
        {photoUrl ? (
          <Image src={photoUrl} alt={signOff} width={200} height={200} className="h-full w-full object-cover" />
        ) : (
          <PlaceholderPhoto label="Minister portrait" tone="brand" className="h-full w-full" />
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cta">Welcome Message</p>
        <div className="mt-3 flex flex-col gap-3 text-ink-muted">
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-5 font-display font-semibold text-ink">{signOff}</p>
        <p className="text-sm text-ink-muted">{title}</p>
      </div>
    </ScrollReveal>
  );
}
