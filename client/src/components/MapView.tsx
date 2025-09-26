import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Truck } from "lucide-react";

interface Vehicle {
  id: string;
  registrationNumber: string;
  lat: number;
  lng: number;
  status: "active" | "maintenance" | "offline";
  heading: number;
  speed: number;
}

interface MapViewProps {
  vehicles: Vehicle[];
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

export default function MapView({ vehicles }: MapViewProps) {
  return (
    <Card data-testid="map-view">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">Fleet Location Overview</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{vehicles.length} vehicles tracked</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mock Map Container */}
        <div className="relative bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 h-80 mb-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50" />

          {/* Map Grid Lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-gray-300" style={{ top: `${i * 12.5}%` }} />
            ))}
            {[...Array(6)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-gray-300" style={{ left: `${i * 16.67}%` }} />
            ))}
          </div>

          {/* Mock Map Title */}
          <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-3 py-2 shadow-sm">
            <div className="text-sm font-medium">Fleet Coverage Map</div>
            <div className="text-xs text-muted-foreground">Real-time vehicle positions</div>
          </div>

          {/* Vehicle Markers */}
          {vehicles.map((vehicle, index) => {
            const x = Math.min(Math.max(10 + (index * 15) % 70, 10), 85);
            const y = Math.min(Math.max(15 + (index * 12) % 60, 15), 75);

            return (
              <div
                key={vehicle.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
                data-testid={`vehicle-marker-${vehicle.id}`}
              >
                {/* Vehicle Marker */}
                <div className="relative">
                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${statusColors[vehicle.status]} hover:scale-110 transition-transform`}>
                    <Truck className="w-3 h-3 text-white" />
                  </div>

                  {/* Direction Indicator */}
                  {vehicle.speed > 0 && (
                    <div
                      className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full opacity-75"
                      style={{ transform: `rotate(${vehicle.heading}deg)` }}
                    >
                      <Navigation className="w-2 h-2 text-white ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  <div className="text-sm font-medium">{vehicle.registrationNumber}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${statusColors[vehicle.status]}`} />
                    <span className="text-xs text-muted-foreground">{statusLabels[vehicle.status]}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Lat: {vehicle.lat.toFixed(4)}, Lng: {vehicle.lng.toFixed(4)}
                  </div>
                  {vehicle.speed > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Speed: {vehicle.speed} km/h
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Vehicle Status Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-muted-foreground">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">Offline</span>
            </div>
          </div>

          <Badge variant="secondary" className="text-xs">
            Last updated: Just now
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}