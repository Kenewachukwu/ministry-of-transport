import type { Metadata } from "next";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";
import { siteMeta } from "@/content/siteMeta";

export const metadata: Metadata = { title: "Freedom of Information" };

export default function Page() {
  return (
    <StaticContentTemplate eyebrow="Legal" title="Freedom of Information (FOI)" pendingNotice>
      <p>
        Under the Freedom of Information Act 2011, members of the public may request access
        to records held by the Federal Ministry of Transportation.
      </p>
      <h2>How to request information</h2>
      <p>
        Submit your request in writing to {siteMeta.email}, stating the specific information
        sought and your contact details.
      </p>
    </StaticContentTemplate>
  );
}
