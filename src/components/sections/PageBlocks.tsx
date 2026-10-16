import Image from "next/image";
import { InlineLink } from "@/design-system/primitives/Link";
import { isSafeHref, isExternalHref } from "@/lib/links";
import { cn } from "@/lib/utils";
import type { FcssipBlock } from "@/content/types";

type LinkBlock = Extract<FcssipBlock, { type: "link" }>;

/**
 * Renders an ordered list of content blocks (paragraph, heading, image, link).
 * Consecutive `link` blocks are grouped into a single list. Styling for
 * `h2` / `p` / `li` comes from the surrounding StaticContentTemplate.
 */
export function PageBlocks({ blocks }: { blocks: FcssipBlock[] }) {
  const out: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block.type === "link") {
      const group: LinkBlock[] = [block];
      while (blocks[i + 1]?.type === "link") group.push(blocks[++i] as LinkBlock);
      out.push(
        <ul key={`links-${i}`}>
          {group.map((link, j) => (
            <li key={j}>
              <InlineLink
                href={isSafeHref(link.href) ? link.href : "#"}
                external={isExternalHref(link.href)}
                chevron
              >
                {link.label}
              </InlineLink>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (block.type === "paragraph") {
      out.push(<p key={i}>{block.text}</p>);
    } else if (block.type === "heading") {
      out.push(<h2 key={i}>{block.text}</h2>);
    } else {
      out.push(
        <figure
          key={i}
          className={cn(
            "overflow-hidden rounded-card border border-border bg-surface-raised shadow-card",
            block.size === "medium" && "mx-auto max-w-xl"
          )}
        >
          <Image src={block.src} alt={block.alt} width={block.width} height={block.height} className="h-auto w-full" />
          {block.caption && (
            <figcaption className="border-t border-border px-5 py-3 text-sm text-ink-muted">{block.caption}</figcaption>
          )}
        </figure>
      );
    }
  }

  return <>{out}</>;
}
