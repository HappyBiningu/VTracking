import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FleetStats from "@/components/FleetStats";
import VehicleCard from "@/components/VehicleCard";
import TripCard from "@/components/TripCard";
import MapView from "@/components/MapView";
import EmailNotificationCenter from "@/components/EmailNotificationCenter";
import QuickActions from "@/components/QuickActions";
import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // todo: remove mock functionality
  const mockFleetStats = {
    totalVehicles: 24,
    activeVehicles: 18,
    maintenanceVehicles: 4,
    offlineVehicles: 2,
    activeTrips: 12,
    plannedTrips: 8,
    completedTripsToday: 5,
    avgFuelLevel: 68,
    lowFuelAlerts: 3,
    totalDistance: 45780
  };

  const mockRecentVehicles = [
    {
      id: "1",
      registrationNumber: "TRK-001-ZW",
      make: "Mercedes-Benz",
      model: "Actros",
      year: 2020,
      status: "active" as const,
      currentLocation: "Harare, Zimbabwe",
      fuelLevel: 75,
      driverName: "John Mukamba",
      lastUpdate: "5 minutes ago"
    },
    {
      id: "2",
      registrationNumber: "TRK-002-ZW",
      make: "Volvo", 
      model: "FH16",
      year: 2019,
      status: "maintenance" as const,
      currentLocation: "Bulawayo Service Center",
      fuelLevel: 30,
      driverName: "Sarah Moyo",
      lastUpdate: "2 hours ago"
    }
  ];

  const mockActiveTrips = [
    {
      id: "TRP001",
      origin: "Harare, Zimbabwe",
      destination: "Cape Town, South Africa",
      vehicle: {
        registrationNumber: "TRK-001-ZW",
        driverName: "John Mukamba"
      },
      status: "in-progress" as const,
      startDate: "Dec 15, 2024",
      expectedArrival: "Dec 18, 2024",
      progress: 65,
      loadWeight: 25000,
      distance: 1247,
      fuelBudget: 450
    }
  ];

  const mockMapVehicles = [
    {
      id: "1",
      registrationNumber: "TRK-001-ZW",
      lat: -17.8252,
      lng: 31.0335,
      status: "active" as const,
      heading: 45,
      speed: 65
    },
    {
      id: "2",
      registrationNumber: "TRK-002-ZW",
      lat: -20.1547,
      lng: 28.5833,
      status: "maintenance" as const,
      heading: 180,
      speed: 0
    },
    {
      id: "3",
      registrationNumber: "TRK-003-ZW",
      lat: -18.9756,
      lng: 32.6850,
      status: "active" as const,
      heading: 270,
      speed: 45
    }
  ];

  const mockEmailNotifications = [
    {
      id: "1",
      type: "trip-update" as const,
      subject: "Trip TRP001 - Progress Update",
      recipient: "manager@logistics.com",
      status: "sent" as const,
      timestamp: "5 minutes ago",
      vehicleId: "TRK-001-ZW",
      priority: "medium" as const
    },
    {
      id: "2",
      type: "fuel-alert" as const,
      subject: "Low Fuel Alert - TRK-003-ZW",
      recipient: "dispatch@logistics.com",
      status: "pending" as const,
      timestamp: "10 minutes ago",
      vehicleId: "TRK-003-ZW",
      priority: "high" as const
    }
  ];

  const handleRefreshDashboard = () => {
    console.log('Dashboard refresh triggered');
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
      <FleetStats stats={mockFleetStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <MapView vehicles={mockMapVehicles} />
          <QuickActions />
        </div>

        {/* Right Column - Notifications and Recent Activity */}
        <div className="space-y-6">
          <EmailNotificationCenter notifications={mockEmailNotifications} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Vehicle Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRecentVehicles.map((vehicle) => (
                <div key={vehicle.id} className="text-sm">
                  <VehicleCard {...vehicle} />
                </div>
              ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockActiveTrips.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}