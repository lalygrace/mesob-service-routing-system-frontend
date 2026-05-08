import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: "Admin Dashboard — Mesob Service Routing System",
  description:
    "Manage authorities, services, intent mappings, and monitor analytics for the Mesob Center navigation kiosk.",
};

async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    const response = await fetch(`${API_URL}/api/admin/me`, {
      method: 'GET',
      headers: {
        'cookie': cookieHeader,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkAuth();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="font-admin h-full">
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
    </div>
  );
}
