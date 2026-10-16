import { HeroA } from "./HeroA";
import { getHeroSlides } from "@/lib/cms";

/**
 * Server wrapper: the carousel is a client component (timer, pause state), so
 * slide content is read here and handed down as props. Keeping the data read
 * on the server means swapping the source — static file today, an admin-edited
 * store later — never touches the client bundle.
 */
export function HeroSection({ basePath }: { basePath: string }) {
  return <HeroA slides={getHeroSlides()} basePath={basePath} />;
}
