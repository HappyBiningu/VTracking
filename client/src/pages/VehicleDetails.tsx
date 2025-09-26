
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2,
  Truck, 
  Fuel, 
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Settings,
  FileText,
  Wrench
} from "lucide-react";
import type { Vehicle } from "@shared/schema";

interface VehicleDetail extends Vehicle {
  mileage: number;
  fuelLevel: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: Date;
  };
  registration: {
    expiryDate: Date;
    registrationNumber: string;
  };
  driver: {
    name: string;
    license: string;
    contact: string;
  };
}

export default function VehicleDetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetail | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch vehicles
  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  // Mock detailed vehicle data
  const mockVehicleDetails: VehicleDetail[] = vehicles.map(vehicle => ({
    ...vehicle,
    mileage: Math.floor(Math.random() * 200000) + 50000,
    fuelLevel: Math.floor(Math.random() * 100),
    lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    nextMaintenance: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
    insurance: {
      provider: ["Zimnat", "Old Mutual", "Nyaradzo", "First Mutual"][Math.floor(Math.random() * 4)],
      policyNumber: `POL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
    },
    registration: {
      expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
      registrationNumber: vehicle.licensePlate,
    },
    driver: {
      name: ["John Mukamba", "Sarah Moyo", "Peter Chimuka", "Mary Ndlovu"][Math.floor(Math.random() * 4)],
      license: `DL-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      contact: `+263${Math.floor(Math.random() * 900000000) + 100000000}`,
    },
  }));

  // Filter vehicles
  const filteredVehicles = mockVehicleDetails.filter((vehicle) => {
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getMaintenanceStatus = (nextMaintenance: Date) => {
    const daysUntil = Math.ceil((nextMaintenance.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return { status: "overdue", color: "text-red-600", icon: AlertTriangle };
    if (daysUntil <= 7) return { status: "due_soon", color: "text-orange-600", icon: AlertTriangle };
    return { status: "good", color: "text-green-600", icon: CheckCircle2 };
  };

  const addVehicle = () => {
    console.log("Add vehicle functionality");
    setIsAddDialogOpen(false);
  };

  const editVehicle = (vehicle: VehicleDetail) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const deleteVehicle = (vehicleId: string) => {
    console.log(`Delete vehicle: ${vehicleId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vehicle Details</h1>
          <p className="text-muted-foreground">
            Detailed vehicle information, maintenance schedules, and documentation
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" placeholder="Toyota" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Hilux" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" placeholder="2023" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Plate</Label>
                <Input id="license" placeholder="ABC-123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input id="vin" placeholder="Vehicle Identification Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuel_capacity">Fuel Capacity (L)</Label>
                <Input id="fuel_capacity" type="number" placeholder="80" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional vehicle information" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addVehicle}>Add Vehicle</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
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
      </div>

      {/* Vehicle List */}
      <div className="space-y-4">
        {filteredVehicles.map((vehicle) => {
          const maintenanceStatus = getMaintenanceStatus(vehicle.nextMaintenance);
          const MaintenanceIcon = maintenanceStatus.icon;

          return (
            <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Vehicle Basic Info */}
                    <div>
                      <h3 className="text-lg font-semibold">{vehicle.licensePlate}</h3>
                      <p className="text-muted-foreground">
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={vehicle.status === "active" ? "default" : "secondary"}>
                          {vehicle.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {vehicle.mileage.toLocaleString()} km
                        </span>
                      </div>
                    </div>

                    {/* Fuel Level */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">Fuel Level</div>
                      <div className="text-lg font-bold">{vehicle.fuelLevel}%</div>
                      <Progress value={vehicle.fuelLevel} className="w-20 mt-1" />
                    </div>

                    {/* Maintenance Status */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">Maintenance</div>
                      <div className={`flex items-center gap-2 ${maintenanceStatus.color}`}>
                        <MaintenanceIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {vehicle.nextMaintenance.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Driver Info */}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Driver</div>
                      <div className="text-sm">{vehicle.driver.name}</div>
                      <div className="text-xs text-muted-foreground">{vehicle.driver.contact}</div>
                    </div>

                    {/* Insurance */}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Insurance</div>
                      <div className="text-sm">{vehicle.insurance.provider}</div>
                      <div className="text-xs text-muted-foreground">
                        Expires: {vehicle.insurance.expiryDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editVehicle(vehicle)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log(`View details for ${vehicle.licensePlate}`)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Edit Vehicle - {selectedVehicle?.licensePlate}
            </DialogTitle>
          </DialogHeader>
          
          {selectedVehicle && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Make</Label>
                    <Input defaultValue={selectedVehicle.make} />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input defaultValue={selectedVehicle.model} />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input defaultValue={selectedVehicle.year.toString()} />
                  </div>
                  <div className="space-y-2">
                    <Label>License Plate</Label>
                    <Input defaultValue={selectedVehicle.licensePlate} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue={selectedVehicle.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mileage</Label>
                    <Input defaultValue={selectedVehicle.mileage.toString()} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Last Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {selectedVehicle.lastMaintenance.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Next Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {selectedVehicle.nextMaintenance.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Button>
                  <Wrench className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Insurance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Provider</Label>
                          <Input defaultValue={selectedVehicle.insurance.provider} />
                        </div>
                        <div>
                          <Label>Policy Number</Label>
                          <Input defaultValue={selectedVehicle.insurance.policyNumber} />
                        </div>
                        <div>
                          <Label>Expiry Date</Label>
                          <Input 
                            type="date" 
                            defaultValue={selectedVehicle.insurance.expiryDate.toISOString().split('T')[0]} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Registration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Registration Number</Label>
                          <Input defaultValue={selectedVehicle.registration.registrationNumber} />
                        </div>
                        <div>
                          <Label>Expiry Date</Label>
                          <Input 
                            type="date" 
                            defaultValue={selectedVehicle.registration.expiryDate.toISOString().split('T')[0]} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Vehicle History</h3>
                  <p className="text-muted-foreground">
                    Trip history, maintenance records, and vehicle activities will appear here
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
