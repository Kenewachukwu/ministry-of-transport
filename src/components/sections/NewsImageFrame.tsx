import Image from "next/image";

/**
 * Card image frame that always shows the WHOLE picture. News artwork varies
 * wildly in shape (portrait flyers, landscape photos, near-square graphics),
 * and `object-cover` cropped the portrait ones to a slice of their content.
 * The sharp image is fitted inside the frame (`object-contain`); a blurred,
 * enlarged copy fills the leftover space so the card still looks designed
 * rather than letterboxed. The blurred layer is decorative (`aria-hidden`).
 */
export function NewsImageFrame({ src, sizes }: { src: string; sizes?: string }) {
  const frameSizes = sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
      <Image
        src={src}
        alt=""
        fill
        sizes={frameSizes}
        aria-hidden
        className="scale-125 object-cover opacity-60 blur-2xl"
      />
      <Image src={src} alt="" fill sizes={frameSizes} className="object-contain" />
    </div>
  );
}
