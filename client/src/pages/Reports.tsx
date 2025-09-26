
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Truck, 
  Fuel, 
  MapPin,
  Clock,
  DollarSign 
} from "lucide-react";
import { format } from "date-fns";

export default function Reports() {
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [reportType, setReportType] = useState("summary");

  // Fetch data for reports
  const { data: vehicles = [] } = useQuery({
    queryKey: ["/api/vehicles"],
  });

  const { data: trips = [] } = useQuery({
    queryKey: ["/api/trips"],
  });

  // Mock report data
  const reportData = {
    summary: {
      totalVehicles: vehicles.length,
      totalTrips: trips.length,
      totalDistance: trips.reduce((sum, trip) => sum + (parseFloat(trip.distance || "0")), 0),
      totalFuelCost: 15420,
      avgTripDuration: "4.2 hours",
      vehicleUtilization: 78.5,
    },
    fleet: {
      activeVehicles: vehicles.filter(v => v.status === "active").length,
      maintenanceVehicles: vehicles.filter(v => v.status === "maintenance").length,
      offlineVehicles: vehicles.filter(v => v.status === "offline").length,
      avgAge: 5.8,
      maintenanceCosts: 8500,
    },
    trips: {
      completedTrips: trips.filter(t => t.status === "completed").length,
      inProgressTrips: trips.filter(t => t.status === "in_progress").length,
      plannedTrips: trips.filter(t => t.status === "planned").length,
      delayedTrips: trips.filter(t => t.status === "delayed").length,
      onTimePercentage: 87.3,
    },
    fuel: {
      totalConsumption: 2340,
      avgEfficiency: 8.7,
      fuelCostPerKm: 0.85,
      carbonEmissions: 5.8,
    },
  };

  const predefinedReports = [
    {
      id: "fleet-summary",
      name: "Fleet Summary Report",
      description: "Overview of all vehicles, utilization, and performance metrics",
      type: "summary",
      icon: Truck,
    },
    {
      id: "trip-analysis",
      name: "Trip Analysis Report",
      description: "Detailed analysis of completed, ongoing, and planned trips",
      type: "operational",
      icon: MapPin,
    },
    {
      id: "fuel-efficiency",
      name: "Fuel Efficiency Report",
      description: "Fuel consumption, costs, and efficiency metrics",
      type: "financial",
      icon: Fuel,
    },
    {
      id: "maintenance-schedule",
      name: "Maintenance Schedule",
      description: "Upcoming and overdue maintenance requirements",
      type: "maintenance",
      icon: Clock,
    },
    {
      id: "cost-analysis",
      name: "Cost Analysis Report",
      description: "Financial breakdown of operational costs and ROI",
      type: "financial",
      icon: DollarSign,
    },
    {
      id: "performance-metrics",
      name: "Performance Metrics",
      description: "KPI dashboard with trends and comparative analysis",
      type: "analytics",
      icon: TrendingUp,
    },
  ];

  const generateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
    // In real app, this would trigger report generation
  };

  const exportReport = (format: string) => {
    console.log(`Exporting report in ${format} format`);
    // In real app, this would trigger download
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analytics for your fleet
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-60 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange as any}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(reportData.summary.totalDistance / 1000).toFixed(1)}k km
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData.summary.totalFuelCost.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicle Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.summary.vehicleUtilization}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.trips.completedTrips}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="predefined" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predefined">Predefined Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="predefined" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predefinedReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <report.icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-base">{report.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {report.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {report.description}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => generateReport(report.id)}
                      className="flex-1"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => exportReport('pdf')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Report Name</label>
                    <input 
                      type="text" 
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="Enter report name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Data Sources</label>
                    <div className="mt-2 space-y-2">
                      {['Vehicle Data', 'Trip Records', 'Fuel Consumption', 'Maintenance Logs', 'Driver Information'].map((source) => (
                        <label key={source} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{source}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Metrics</label>
                    <div className="mt-2 space-y-2">
                      {['Distance Traveled', 'Fuel Efficiency', 'Trip Duration', 'Cost Analysis', 'Performance KPIs'].map((metric) => (
                        <label key={metric} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{metric}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Output Format</label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">Save Template</Button>
                <Button>Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Scheduled Reports</h3>
            <Button>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule New Report
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Scheduled Reports</h3>
                <p className="text-muted-foreground mb-4">
                  Set up automatic report generation to receive regular updates
                </p>
                <Button variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
