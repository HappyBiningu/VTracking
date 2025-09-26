import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Zap, RefreshCw, Maximize2 } from "lucide-react";

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
  onVehicleClick?: (vehicle: Vehicle) => void;
  onRefresh?: () => void;
  onFullscreen?: () => void;
}

const statusColors = {
  active: "bg-green-500",
  maintenance: "bg-orange-500", 
  offline: "bg-red-500"
} as const;

export default function MapView({ 
  vehicles, 
  onVehicleClick,
  onRefresh,
  onFullscreen 
}: MapViewProps) {
  const handleVehicleClick = (vehicle: Vehicle) => {
    console.log(`Vehicle clicked: ${vehicle.registrationNumber}`);
    onVehicleClick?.(vehicle);
  };

  const handleRefresh = () => {
    console.log('Map refresh triggered');
    onRefresh?.();
  };

  const handleFullscreen = () => {
    console.log('Fullscreen map triggered');
    onFullscreen?.();
  };

  return (
    <Card className="h-full" data-testid="map-view">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Fleet Map View</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {vehicles.length} vehicles
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            data-testid="button-refresh-map"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            data-testid="button-fullscreen-map"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Simulated Map Container */}
        <div className="relative h-96 bg-muted/30 border rounded-lg mx-4 mb-4 overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Vehicle Markers */}
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform`}
              style={{
                left: `${20 + (index % 8) * 10}%`,
                top: `${30 + Math.floor(index / 8) * 15}%`
              }}
              onClick={() => handleVehicleClick(vehicle)}
              data-testid={`marker-${vehicle.id}`}
            >
              <div className="relative">
                <div className={`w-6 h-6 rounded-full ${statusColors[vehicle.status]} border-2 border-white shadow-lg flex items-center justify-center`}>
                  <Navigation 
                    className="w-3 h-3 text-white"
                    style={{ transform: `rotate(${vehicle.heading}deg)` }}
                  />
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-background border rounded px-2 py-1 text-xs font-medium shadow-md whitespace-nowrap">
                  {vehicle.registrationNumber}
                  <div className="text-muted-foreground">
                    {vehicle.speed} km/h
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-8 h-8 p-0"
              data-testid="button-zoom-in"
            >
              +
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-8 h-8 p-0"
              data-testid="button-zoom-out"
            >
              -
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background border rounded-lg p-3 shadow-md">
            <div className="text-xs font-medium mb-2">Vehicle Status</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Offline</span>
              </div>
            </div>
          </div>

          {/* Center Map Info */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Interactive Map View</p>
            <p className="text-xs">Real-time vehicle tracking</p>
          </div>
        </div>

        {/* Status Summary */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">Active:</span>
                <span className="font-medium">
                  {vehicles.filter(v => v.status === "active").length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-muted-foreground">Maintenance:</span>
                <span className="font-medium">
                  {vehicles.filter(v => v.status === "maintenance").length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-muted-foreground">Offline:</span>
                <span className="font-medium">
                  {vehicles.filter(v => v.status === "offline").length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Zap className="w-3 h-3" />
              <span className="text-xs">Live tracking</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}