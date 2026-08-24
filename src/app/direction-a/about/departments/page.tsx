import type { Metadata } from "next";
import {
  Megaphone,
  TrainFront,
  Bus,
  HardHat,
  Map,
  Briefcase,
  Users,
  Landmark,
  RefreshCw,
  ShoppingCart,
  Building2,
  ShieldCheck,
  Scale,
  Handshake,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { DirectoryTemplate } from "@/components/templates/DirectoryTemplate";
import { getDepartments } from "@/lib/cms";

export const metadata: Metadata = { title: "Departments" };

const departmentIcon: Record<string, LucideIcon> = {
  "press-public-relations": Megaphone,
  "rail-transport-services": TrainFront,
  "road-transport-mass-transit": Bus,
  "engineering-services": HardHat,
  "transport-planning-coordination": Map,
  "special-duties": Briefcase,
  "human-resources-management": Users,
  "finance-accounts": Landmark,
  "reform-coordination": RefreshCw,
  procurement: ShoppingCart,
  "general-services": Building2,
  "internal-audit": ShieldCheck,
  "legal-services": Scale,
  "ppp-unit": Handshake,
  "survey-hydrographics": Compass,
};

export default function Page() {
  const departments = getDepartments();
  return (
    <DirectoryTemplate
      eyebrow="About Us"
      title="Departments"
      description="The fifteen departments that carry out the Ministry's day-to-day mandate."
      items={departments.map((d) => ({
        id: d.id,
        title: d.name,
        description: d.summary,
        icon: departmentIcon[d.id],
      }))}
    />
  );
}
