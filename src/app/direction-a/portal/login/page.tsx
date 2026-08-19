import type { Metadata } from "next";
import { LoginTemplate } from "@/components/templates/LoginTemplate";

export const metadata: Metadata = { title: "eCMS Portal Login" };

export default function Page() {
  return <LoginTemplate basePath="/direction-a" />;
}
