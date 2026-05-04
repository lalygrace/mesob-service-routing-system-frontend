import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
  title: "Admin Dashboard — Mesob Service Routing System",
  description:
    "Manage authorities, services, intent mappings, and monitor analytics for the Mesob Center navigation kiosk.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <TooltipProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <AdminHeader />
            <div className="flex-1 overflow-auto">
              <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthGuard>
  );
}
