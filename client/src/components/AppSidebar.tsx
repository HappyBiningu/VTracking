import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Home, Truck, Route, Fuel, FileText, Settings, Users, Mail, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/", badge: null },
  { title: "Fleet Overview", icon: Truck, url: "/fleet", badge: "24" },
  { title: "Active Trips", icon: Route, url: "/trips", badge: "12" },
  { title: "Fuel Management", icon: Fuel, url: "/fuel", badge: "3" },
  { title: "Reports", icon: BarChart3, url: "/reports", badge: null },
  { title: "Documents", icon: FileText, url: "/documents", badge: null },
  { title: "Email Center", icon: Mail, url: "/emails", badge: "7" },
];

const adminItems = [
  { title: "User Management", icon: Users, url: "/admin/users", badge: null },
  { title: "System Settings", icon: Settings, url: "/admin/settings", badge: null },
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
              {menuItems.map((item) => (
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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
              ))}
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