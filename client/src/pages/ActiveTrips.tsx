
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TripCard from "@/components/TripCard";
import { Search, Filter, Plus, MapPin, Clock, TrendingUp, AlertCircle } from "lucide-react";
import type { Trip } from "@shared/schema";

export default function ActiveTrips() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("startTime");
  const [location, setLocation] = useLocation();

  // Fetch trips
  const { data: trips = [], isLoading, error } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  // Filter and sort trips
  const filteredTrips = trips
    .filter((trip) => {
      const matchesSearch = trip.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "startTime":
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case "status":
          return a.status.localeCompare(b.status);
        case "distance":
          return (parseFloat(b.distance || "0") - parseFloat(a.distance || "0"));
        default:
          return 0;
      }
    });

  // Group trips by status
  const tripsByStatus = {
    planned: trips.filter(t => t.status === "planned"),
    in_progress: trips.filter(t => t.status === "in_progress"),
    completed: trips.filter(t => t.status === "completed"),
    delayed: trips.filter(t => t.status === "delayed"),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Failed to load trips data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Active Trips</h1>
          <p className="text-muted-foreground">
            Monitor and manage all ongoing and planned trips
          </p>
        </div>
        <Button onClick={() => setLocation("/trips/trip-planning")}>
          <Plus className="h-4 w-4 mr-2" />
          Plan New Trip
        </Button>
      </div>

      {/* Trip Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-muted-foreground">All trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tripsByStatus.in_progress.length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planned</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{tripsByStatus.planned.length}</div>
            <p className="text-xs text-muted-foreground">Upcoming trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{tripsByStatus.delayed.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trips by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="startTime">Start Time</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trip Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({trips.length})</TabsTrigger>
          <TabsTrigger value="in_progress">Active ({tripsByStatus.in_progress.length})</TabsTrigger>
          <TabsTrigger value="planned">Planned ({tripsByStatus.planned.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({tripsByStatus.completed.length})</TabsTrigger>
          <TabsTrigger value="delayed">Delayed ({tripsByStatus.delayed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                origin="Origin data not available"
                destination="Destination data not available"
                vehicle={{
                  registrationNumber: "Unknown vehicle",
                  driverName: "Unknown driver"
                }}
                status={trip.status}
                startDate={new Date(trip.startTime).toLocaleDateString()}
                expectedArrival={trip.endTime ? new Date(trip.endTime).toLocaleDateString() : "TBD"}
                progress={trip.status === "completed" ? 100 : trip.status === "in_progress" ? 50 : 0}
                loadWeight={0}
                distance={trip.distance ? parseFloat(trip.distance) : 0}
                fuelBudget={0}
              />
            ))}
          </div>
        </TabsContent>

        {["in_progress", "planned", "completed", "delayed"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tripsByStatus[status as keyof typeof tripsByStatus].map((trip) => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  origin="Origin data not available"
                  destination="Destination data not available"
                  vehicle={{
                    registrationNumber: "Unknown vehicle",
                    driverName: "Unknown driver"
                  }}
                  status={trip.status}
                  startDate={new Date(trip.startTime).toLocaleDateString()}
                  expectedArrival={trip.endTime ? new Date(trip.endTime).toLocaleDateString() : "TBD"}
                  progress={trip.status === "completed" ? 100 : trip.status === "in_progress" ? 50 : 0}
                  loadWeight={0}
                  distance={trip.distance ? parseFloat(trip.distance) : 0}
                  fuelBudget={0}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
