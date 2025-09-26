
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Send, 
  Users, 
  Truck, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  MessageSquare
} from "lucide-react";

interface EmailNotification {
  id: string;
  type: "alert" | "update" | "reminder" | "report";
  title: string;
  message: string;
  recipients: string[];
  timestamp: Date;
  status: "sent" | "pending" | "failed";
  priority: "high" | "medium" | "low";
}

interface EmailNotificationCenterProps {
  notifications?: EmailNotification[];
}

export default function EmailNotificationCenter({ 
  notifications = [] 
}: EmailNotificationCenterProps) {
  
  // Mock notifications if none provided
  const mockNotifications: EmailNotification[] = [
    {
      id: "notif-001",
      type: "alert",
      title: "Low Fuel Alert",
      message: "Vehicle TRK-001-ZW has low fuel level (15%)",
      recipients: ["fleet@company.com", "driver.john@company.com"],
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: "sent",
      priority: "high"
    },
    {
      id: "notif-002", 
      type: "update",
      title: "Trip Status Update",
      message: "Trip to Cape Town is 65% complete, ETA: 2 hours",
      recipients: ["manager@company.com"],
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      status: "sent",
      priority: "medium"
    },
    {
      id: "notif-003",
      type: "reminder",
      title: "Maintenance Due",
      message: "TRK-003-ZW maintenance scheduled for tomorrow",
      recipients: ["maintenance@company.com"],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "pending",
      priority: "medium"
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "alert": return AlertTriangle;
      case "update": return MessageSquare;
      case "reminder": return Clock;
      case "report": return Mail;
      default: return Mail;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert": return "bg-red-500";
      case "update": return "bg-blue-500";
      case "reminder": return "bg-orange-500";
      case "report": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return CheckCircle2;
      case "pending": return Clock;
      case "failed": return AlertTriangle;
      default: return Clock;
    }
  };

  const handleSendNotification = () => {
    console.log("Compose new notification");
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <Card data-testid="email-notification-center">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Notifications
        </CardTitle>
        <Button size="sm" onClick={handleSendNotification} data-testid="compose-notification">
          <Send className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </CardHeader>
      <CardContent>
        {displayNotifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications to display</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {displayNotifications.map((notification) => {
              const TypeIcon = getTypeIcon(notification.type);
              const StatusIcon = getStatusIcon(notification.status);
              
              return (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  data-testid={`notification-${notification.id}`}
                >
                  <div className={`p-2 rounded-full ${getTypeColor(notification.type)} text-white`}>
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                      <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                        {notification.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{notification.recipients.length} recipients</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{notification.status}</span>
                        </div>
                        <span>•</span>
                        <span>{formatTimeAgo(notification.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {displayNotifications.filter(n => n.status === "sent").length}
              </div>
              <div className="text-xs text-muted-foreground">Sent</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">
                {displayNotifications.filter(n => n.status === "pending").length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {displayNotifications.filter(n => n.status === "failed").length}
              </div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
