
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2,
  User, 
  Phone, 
  Mail,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Star,
  Truck
} from "lucide-react";

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: Date;
  dateOfBirth: Date;
  address: string;
  status: "active" | "inactive" | "suspended";
  joinDate: Date;
  currentVehicle?: string;
  totalTrips: number;
  totalDistance: number;
  rating: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: {
    license: { uploaded: boolean; expiry: Date; };
    medicalCert: { uploaded: boolean; expiry: Date; };
    contract: { uploaded: boolean; };
  };
}

export default function DriverManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock drivers data
  const mockDrivers: Driver[] = [
    {
      id: "drv-001",
      firstName: "John",
      lastName: "Mukamba",
      email: "john.mukamba@email.com",
      phone: "+263773123456",
      licenseNumber: "DL-MUK-001",
      licenseExpiry: new Date("2025-06-15"),
      dateOfBirth: new Date("1985-03-12"),
      address: "123 Main Street, Harare, Zimbabwe",
      status: "active",
      joinDate: new Date("2022-01-15"),
      currentVehicle: "TRK-001-ZW",
      totalTrips: 187,
      totalDistance: 45670,
      rating: 4.8,
      emergencyContact: {
        name: "Mary Mukamba",
        phone: "+263773987654",
        relationship: "Spouse"
      },
      documents: {
        license: { uploaded: true, expiry: new Date("2025-06-15") },
        medicalCert: { uploaded: true, expiry: new Date("2024-12-30") },
        contract: { uploaded: true }
      }
    },
    {
      id: "drv-002",
      firstName: "Sarah",
      lastName: "Moyo",
      email: "sarah.moyo@email.com",
      phone: "+263712345678",
      licenseNumber: "DL-MOY-002",
      licenseExpiry: new Date("2024-11-20"),
      dateOfBirth: new Date("1990-07-08"),
      address: "456 Second Avenue, Bulawayo, Zimbabwe",
      status: "active",
      joinDate: new Date("2021-06-10"),
      currentVehicle: "TRK-002-ZW",
      totalTrips: 203,
      totalDistance: 52340,
      rating: 4.9,
      emergencyContact: {
        name: "James Moyo",
        phone: "+263778456123",
        relationship: "Brother"
      },
      documents: {
        license: { uploaded: true, expiry: new Date("2024-11-20") },
        medicalCert: { uploaded: false, expiry: new Date("2024-08-15") },
        contract: { uploaded: true }
      }
    },
    {
      id: "drv-003",
      firstName: "Peter",
      lastName: "Chimuka",
      email: "peter.chimuka@email.com",
      phone: "+263717891234",
      licenseNumber: "DL-CHI-003",
      licenseExpiry: new Date("2025-03-10"),
      dateOfBirth: new Date("1982-11-25"),
      address: "789 Third Street, Mutare, Zimbabwe",
      status: "suspended",
      joinDate: new Date("2020-09-05"),
      totalTrips: 156,
      totalDistance: 38920,
      rating: 4.2,
      emergencyContact: {
        name: "Grace Chimuka",
        phone: "+263774567890",
        relationship: "Sister"
      },
      documents: {
        license: { uploaded: true, expiry: new Date("2025-03-10") },
        medicalCert: { uploaded: true, expiry: new Date("2025-01-20") },
        contract: { uploaded: true }
      }
    },
    {
      id: "drv-004",
      firstName: "Mary",
      lastName: "Ndlovu",
      email: "mary.ndlovu@email.com",
      phone: "+263719876543",
      licenseNumber: "DL-NDL-004",
      licenseExpiry: new Date("2024-08-30"),
      dateOfBirth: new Date("1988-05-14"),
      address: "321 Fourth Road, Gweru, Zimbabwe",
      status: "inactive",
      joinDate: new Date("2023-02-20"),
      totalTrips: 89,
      totalDistance: 21480,
      rating: 4.6,
      emergencyContact: {
        name: "David Ndlovu",
        phone: "+263772345678",
        relationship: "Husband"
      },
      documents: {
        license: { uploaded: true, expiry: new Date("2024-08-30") },
        medicalCert: { uploaded: true, expiry: new Date("2024-10-15") },
        contract: { uploaded: false }
      }
    }
  ];

  // Filter drivers
  const filteredDrivers = mockDrivers.filter((driver) => {
    const matchesSearch = driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate driver statistics
  const driverStats = {
    total: mockDrivers.length,
    active: mockDrivers.filter(d => d.status === "active").length,
    inactive: mockDrivers.filter(d => d.status === "inactive").length,
    suspended: mockDrivers.filter(d => d.status === "suspended").length,
    documentsExpiring: mockDrivers.filter(d => {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return d.licenseExpiry <= thirtyDaysFromNow || d.documents.medicalCert.expiry <= thirtyDaysFromNow;
    }).length
  };

  const getDocumentStatus = (expiry: Date) => {
    const daysUntil = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return { status: "expired", color: "text-red-600", icon: AlertTriangle };
    if (daysUntil <= 30) return { status: "expiring_soon", color: "text-orange-600", icon: AlertTriangle };
    return { status: "valid", color: "text-green-600", icon: CheckCircle2 };
  };

  const addDriver = () => {
    console.log("Add driver functionality");
    setIsAddDialogOpen(false);
  };

  const editDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsEditDialogOpen(true);
  };

  const deleteDriver = (driverId: string) => {
    console.log(`Delete driver: ${driverId}`);
  };

  const suspendDriver = (driverId: string) => {
    console.log(`Suspend driver: ${driverId}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Driver Management</h1>
          <p className="text-muted-foreground">
            Manage driver profiles, licenses, documents, and performance
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+263773123456" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input id="license" placeholder="DL-ABC-123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">License Expiry</Label>
                <Input id="licenseExpiry" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Complete address" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addDriver}>Add Driver</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driverStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{driverStats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <div className="w-2 h-2 bg-gray-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{driverStats.inactive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{driverStats.suspended}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Docs Expiring</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{driverStats.documentsExpiring}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
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
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drivers List */}
      <div className="space-y-4">
        {filteredDrivers.map((driver) => {
          const licenseStatus = getDocumentStatus(driver.licenseExpiry);
          const medicalStatus = getDocumentStatus(driver.documents.medicalCert.expiry);
          const LicenseIcon = licenseStatus.icon;
          const MedicalIcon = medicalStatus.icon;

          return (
            <Card key={driver.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Driver Profile */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${driver.firstName}${driver.lastName}`} />
                        <AvatarFallback>
                          {driver.firstName[0]}{driver.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {driver.firstName} {driver.lastName}
                        </h3>
                        <p className="text-muted-foreground text-sm">{driver.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            driver.status === "active" ? "default" : 
                            driver.status === "suspended" ? "destructive" : "secondary"
                          }>
                            {driver.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {driver.licenseNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Contact</div>
                      <div className="text-sm">{driver.phone}</div>
                      {driver.currentVehicle && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {driver.currentVehicle}
                        </div>
                      )}
                    </div>

                    {/* Performance */}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Performance</div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{driver.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {driver.totalTrips} trips • {driver.totalDistance.toLocaleString()} km
                      </div>
                    </div>

                    {/* License Status */}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">License</div>
                      <div className={`flex items-center gap-2 ${licenseStatus.color}`}>
                        <LicenseIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {driver.licenseExpiry.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Medical Certificate */}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Medical</div>
                      <div className={`flex items-center gap-2 ${medicalStatus.color}`}>
                        <MedicalIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {driver.documents.medicalCert.uploaded ? 
                            driver.documents.medicalCert.expiry.toLocaleDateString() : 
                            "Not uploaded"
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editDriver(driver)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {driver.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => suspendDriver(driver.id)}
                      >
                        Suspend
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteDriver(driver.id)}
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

      {/* Edit Driver Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Edit Driver - {selectedDriver?.firstName} {selectedDriver?.lastName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDriver && (
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue={selectedDriver.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue={selectedDriver.lastName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={selectedDriver.email} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input defaultValue={selectedDriver.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label>License Number</Label>
                    <Input defaultValue={selectedDriver.licenseNumber} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue={selectedDriver.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Address</Label>
                    <Textarea defaultValue={selectedDriver.address} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Driver's License</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Expiry Date</Label>
                          <Input 
                            type="date" 
                            defaultValue={selectedDriver.licenseExpiry.toISOString().split('T')[0]} 
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Uploaded</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Medical Certificate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Expiry Date</Label>
                          <Input 
                            type="date" 
                            defaultValue={selectedDriver.documents.medicalCert.expiry.toISOString().split('T')[0]} 
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <div className="flex items-center gap-2 mt-2">
                            {selectedDriver.documents.medicalCert.uploaded ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Uploaded</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-sm">Not uploaded</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Trips</div>
                        <div className="text-2xl font-bold">{selectedDriver.totalTrips}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Distance</div>
                        <div className="text-2xl font-bold">{selectedDriver.totalDistance.toLocaleString()} km</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="text-xl font-bold">{selectedDriver.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">
                          Recent trips and activities will appear here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Contact Name</Label>
                        <Input defaultValue={selectedDriver.emergencyContact.name} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input defaultValue={selectedDriver.emergencyContact.phone} />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Relationship</Label>
                        <Input defaultValue={selectedDriver.emergencyContact.relationship} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
