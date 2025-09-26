
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  File, 
  FileImage, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Folder
} from "lucide-react";
import DocumentUpload from "@/components/DocumentUpload";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  vehicleId?: string;
  driverId?: string;
  size: string;
  uploadDate: Date;
  expiryDate?: Date;
  status: "active" | "expired" | "expiring_soon";
  description: string;
  fileUrl?: string;
}

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Mock documents data
  const mockDocuments: Document[] = [
    {
      id: "doc-001",
      name: "Vehicle Registration - ABC123",
      type: "pdf",
      category: "vehicle_licence",
      vehicleId: "veh-001",
      size: "2.4 MB",
      uploadDate: new Date("2024-01-15"),
      expiryDate: new Date("2025-01-15"),
      status: "active",
      description: "Vehicle licence certificate for ABC123"
    },
    {
      id: "doc-002",
      name: "Insurance Policy - XYZ789",
      type: "pdf",
      category: "insurance",
      vehicleId: "veh-002",
      size: "1.8 MB",
      uploadDate: new Date("2024-02-01"),
      expiryDate: new Date("2024-12-31"),
      status: "expiring_soon",
      description: "Third party insurance policy"
    },
    {
      id: "doc-003",
      name: "Driver License - John Doe",
      type: "pdf",
      category: "driver_licence",
      driverId: "drv-001",
      size: "0.5 MB",
      uploadDate: new Date("2024-01-10"),
      expiryDate: new Date("2024-11-15"),
      status: "expiring_soon",
      description: "Commercial driver's licence"
    },
    {
      id: "doc-004",
      name: "Vehicle Fitness Certificate - DEF456",
      type: "pdf",
      category: "vehicle_fitness",
      vehicleId: "veh-003",
      size: "3.2 MB",
      uploadDate: new Date("2024-03-01"),
      expiryDate: new Date("2024-09-01"),
      status: "expired",
      description: "Annual vehicle fitness inspection certificate"
    },
    {
      id: "doc-005",
      name: "Medical Certificate - John Doe",
      type: "pdf",
      category: "medical_certificate",
      driverId: "drv-001",
      size: "0.8 MB",
      uploadDate: new Date("2024-03-15"),
      expiryDate: new Date("2025-03-15"),
      status: "active",
      description: "Driver medical fitness certificate"
    },
    {
      id: "doc-006",
      name: "Border Clearance - Beitbridge",
      type: "pdf",
      category: "border_clearance",
      vehicleId: "veh-001",
      size: "1.2 MB",
      uploadDate: new Date("2024-03-20"),
      expiryDate: new Date("2024-04-20"),
      status: "active",
      description: "Border clearance documentation for Beitbridge crossing"
    },
    {
      id: "doc-007",
      name: "Goods Declaration Form",
      type: "pdf",
      category: "border_clearance",
      size: "0.6 MB",
      uploadDate: new Date("2024-03-18"),
      status: "active",
      description: "Customs goods declaration form"
    },
    {
      id: "doc-008",
      name: "Transit Permit - Regional",
      type: "pdf",
      category: "border_clearance",
      vehicleId: "veh-002",
      size: "0.9 MB",
      uploadDate: new Date("2024-03-22"),
      expiryDate: new Date("2024-04-22"),
      status: "active",
      description: "Regional transit permit for cross-border operations"
    }
  ];

  // Initialize documents state
  useState(() => {
    setDocuments(mockDocuments);
  });

  const handleDocumentUpload = (documentData: any) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      ...documentData,
    };
    setDocuments(prev => [newDocument, ...prev]);
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Group documents by status
  const documentsByStatus = {
    active: documents.filter(d => d.status === "active"),
    expiring_soon: documents.filter(d => d.status === "expiring_soon"),
    expired: documents.filter(d => d.status === "expired"),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "expiring_soon":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "jpg":
      case "png":
        return <FileImage className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const downloadDocument = (docId: string) => {
    console.log(`Downloading document: ${docId}`);
    // In real app, this would trigger download
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Manage vehicle registrations, insurance, licenses, and other important documents
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Document Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">All documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{documentsByStatus.active.length}</div>
            <p className="text-xs text-muted-foreground">Valid documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{documentsByStatus.expiring_soon.length}</div>
            <p className="text-xs text-muted-foreground">Need renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{documentsByStatus.expired.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="vehicle_licence">Vehicle Licence</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="vehicle_fitness">Vehicle Fitness</SelectItem>
            <SelectItem value="driver_licence">Driver Licence</SelectItem>
            <SelectItem value="medical_certificate">Medical Certificate</SelectItem>
            <SelectItem value="border_clearance">Border Clearance</SelectItem>
            <SelectItem value="receipts">Receipts</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="expiring">Expiring ({documentsByStatus.expiring_soon.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({documentsByStatus.expired.length})</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.type)}
                      <div>
                        <h4 className="font-semibold">{doc.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {doc.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>Size: {doc.size}</span>
                          <span>Uploaded: {doc.uploadDate.toLocaleDateString()}</span>
                          {doc.expiryDate && (
                            <span>Expires: {doc.expiryDate.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant={doc.category === "registration" ? "default" : "outline"}>
                        {doc.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        <span className="text-sm capitalize">
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadDocument(doc.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <div className="space-y-2">
            {documentsByStatus.expiring_soon.map((doc) => (
              <Card key={doc.id} className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.type)}
                      <div>
                        <h4 className="font-semibold text-orange-800">{doc.name}</h4>
                        <p className="text-sm text-orange-600">
                          Expires on {doc.expiryDate?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Renew
                      </Button>
                      <Button size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <div className="space-y-2">
            {documentsByStatus.expired.map((doc) => (
              <Card key={doc.id} className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.type)}
                      <div>
                        <h4 className="font-semibold text-red-800">{doc.name}</h4>
                        <p className="text-sm text-red-600">
                          Expired on {doc.expiryDate?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive">
                        Urgent Renewal
                      </Button>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["vehicle_licence", "insurance", "vehicle_fitness", "driver_licence", "medical_certificate", "border_clearance", "receipts"].map((category) => {
              const categoryDocs = documents.filter(d => d.category === category);
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-base capitalize flex items-center gap-2">
                      <Folder className="h-5 w-5 text-primary" />
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">{categoryDocs.length}</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Documents in this category
                    </p>
                    <div className="space-y-2">
                      {categoryDocs.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="flex items-center gap-2 text-sm">
                          {getStatusIcon(doc.status)}
                          <span className="truncate">{doc.name}</span>
                        </div>
                      ))}
                      {categoryDocs.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{categoryDocs.length - 3} more...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Document Upload Dialog */}
      <DocumentUpload
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
}
