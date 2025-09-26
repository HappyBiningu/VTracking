
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VehicleCard from "@/components/VehicleCard";
import { Search, Filter, Plus, MapPin, Truck, Fuel, Wrench } from "lucide-react";
import type { Vehicle } from "@shared/schema";

export default function FleetOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("licensePlate");
  const [location, setLocation] = useLocation();

  // Fetch vehicles
  const { data: vehicles = [], isLoading, error } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  // Filter and sort vehicles
  const filteredVehicles = vehicles
    .filter((vehicle) => {
      const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "licensePlate":
          return a.licensePlate.localeCompare(b.licensePlate);
        case "make":
          return a.make.localeCompare(b.make);
        case "year":
          return b.year - a.year;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Group vehicles by status
  const vehiclesByStatus = {
    active: vehicles.filter(v => v.status === "active"),
    maintenance: vehicles.filter(v => v.status === "maintenance"),
    offline: vehicles.filter(v => v.status === "offline"),
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
        <p className="text-destructive">Failed to load fleet data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fleet Overview</h1>
          <p className="text-muted-foreground">
            Comprehensive view of all vehicles in your fleet
          </p>
        </div>
        <Button onClick={() => setLocation("/fleet/vehicle-details")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Fleet Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">Fleet size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{vehiclesByStatus.active.length}</div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{vehiclesByStatus.maintenance.length}</div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{vehiclesByStatus.offline.length}</div>
            <p className="text-xs text-muted-foreground">Not operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles by license plate, make, or model..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="licensePlate">License Plate</SelectItem>
            <SelectItem value="make">Make</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Vehicles ({vehicles.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({vehiclesByStatus.active.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance ({vehiclesByStatus.maintenance.length})</TabsTrigger>
          <TabsTrigger value="offline">Offline ({vehiclesByStatus.offline.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                id={vehicle.id}
                registrationNumber={vehicle.licensePlate}
                make={vehicle.make}
                model={vehicle.model}
                year={vehicle.year}
                status={vehicle.status}
                currentLocation={vehicle.lastLatitude && vehicle.lastLongitude 
                  ? `${vehicle.lastLatitude}, ${vehicle.lastLongitude}` 
                  : "Location unavailable"}
                fuelLevel={Math.floor(Math.random() * 100)} // Mock fuel level
                driverName="Driver data not available"
                lastUpdate={new Date(vehicle.createdAt).toLocaleString()}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehiclesByStatus.active.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                id={vehicle.id}
                registrationNumber={vehicle.licensePlate}
                make={vehicle.make}
                model={vehicle.model}
                year={vehicle.year}
                status={vehicle.status}
                currentLocation={vehicle.lastLatitude && vehicle.lastLongitude 
                  ? `${vehicle.lastLatitude}, ${vehicle.lastLongitude}` 
                  : "Location unavailable"}
                fuelLevel={Math.floor(Math.random() * 100)}
                driverName="Driver data not available"
                lastUpdate={new Date(vehicle.createdAt).toLocaleString()}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehiclesByStatus.maintenance.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                id={vehicle.id}
                registrationNumber={vehicle.licensePlate}
                make={vehicle.make}
                model={vehicle.model}
                year={vehicle.year}
                status={vehicle.status}
                currentLocation={vehicle.lastLatitude && vehicle.lastLongitude 
                  ? `${vehicle.lastLatitude}, ${vehicle.lastLongitude}` 
                  : "Location unavailable"}
                fuelLevel={Math.floor(Math.random() * 100)}
                driverName="Driver data not available"
                lastUpdate={new Date(vehicle.createdAt).toLocaleString()}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehiclesByStatus.offline.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                id={vehicle.id}
                registrationNumber={vehicle.licensePlate}
                make={vehicle.make}
                model={vehicle.model}
                year={vehicle.year}
                status={vehicle.status}
                currentLocation={vehicle.lastLatitude && vehicle.lastLongitude 
                  ? `${vehicle.lastLatitude}, ${vehicle.lastLongitude}` 
                  : "Location unavailable"}
                fuelLevel={Math.floor(Math.random() * 100)}
                driverName="Driver data not available"
                lastUpdate={new Date(vehicle.createdAt).toLocaleString()}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
