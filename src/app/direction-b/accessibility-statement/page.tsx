import type { Metadata } from "next";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";

export const metadata: Metadata = { title: "Accessibility Statement" };

export default function Page() {
  return (
    <StaticContentTemplate eyebrow="Legal" title="Accessibility Statement">
      <p>
        The Federal Ministry of Transportation is committed to ensuring this website is
        accessible to all users, including people with disabilities, in line with WCAG 2.1 AA
        guidelines.
      </p>
      <h2>Feedback</h2>
      <p>
        If you encounter any accessibility barriers on this site, please let us know via the
        Contact page so we can address them.
      </p>
    </StaticContentTemplate>
  );
}
