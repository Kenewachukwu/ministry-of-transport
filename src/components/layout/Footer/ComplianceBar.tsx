import Link from "next/link";
import { complianceLinks } from "@/content/footerLinks";

export function ComplianceBar({ basePath }: { basePath: string }) {
  return (
    <div className="border-t border-white/10 py-4">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
        {complianceLinks.map((link) => (
          <li key={link.href}>
            <Link href={`${basePath}${link.href}`} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
