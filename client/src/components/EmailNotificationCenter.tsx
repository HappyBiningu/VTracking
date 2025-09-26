import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Clock, CheckCircle2, AlertCircle, Truck } from "lucide-react";

interface EmailNotification {
  id: string;
  type: "trip-update" | "fuel-alert" | "maintenance-due" | "driver-message";
  subject: string;
  recipient: string;
  status: "sent" | "pending" | "failed";
  timestamp: string;
  vehicleId?: string;
  priority: "low" | "medium" | "high";
}

interface EmailNotificationCenterProps {
  notifications: EmailNotification[];
  onSendEmail?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const typeIcons = {
  "trip-update": Truck,
  "fuel-alert": AlertCircle,
  "maintenance-due": AlertCircle,
  "driver-message": Mail
} as const;

const typeColors = {
  "trip-update": "text-blue-600",
  "fuel-alert": "text-orange-600", 
  "maintenance-due": "text-red-600",
  "driver-message": "text-green-600"
} as const;

const statusColors = {
  sent: "secondary",
  pending: "default",
  failed: "destructive"
} as const;

const priorityColors = {
  low: "secondary",
  medium: "default", 
  high: "destructive"
} as const;

export default function EmailNotificationCenter({
  notifications,
  onSendEmail,
  onViewDetails
}: EmailNotificationCenterProps) {
  return (
    <Card data-testid="email-notification-center">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Notifications
          <Badge variant="secondary">{notifications.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No email notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const IconComponent = typeIcons[notification.type];
              
              return (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover-elevate"
                  data-testid={`notification-${notification.id}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={typeColors[notification.type]}>
                      <IconComponent className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">
                        {notification.subject}
                      </p>
                      <Badge variant={statusColors[notification.status]} className="text-xs">
                        {notification.status}
                      </Badge>
                      <Badge variant={priorityColors[notification.priority]} className="text-xs">
                        {notification.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      To: {notification.recipient}
                      {notification.vehicleId && (
                        <span className="ml-2">• Vehicle: {notification.vehicleId}</span>
                      )}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {notification.status === "sent" && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    {notification.status === "failed" && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    {notification.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log(`Send email ${notification.id}`);
                          onSendEmail?.(notification.id);
                        }}
                        data-testid={`button-send-${notification.id}`}
                      >
                        Send
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        console.log(`View details ${notification.id}`);
                        onViewDetails?.(notification.id);
                      }}
                      data-testid={`button-details-${notification.id}`}
                    >
                      View
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}