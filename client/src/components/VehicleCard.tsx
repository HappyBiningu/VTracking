import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Fuel, Clock, Mail } from "lucide-react";
import { useLocation } from "wouter";

interface VehicleCardProps {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  status: "active" | "maintenance" | "offline";
  currentLocation?: string;
  fuelLevel?: number;
  driverName?: string;
  lastUpdate?: string;
  onViewDetails?: () => void;
  onSendEmail?: () => void;
}

const statusColors = {
  active: "bg-green-500",
  maintenance: "bg-orange-500", 
  offline: "bg-red-500"
} as const;

const statusLabels = {
  active: "Active",
  maintenance: "Maintenance",
  offline: "Offline"
} as const;

export default function VehicleCard({
  id,
  registrationNumber,
  make,
  model,
  year,
  status,
  currentLocation = "Unknown Location",
  fuelLevel,
  driverName,
  lastUpdate,
  onViewDetails,
  onSendEmail
}: VehicleCardProps) {
  const [location, setLocation] = useLocation();

  return (
    <Card className="hover-elevate" data-testid={`card-vehicle-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          {registrationNumber}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          <Badge variant="secondary" className="text-xs">
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {make} {model} ({year})
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="truncate" title={currentLocation}>
            {currentLocation}
          </span>
        </div>

        {fuelLevel !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <Fuel className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    fuelLevel < 25 ? 'bg-red-500' : 
                    fuelLevel < 50 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, fuelLevel))}%` }}
                />
              </div>
              <span className="text-xs font-medium min-w-[3rem] text-right">
                {fuelLevel.toFixed(0)}%
              </span>
            </div>
          </div>
        )}

        {driverName && (
          <div className="text-sm">
            <span className="text-muted-foreground">Driver: </span>
            <span className="font-medium">{driverName}</span>
          </div>
        )}

        {lastUpdate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Last update: {lastUpdate}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              console.log(`View details for vehicle ${registrationNumber}`);
              onViewDetails?.();
            }}
            data-testid={`button-view-details-${id}`}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => {
              console.log(`Send email for vehicle ${registrationNumber}`);
              onSendEmail?.();
            }}
            data-testid={`button-send-email-${id}`}
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}