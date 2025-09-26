
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  MapPin, 
  Truck, 
  User, 
  Clock,
  Route,
  Fuel,
  Package,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Trash2,
  Copy
} from "lucide-react";
import { format } from "date-fns";
import type { Vehicle } from "@shared/schema";

interface PlannedTrip {
  id: string;
  origin: {
    address: string;
    coordinates: { lat: number; lng: number; };
  };
  destination: {
    address: string;
    coordinates: { lat: number; lng: number; };
  };
  vehicleId: string;
  driverId: string;
  scheduledDate: Date;
  estimatedDuration: number; // in hours
  estimatedDistance: number; // in km
  estimatedFuelCost: number;
  cargo: {
    type: string;
    weight: number;
    value?: number;
  };
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
}

export default function TripPlanning() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<PlannedTrip | null>(null);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Fetch vehicles and other data
  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  // Mock drivers data
  const mockDrivers = [
    { id: "drv-001", name: "John Mukamba", status: "available" },
    { id: "drv-002", name: "Sarah Moyo", status: "available" },
    { id: "drv-003", name: "Peter Chimuka", status: "on_trip" },
    { id: "drv-004", name: "Mary Ndlovu", status: "available" },
  ];

  // Mock planned trips
  const mockPlannedTrips: PlannedTrip[] = [
    {
      id: "trip-plan-001",
      origin: {
        address: "Harare, Zimbabwe",
        coordinates: { lat: -17.8292, lng: 31.0522 }
      },
      destination: {
        address: "Bulawayo, Zimbabwe",
        coordinates: { lat: -20.1619, lng: 28.5833 }
      },
      vehicleId: "veh-001",
      driverId: "drv-001",
      scheduledDate: new Date("2024-12-20T08:00:00"),
      estimatedDuration: 6,
      estimatedDistance: 440,
      estimatedFuelCost: 180,
      cargo: {
        type: "General Goods",
        weight: 2500
      },
      priority: "high",
      status: "scheduled",
      notes: "Delivery to main warehouse",
      createdAt: new Date("2024-12-15T10:30:00")
    },
    {
      id: "trip-plan-002",
      origin: {
        address: "Mutare, Zimbabwe",
        coordinates: { lat: -18.9707, lng: 32.6731 }
      },
      destination: {
        address: "Beira, Mozambique",
        coordinates: { lat: -19.8436, lng: 34.8389 }
      },
      vehicleId: "veh-002",
      driverId: "drv-002",
      scheduledDate: new Date("2024-12-21T06:00:00"),
      estimatedDuration: 4,
      estimatedDistance: 290,
      estimatedFuelCost: 120,
      cargo: {
        type: "Export Goods",
        weight: 3200,
        value: 15000
      },
      priority: "urgent",
      status: "confirmed",
      notes: "Cross-border delivery - ensure all documents are ready",
      createdAt: new Date("2024-12-14T14:20:00")
    },
    {
      id: "trip-plan-003",
      origin: {
        address: "Gweru, Zimbabwe",
        coordinates: { lat: -19.4499, lng: 29.8119 }
      },
      destination: {
        address: "Masvingo, Zimbabwe",
        coordinates: { lat: -20.0637, lng: 30.8956 }
      },
      vehicleId: "veh-003",
      driverId: "drv-004",
      scheduledDate: new Date("2024-12-22T09:30:00"),
      estimatedDuration: 2,
      estimatedDistance: 150,
      estimatedFuelCost: 65,
      cargo: {
        type: "Medical Supplies",
        weight: 800
      },
      priority: "medium",
      status: "draft",
      notes: "Temperature-controlled cargo",
      createdAt: new Date("2024-12-16T11:45:00")
    }
  ];

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.licensePlate : vehicleId;
  };

  const getDriverName = (driverId: string) => {
    const driver = mockDrivers.find(d => d.id === driverId);
    return driver ? driver.name : driverId;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-blue-600 bg-blue-50 border-blue-200";
      case "low": return "text-gray-600 bg-gray-50 border-gray-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-600";
      case "scheduled": return "text-blue-600";
      case "in_progress": return "text-purple-600";
      case "completed": return "text-green-800";
      case "cancelled": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const createTrip = () => {
    console.log("Create trip functionality");
    setIsCreateTripOpen(false);
  };

  const editTrip = (trip: PlannedTrip) => {
    setSelectedTrip(trip);
    setIsEditTripOpen(true);
  };

  const duplicateTrip = (trip: PlannedTrip) => {
    console.log(`Duplicate trip: ${trip.id}`);
  };

  const deleteTrip = (tripId: string) => {
    console.log(`Delete trip: ${tripId}`);
  };

  // Filter trips by selected date
  const selectedDateTrips = selectedDate ? 
    mockPlannedTrips.filter(trip => 
      trip.scheduledDate.toDateString() === selectedDate.toDateString()
    ) : [];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trip Planning</h1>
          <p className="text-muted-foreground">
            Plan, schedule, and manage upcoming trips and deliveries
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List View
            </Button>
          </div>
          <Dialog open={isCreateTripOpen} onOpenChange={setIsCreateTripOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Plan New Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Plan New Trip</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Origin</Label>
                    <Input placeholder="Starting location" />
                  </div>
                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Input placeholder="Destination location" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.filter(v => v.status === "active").map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.licensePlate} - {vehicle.make} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Driver</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDrivers.filter(d => d.status === "available").map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Scheduled Date & Time</Label>
                    <Input type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo Type</Label>
                    <Input placeholder="Type of cargo" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo Weight (kg)</Label>
                    <Input type="number" placeholder="Weight in kg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea placeholder="Additional trip information" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsCreateTripOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createTrip}>Create Trip</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Planned</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPlannedTrips.length}</div>
            <p className="text-xs text-muted-foreground">Trips this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockPlannedTrips.filter(t => t.status === "confirmed").length}
            </div>
            <p className="text-xs text-muted-foreground">Ready to execute</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockPlannedTrips.filter(t => t.priority === "urgent").length}
            </div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Fuel Cost</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockPlannedTrips.reduce((sum, trip) => sum + trip.estimatedFuelCost, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar/List View */}
        <div className="lg:col-span-2">
          {viewMode === "calendar" ? (
            <Card>
              <CardHeader>
                <CardTitle>Trip Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                
                {selectedDate && selectedDateTrips.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">
                      Trips on {selectedDate.toLocaleDateString()}
                    </h4>
                    {selectedDateTrips.map(trip => (
                      <div key={trip.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {trip.origin.address} → {trip.destination.address}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {trip.scheduledDate.toLocaleTimeString()} • {getVehicleName(trip.vehicleId)}
                            </div>
                          </div>
                          <Badge className={getPriorityColor(trip.priority)}>
                            {trip.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Planned Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPlannedTrips.map(trip => (
                    <div key={trip.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h4 className="font-semibold">Trip #{trip.id}</h4>
                            <Badge className={getPriorityColor(trip.priority)}>
                              {trip.priority}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(trip.status)}>
                              {trip.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <span className="font-medium">From:</span>
                                {trip.origin.address}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4 text-red-600" />
                                <span className="font-medium">To:</span>
                                {trip.destination.address}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Scheduled:</span>
                                {trip.scheduledDate.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Route className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Distance:</span>
                                {trip.estimatedDistance} km • {trip.estimatedDuration}h
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              {getVehicleName(trip.vehicleId)}
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {getDriverName(trip.driverId)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              {trip.cargo.type} ({trip.cargo.weight}kg)
                            </div>
                            <div className="flex items-center gap-2">
                              <Fuel className="h-4 w-4" />
                              ${trip.estimatedFuelCost}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editTrip(trip)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => duplicateTrip(trip)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteTrip(trip.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Available Vehicles</div>
                <div className="text-lg font-semibold">
                  {vehicles.filter(v => v.status === "active").length}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Available Drivers</div>
                <div className="text-lg font-semibold">
                  {mockDrivers.filter(d => d.status === "available").length}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pending Approvals</div>
                <div className="text-lg font-semibold">
                  {mockPlannedTrips.filter(t => t.status === "draft").length}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Trips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Next 3 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPlannedTrips
                  .filter(trip => {
                    const threeDaysFromNow = new Date();
                    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
                    return trip.scheduledDate <= threeDaysFromNow && trip.scheduledDate >= new Date();
                  })
                  .slice(0, 3)
                  .map(trip => (
                    <div key={trip.id} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">
                        {trip.origin.address.split(',')[0]} → {trip.destination.address.split(',')[0]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {trip.scheduledDate.toLocaleDateString()} • {getVehicleName(trip.vehicleId)}
                      </div>
                      <Badge size="sm" className={getPriorityColor(trip.priority) + " mt-1"}>
                        {trip.priority}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Trip Dialog */}
      <Dialog open={isEditTripOpen} onOpenChange={setIsEditTripOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Trip - {selectedTrip?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedTrip && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Trip Details</TabsTrigger>
                <TabsTrigger value="route">Route & Timing</TabsTrigger>
                <TabsTrigger value="cargo">Cargo & Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Origin</Label>
                    <Input defaultValue={selectedTrip.origin.address} />
                  </div>
                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Input defaultValue={selectedTrip.destination.address} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle</Label>
                    <Select defaultValue={selectedTrip.vehicleId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.licensePlate} - {vehicle.make} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Driver</Label>
                    <Select defaultValue={selectedTrip.driverId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDrivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="route" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Scheduled Date & Time</Label>
                    <Input 
                      type="datetime-local" 
                      defaultValue={selectedTrip.scheduledDate.toISOString().slice(0, 16)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Duration (hours)</Label>
                    <Input 
                      type="number" 
                      defaultValue={selectedTrip.estimatedDuration.toString()} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Distance (km)</Label>
                    <Input 
                      type="number" 
                      defaultValue={selectedTrip.estimatedDistance.toString()} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Fuel Cost</Label>
                    <Input 
                      type="number" 
                      defaultValue={selectedTrip.estimatedFuelCost.toString()} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select defaultValue={selectedTrip.priority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue={selectedTrip.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cargo" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cargo Type</Label>
                    <Input defaultValue={selectedTrip.cargo.type} />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input 
                      type="number" 
                      defaultValue={selectedTrip.cargo.weight.toString()} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo Value (optional)</Label>
                    <Input 
                      type="number" 
                      defaultValue={selectedTrip.cargo.value?.toString() || ""} 
                      placeholder="Estimated value in USD"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea 
                    defaultValue={selectedTrip.notes} 
                    placeholder="Additional trip information"
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditTripOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditTripOpen(false)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
