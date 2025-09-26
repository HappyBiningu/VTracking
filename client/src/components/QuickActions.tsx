import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Plus, 
  Truck, 
  Users, 
  MapPin, 
  Wrench, 
  AlertTriangle, 
  BarChart3,
  FileText 
} from "lucide-react";

export default function QuickActions() {
  const [, setLocation] = useLocation();

  const handleQuickAction = (action: string, path: string) => {
    console.log(`Quick action clicked: ${action}`);
    if (path) {
      setLocation(path);
    }
  };

  const actions = [
    {
      id: "add-vehicle",
      title: "Add Vehicle",
      description: "Register new vehicle",
      icon: Truck,
      color: "bg-blue-500 hover:bg-blue-600",
      action: "Add Vehicle",
      path: "/vehicles"
    },
    {
      id: "add-driver",
      title: "Add Driver",
      description: "Register new driver",
      icon: Users,
      color: "bg-green-500 hover:bg-green-600",
      action: "Add Driver",
      path: "/drivers"
    },
    {
      id: "plan-trip",
      title: "Plan Trip",
      description: "Create new trip",
      icon: MapPin,
      color: "bg-purple-500 hover:bg-purple-600",
      action: "Plan Trip",
      path: "/planning"
    },
    {
      id: "maintenance",
      title: "Maintenance",
      description: "Schedule service",
      icon: Wrench,
      color: "bg-orange-500 hover:bg-orange-600",
      action: "Schedule Maintenance",
      path: "/maintenance"
    },
    {
      id: "alerts",
      title: "System Alerts",
      description: "View active alerts",
      icon: AlertTriangle,
      color: "bg-red-500 hover:bg-red-600",
      action: "System Alerts",
      path: "/fleet"
    },
    {
      id: "reports",
      title: "Fleet Reports",
      description: "Generate reports",
      icon: BarChart3,
      color: "bg-indigo-500 hover:bg-indigo-600",
      action: "Fleet Reports",
      path: "/reports"
    }
  ];

  return (
    <Card data-testid="quick-actions">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                onClick={() => handleQuickAction(action.action, action.path)}
                data-testid={`quick-action-${action.id}`}
              >
                <div className={`p-2 rounded-lg text-white ${action.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Recent Actions Section */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recent Actions</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Vehicle TRK-001-ZW registered</span>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Trip to Cape Town planned</span>
              <span className="text-xs text-muted-foreground">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Maintenance scheduled for TRK-003-ZW</span>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}