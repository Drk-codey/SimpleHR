import { Construction } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

interface PlaceholderPageProps {
  title: string;
  phase: number;
}

export function PlaceholderPage({ title, phase }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <EmptyState
        icon={Construction}
        title={`${title} ships in Phase ${phase}`}
        description="The database schema, RLS policies, and app shell for this module are already in place — the UI comes next."
      />
    </div>
  );
}
