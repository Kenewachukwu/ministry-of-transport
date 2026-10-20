import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Card image frame that always shows the WHOLE picture. News artwork varies
 * wildly in shape (portrait flyers, landscape photos, near-square graphics),
 * and `object-cover` cropped the portrait ones to a slice of their content.
 * The sharp image is fitted inside the frame (`object-contain`); a blurred,
 * enlarged copy fills the leftover space so the card still looks designed
 * rather than letterboxed. The blurred layer is decorative (`aria-hidden`).
 */
export function NewsImageFrame({
  src,
  sizes,
  alt = "",
  aspect = "aspect-[16/10]",
  priority = false,
  className,
}: {
  src: string;
  sizes?: string;
  /** What the picture shows, for screen readers. Empty (the default) marks it decorative, for cards that already carry the headline. */
  alt?: string;
  /** A Tailwind aspect-ratio class. */
  aspect?: string;
  /** Load first: for the large picture at the top of a page. */
  priority?: boolean;
  className?: string;
}) {
  const frameSizes = sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
  return (
    <div className={cn("relative overflow-hidden bg-brand-50", aspect, className)}>
      <Image
        src={src}
        alt=""
        fill
        sizes={frameSizes}
        aria-hidden
        className="scale-125 object-cover opacity-60 blur-2xl"
      />
      <Image src={src} alt={alt} fill sizes={frameSizes} priority={priority} className="object-contain" />
    </div>
  );
}
