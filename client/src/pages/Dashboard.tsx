import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Vehicle, Trip } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FleetStats from "@/components/FleetStats";
import VehicleCard from "@/components/VehicleCard";
import TripCard from "@/components/TripCard";
import MapView from "@/components/MapView";
import EmailNotificationCenter from "@/components/EmailNotificationCenter";
import QuickActions from "@/components/QuickActions";
import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch fleet statistics
  const { data: fleetStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/fleet/stats"],
  });

  // Fetch vehicles
  const { data: vehicles = [], isLoading: vehiclesLoading, error: vehiclesError } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  // Fetch active trips
  const { data: trips = [], isLoading: tripsLoading, error: tripsError } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  // Provide safe fallback for fleet stats
  const safeFleetStats = fleetStats || {
    totalVehicles: 0,
    activeVehicles: 0,
    maintenanceVehicles: 0,
    offlineVehicles: 0,
    activeTrips: 0,
    plannedTrips: 0,
    completedTripsToday: 0,
    avgFuelLevel: 0,
    lowFuelAlerts: 0,
    totalDistance: 0
  };

  // Transform vehicles for map display (only those with location data)
  const mapVehicles = vehicles
    .filter((vehicle) => vehicle.lastLatitude && vehicle.lastLongitude)
    .map((vehicle) => ({
      id: vehicle.id,
      registrationNumber: vehicle.licensePlate,
      lat: parseFloat(vehicle.lastLatitude!),
      lng: parseFloat(vehicle.lastLongitude!),
      status: vehicle.status,
      heading: 0, // Default heading since we don't have this data
      speed: 0, // Default speed since we don't have this data
    }));

  // Get recent vehicles (latest 2)
  const recentVehicles = vehicles.slice(0, 2);

  // Get active trips only
  const activeTrips = trips.filter((trip) => trip.status === "in_progress");

  // For now we'll hide email notifications until we implement the endpoint
  const emailNotifications: any[] = [];

  const handleRefreshDashboard = () => {
    // Invalidate all relevant queries to force refetch
    queryClient.invalidateQueries({ queryKey: ["/api/fleet/stats"] });
    queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
    
    toast({
      title: "Dashboard Updated",
      description: "Fleet data has been refreshed",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fleet Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of your vehicle fleet operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: Just now</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshDashboard}
            data-testid="button-refresh-dashboard"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Fleet Statistics */}
      {statsLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : statsError ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-destructive">Failed to load fleet statistics</p>
          </CardContent>
        </Card>
      ) : (
        <FleetStats stats={safeFleetStats} />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {vehiclesLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </CardContent>
            </Card>
          ) : vehiclesError ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <p className="text-destructive">Failed to load vehicle data</p>
              </CardContent>
            </Card>
          ) : (
            <MapView vehicles={mapVehicles} />
          )}
          <QuickActions />
        </div>

        {/* Right Column - Recent Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Vehicle Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {vehiclesLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              ) : vehiclesError ? (
                <p className="text-destructive text-center">Failed to load vehicles</p>
              ) : recentVehicles.length > 0 ? (
                recentVehicles.map((vehicle: any) => (
                  <div key={vehicle.id} className="text-sm">
                    <VehicleCard 
                      id={vehicle.id}
                      registrationNumber={vehicle.licensePlate}
                      make={vehicle.make}
                      model={vehicle.model}
                      year={vehicle.year}
                      status={vehicle.status}
                      currentLocation="Location data not available"
                      fuelLevel={0}
                      driverName="Driver data not available"
                      lastUpdate={new Date(vehicle.createdAt).toLocaleString()}
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center">No vehicles found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Trips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Active Trips</CardTitle>
        </CardHeader>
        <CardContent>
          {tripsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : tripsError ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-destructive">Failed to load trips data</p>
            </div>
          ) : activeTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTrips.map((trip: any) => (
                <TripCard 
                  key={trip.id}
                  id={trip.id}
                  origin="Trip location data not available"
                  destination="Trip location data not available"
                  vehicle={{
                    registrationNumber: "Unknown vehicle",
                    driverName: "Unknown driver"
                  }}
                  status={trip.status}
                  startDate={new Date(trip.startTime).toLocaleDateString()}
                  expectedArrival={trip.endTime ? new Date(trip.endTime).toLocaleDateString() : "TBD"}
                  progress={trip.status === "completed" ? 100 : 50}
                  loadWeight={0}
                  distance={trip.distance ? parseFloat(trip.distance) : 0}
                  fuelBudget={0}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No active trips found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}