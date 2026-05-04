"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const ROUTE_LABELS: Record<string, string> = {
  admin: "Dashboard",
  authorities: "Authorities",
  services: "Services",
  intents: "Intent Mapping",
  analytics: "Analytics",
  settings: "Settings",
  users: "Admin Users",
  sessions: "Sessions",
  profile: "Profile",
  "change-password": "Change Password",
};

export function AdminHeader() {
  const pathname = usePathname();

  // Build breadcrumb segments from pathname
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 backdrop-blur-sm px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = "/" + segments.slice(0, index + 1).join("/");
            const label = ROUTE_LABELS[segment] ?? segment;

            return isLast ? (
              <BreadcrumbItem key={segment}>
                <BreadcrumbPage className="font-medium">{label}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem key={segment}>
                <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
