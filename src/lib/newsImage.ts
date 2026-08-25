import type { NewsItem } from "@/content/types";

/**
 * Real category images pulled from the live site map 1:1 onto our
 * NewsItem categories, so every article gets real ministry photography
 * instead of a generic placeholder.
 */
const categoryImage: Record<NewsItem["category"], string> = {
  "Online News Report": "/images/sourced/news-category-online.jpg",
  "Press Release": "/images/sourced/news-category-press.jpg",
  "Photo News": "/images/sourced/news-category-photo.jpeg",
};

export function getNewsImage(item: NewsItem): string {
  return item.imageUrl ?? categoryImage[item.category];
}
