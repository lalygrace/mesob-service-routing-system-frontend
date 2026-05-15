"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Layers,
  BarChart3,
  Settings,
  ChevronUp,
  LogOut,
  Users,
  Monitor,
  User,
  Lock,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getCurrentUser, logout, type User as AuthUser } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { toast } from "sonner";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Authorities",
    url: "/admin/authorities",
    icon: Building2,
    badge: "6",
  },
  {
    title: "Services",
    url: "/admin/services",
    icon: Layers,
    badge: "8",
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const ACCOUNT_ITEMS = [
  {
    title: "Admin Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Sessions",
    url: "/admin/sessions",
    icon: Monitor,
  },
  {
    title: "Profile",
    url: "/admin/profile",
    icon: User,
  },
  {
    title: "Change Password",
    url: "/admin/change-password",
    icon: Lock,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [user, setUser] = React.useState<AuthUser | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const currentUser = await getCurrentUser();
      if (mounted) setUser(currentUser);
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to sign out"));
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SA";

  function isActive(item: (typeof NAV_ITEMS)[0]) {
    if (item.exact) return pathname === item.url;
    return pathname.startsWith(item.url);
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
            <Image
              src="/mesoblogo.png"
              alt="Mesob Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-0.5 leading-none min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold truncate">Mesob Admin</span>
            <span className="text-xs text-muted-foreground truncate">
              Management Console
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="absolute right-2 top-1.5 h-5 min-w-5 justify-center text-[10px] group-data-[collapsible=icon]:hidden"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ACCOUNT_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Kiosk">
                  <Link
                    href="/navigate"
                    target="_blank"
                    className="text-muted-foreground"
                  >
                    <Layers />
                    <span>Open Kiosk View</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name ?? "System Admin"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email ?? "admin@mesob.gov.et"}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem asChild className="gap-2">
                  <Link href="/admin/profile">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2">
                  <Link href="/admin/change-password">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2">
                  <Link href="/admin/sessions">
                    <Monitor className="h-4 w-4" />
                    Sessions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <ThemeToggle />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-destructive"
                  onSelect={(event) => {
                    event.preventDefault();
                    handleSignOut();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
