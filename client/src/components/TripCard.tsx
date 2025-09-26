import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import {
  MapPin,
  Clock,
  Truck,
  Package,
  Mail,
  Calendar
} from "lucide-react";

interface TripCardProps {
  id: string;
  origin: string;
  destination: string;
  vehicle: {
    registrationNumber: string;
    driverName: string;
  };
  status: "planned" | "in-progress" | "completed" | "delayed";
  startDate: string;
  expectedArrival?: string;
  progress?: number;
  loadWeight?: number;
  distance?: number;
  fuelBudget?: number;
  onViewTrip?: () => void;
  onSendUpdate?: () => void;
}

const statusColors = {
  planned: "secondary",
  "in-progress": "default",
  completed: "secondary",
  delayed: "destructive"
} as const;

const statusLabels = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
  delayed: "Delayed"
} as const;

export default function TripCard({
  id,
  origin,
  destination,
  vehicle,
  status,
  startDate,
  expectedArrival,
  progress = 0,
  loadWeight,
  distance,
  fuelBudget,
  onViewTrip,
  onSendUpdate
}: TripCardProps) {
  const [location, setLocation] = useLocation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "secondary";
      case "in-progress":
        return "default";
      case "completed":
        return "secondary";
      case "delayed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "planned":
        return "Planned";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "delayed":
        return "Delayed";
      default:
        return "Unknown";
    }
  };


  return (
    <Card className="hover-elevate" data-testid={`card-trip-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Trip #{id}</CardTitle>
          <Badge variant={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="font-medium">From:</span>
            <span className="text-muted-foreground">{origin}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="font-medium">To:</span>
            <span className="text-muted-foreground">{destination}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{vehicle.registrationNumber}</span>
          <span className="text-muted-foreground">• {vehicle.driverName}</span>
        </div>

        {status === "in-progress" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Start</div>
              <div className="text-muted-foreground text-xs">{startDate}</div>
            </div>
          </div>

          {expectedArrival && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">ETA</div>
                <div className="text-muted-foreground text-xs">{expectedArrival}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between text-sm">
          {loadWeight && (
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span>{loadWeight}kg</span>
            </div>
          )}

          {distance && (
            <div className="text-muted-foreground">
              {distance}km
            </div>
          )}

          {fuelBudget && (
            <div className="text-muted-foreground">
              ${fuelBudget.toFixed(0)} fuel
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => {
              console.log(`View trip details for ${id}`);
              onViewTrip?.();
              setLocation(`/trips/${id}`);
            }}
            data-testid={`button-view-trip-${id}`}
          >
            View Trip
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              console.log(`Send email update for trip ${id}`);
              onSendUpdate?.();
            }}
            data-testid={`button-send-update-${id}`}
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}