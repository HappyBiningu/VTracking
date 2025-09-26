import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Truck,
  MapPin,
  Bell,
  BarChart3,
  Mail,
  Settings,
  User,
  Fuel,
  FileText,
  File,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    badge: null,
  },
  {
    title: "Fleet Management",
    icon: Truck,
    items: [
      { title: "Fleet Overview", url: "/fleet", badge: "24" },
      { title: "Vehicle Details", url: "/vehicles", badge: null },
      { title: "Driver Management", url: "/drivers", badge: null },
    ],
  },
  {
    title: "Trip Management",
    icon: MapPin,
    items: [
      { title: "Active Trips", url: "/trips", badge: "12" },
      { title: "Trip Planning", url: "/planning", badge: null },
      { title: "Route Optimization", url: "/routes", badge: null },
    ],
  },
  {
    title: "Fuel Management",
    url: "/fuel",
    icon: Fuel,
    badge: "3",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    badge: null,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: File,
    badge: null,
  },
  {
    title: "Email Center",
    icon: Mail,
    url: "/emails",
    badge: "7",
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "System Settings", url: "/settings", badge: null },
      { title: "User Management", url: "/users", badge: null },
      { title: "Notifications", url: "/notifications", badge: null },
    ],
  },
];

export default function AppSidebar() {
  const { user } = useAuth();

  const handleLogout = () => {
    console.log('Logout triggered');
    window.location.href = '/api/logout';
  };

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">FleetTrack Pro</h2>
            <p className="text-xs text-muted-foreground">Vehicle Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Fleet Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                if (item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenu>
                        {item.items.map((subItem) => (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton
                              asChild
                              data-testid={`nav-${subItem.title.toLowerCase().replace(/\\s+/g, '-')}`}
                            >
                              <a href={subItem.url} className="flex items-center gap-2 pl-8">
                                <span>{subItem.title}</span>
                                {subItem.badge && (
                                  <Badge variant="secondary" className="ml-auto">
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarMenuItem>
                  );
                } else {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        data-testid={`nav-${item.title.toLowerCase().replace(/\\s+/g, '-')}`}
                      >
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user && (
          <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={(user as any).profileImageUrl || undefined} />
              <AvatarFallback>
                {(user as any).firstName?.[0]}{(user as any).lastName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {(user as any).firstName} {(user as any).lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {(user as any).email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              className="shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}