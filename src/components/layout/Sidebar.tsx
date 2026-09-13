import { NavLink } from "react-router-dom";
import { NAV_SECTIONS } from "@/components/layout/navConfig";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarProps) {
  const { role } = useRole();

  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-5">
      {NAV_SECTIONS.map((section, i) => {
        const items = section.items.filter((item) => !role || item.allow.includes(role));
        if (items.length === 0) return null;

        return (
          <div key={i} className="flex flex-col gap-1">
            {section.label && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                {section.label}
              </p>
            )}
            {items.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

export function BrandMark() {
  return (
    <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
        S
      </div>
      <span className="text-sm font-semibold tracking-tight">SimpleHR</span>
    </div>
  );
}
