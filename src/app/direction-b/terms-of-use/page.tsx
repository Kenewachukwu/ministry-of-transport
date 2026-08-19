import type { Metadata } from "next";
import { StaticContentTemplate } from "@/components/templates/StaticContentTemplate";

export const metadata: Metadata = { title: "Terms of Use" };

export default function Page() {
  return (
    <StaticContentTemplate eyebrow="Legal" title="Terms of Use" pendingNotice>
      <p>
        By accessing this website, you agree to use it only for lawful purposes and in a
        manner that does not infringe the rights of, or restrict, or inhibit the use and
        enjoyment of this site by any third party.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Unless otherwise stated, the content on this website is the property of the Federal
        Ministry of Transportation and may not be reproduced without permission.
      </p>
    </StaticContentTemplate>
  );
}
