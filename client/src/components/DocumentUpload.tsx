
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (documentData: any) => void;
  vehicleId?: string;
  driverId?: string;
}

export default function DocumentUpload({ isOpen, onClose, onUpload, vehicleId, driverId }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const documentCategories = [
    { value: "vehicle_licence", label: "Vehicle Licence", requiresVehicle: true },
    { value: "insurance", label: "Insurance Certificate", requiresVehicle: true },
    { value: "vehicle_fitness", label: "Vehicle Fitness Certificate", requiresVehicle: true },
    { value: "driver_licence", label: "Driver Licence", requiresDriver: true },
    { value: "medical_certificate", label: "Medical Certificate", requiresDriver: true },
    { value: "border_clearance", label: "Border Clearance Documentation" },
    { value: "customs_declaration", label: "Customs Declaration" },
    { value: "transit_permit", label: "Transit Permit" },
    { value: "receipts", label: "Receipts & Invoices" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload only PDF, JPEG, or PNG files");
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file || !category || !description) {
      setError("Please fill in all required fields");
      return;
    }

    const selectedCategory = documentCategories.find(cat => cat.value === category);
    if (selectedCategory?.requiresVehicle && !vehicleId) {
      setError("Vehicle selection required for this document type");
      return;
    }
    
    if (selectedCategory?.requiresDriver && !driverId) {
      setError("Driver selection required for this document type");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // In a real application, you would upload to a file storage service
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const documentData = {
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        category,
        description,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        vehicleId,
        driverId,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date(),
        status: "active",
        fileUrl: URL.createObjectURL(file) // In production, this would be the actual file URL
      };

      onUpload(documentData);
      resetForm();
      onClose();
    } catch (error) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setCategory("");
    setDescription("");
    setExpiryDate("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Document File *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="flex-1"
              />
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Accepted formats: PDF, JPEG, PNG (Max 10MB)
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Document Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select document category" />
              </SelectTrigger>
              <SelectContent>
                {documentCategories.map((cat) => (
                  <SelectItem 
                    key={cat.value} 
                    value={cat.value}
                    disabled={
                      (cat.requiresVehicle && !vehicleId) || 
                      (cat.requiresDriver && !driverId)
                    }
                  >
                    {cat.label}
                    {cat.requiresVehicle && !vehicleId && " (Vehicle Required)"}
                    {cat.requiresDriver && !driverId && " (Driver Required)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the document"
              rows={3}
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date (if applicable)</Label>
            <Input
              id="expiry"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading || !file}>
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
