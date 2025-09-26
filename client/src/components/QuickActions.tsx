import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Truck, Route, Mail, FileText, AlertTriangle, BarChart3, Settings } from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  onClick?: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    id: "add-vehicle",
    title: "Add Vehicle",
    description: "Register new truck to fleet",
    icon: Plus,
    variant: "default"
  },
  {
    id: "create-trip", 
    title: "Create Trip",
    description: "Plan new route and assignment",
    icon: Route,
    variant: "default"
  },
  {
    id: "send-alert",
    title: "Send Alert",
    description: "Email notification to drivers",
    icon: Mail,
    badge: "7 pending",
    variant: "secondary"
  },
  {
    id: "generate-report",
    title: "Generate Report",
    description: "Fleet performance analytics",
    icon: BarChart3,
    variant: "outline"
  },
  {
    id: "manage-documents",
    title: "Documents",
    description: "Border & compliance files",
    icon: FileText,
    variant: "outline"
  },
  {
    id: "view-alerts",
    title: "System Alerts",
    description: "View maintenance & fuel alerts",
    icon: AlertTriangle,
    badge: "12 active",
    variant: "destructive"
  }
];

export default function QuickActions({ actions = defaultActions }: QuickActionsProps) {
  const handleActionClick = (action: QuickAction) => {
    console.log(`Quick action clicked: ${action.title}`);
    action.onClick?.();
  };

  return (
    <Card data-testid="quick-actions">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            
            return (
              <Button
                key={action.id}
                variant={action.variant || "outline"}
                className="h-auto p-4 flex flex-col items-start text-left hover-elevate"
                onClick={() => handleActionClick(action)}
                data-testid={`action-${action.id}`}
              >
                <div className="flex items-center gap-2 w-full mb-2">
                  <IconComponent className="h-5 w-5 shrink-0" />
                  <span className="font-medium truncate">{action.title}</span>
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}