import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Fuel, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface FleetStatsProps {
  stats: {
    totalVehicles: number;
    activeVehicles: number;
    maintenanceVehicles: number;
    offlineVehicles: number;
    activeTrips: number;
    plannedTrips: number;
    completedTripsToday: number;
    avgFuelLevel: number;
    lowFuelAlerts: number;
    totalDistance: number;
  };
}

export default function FleetStats({ stats }: FleetStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Vehicle Status Overview */}
      <Card data-testid="stats-vehicle-status">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fleet Status</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVehicles}</div>
          <p className="text-xs text-muted-foreground mb-3">Total Vehicles</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              {stats.activeVehicles} Active
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-1" />
              {stats.maintenanceVehicles} Maintenance
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
              {stats.offlineVehicles} Offline
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Trip Overview */}
      <Card data-testid="stats-trips">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trip Overview</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeTrips}</div>
          <p className="text-xs text-muted-foreground mb-3">Active Trips</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-500" />
                <span>Planned</span>
              </div>
              <span className="font-medium">{stats.plannedTrips}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>Today</span>
              </div>
              <span className="font-medium">{stats.completedTripsToday}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fuel Status */}
      <Card data-testid="stats-fuel">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fuel Status</CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgFuelLevel.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground mb-3">Average Fuel Level</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  stats.avgFuelLevel < 25 ? 'bg-red-500' : 
                  stats.avgFuelLevel < 50 ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, stats.avgFuelLevel))}%` }}
              />
            </div>
            {stats.lowFuelAlerts > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.lowFuelAlerts} Low
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Distance & Alerts */}
      <Card data-testid="stats-performance">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(stats.totalDistance / 1000).toFixed(1)}k
          </div>
          <p className="text-xs text-muted-foreground mb-3">Total Distance (km)</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Fuel Alerts</span>
              <Badge 
                variant={stats.lowFuelAlerts > 0 ? "destructive" : "secondary"} 
                className="text-xs"
              >
                {stats.lowFuelAlerts}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Maintenance Due</span>
              <Badge variant="secondary" className="text-xs">
                {stats.maintenanceVehicles}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}