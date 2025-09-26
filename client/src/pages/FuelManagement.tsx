
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fuel, TrendingDown, TrendingUp, AlertTriangle, DollarSign, BarChart3 } from "lucide-react";
import type { Vehicle } from "@shared/schema";

export default function FuelManagement() {
  const [timeRange, setTimeRange] = useState("7d");
  const [vehicleFilter, setVehicleFilter] = useState("all");

  // Fetch vehicles for fuel data
  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  // Mock fuel data - in real app this would come from fuel sensors/API
  const mockFuelData = vehicles.map(vehicle => ({
    id: vehicle.id,
    licensePlate: vehicle.licensePlate,
    make: vehicle.make,
    model: vehicle.model,
    currentFuel: Math.floor(Math.random() * 100),
    fuelCapacity: 200,
    weeklyConsumption: Math.floor(Math.random() * 500) + 200,
    efficiency: Math.floor(Math.random() * 5) + 8, // km per liter
    cost: Math.floor(Math.random() * 1000) + 500,
    lastRefill: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    status: vehicle.status,
  }));

  // Calculate fleet fuel statistics
  const totalFuelLevel = mockFuelData.reduce((sum, v) => sum + v.currentFuel, 0);
  const avgFuelLevel = mockFuelData.length > 0 ? totalFuelLevel / mockFuelData.length : 0;
  const lowFuelVehicles = mockFuelData.filter(v => v.currentFuel < 25);
  const totalWeeklyCost = mockFuelData.reduce((sum, v) => sum + v.cost, 0);
  const avgEfficiency = mockFuelData.length > 0 ? 
    mockFuelData.reduce((sum, v) => sum + v.efficiency, 0) / mockFuelData.length : 0;

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
          <h1 className="text-2xl font-bold">Fuel Management</h1>
          <p className="text-muted-foreground">
            Monitor fuel consumption, efficiency, and costs across your fleet
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* Fuel Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fuel Level</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgFuelLevel.toFixed(0)}%</div>
            <Progress value={avgFuelLevel} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Fuel Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowFuelVehicles.length}</div>
            <p className="text-xs text-muted-foreground">Vehicles below 25%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Fuel Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWeeklyCost.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              -5.2% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEfficiency.toFixed(1)} km/L</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +2.1% improvement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Fleet Overview</TabsTrigger>
          <TabsTrigger value="alerts">Fuel Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {mockFuelData.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{vehicle.licensePlate}</h3>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                      <Badge variant={vehicle.status === "active" ? "default" : "secondary"}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Fuel Level</div>
                        <div className="text-lg font-bold">
                          {vehicle.currentFuel}%
                        </div>
                        <Progress 
                          value={vehicle.currentFuel} 
                          className="w-20 mt-1"
                        />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-medium">Efficiency</div>
                        <div className="text-lg font-bold">
                          {vehicle.efficiency} km/L
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-medium">Weekly Cost</div>
                        <div className="text-lg font-bold">
                          ${vehicle.cost}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-medium">Last Refill</div>
                        <div className="text-sm">
                          {vehicle.lastRefill.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Low Fuel Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowFuelVehicles.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No low fuel alerts at this time
                </p>
              ) : (
                <div className="space-y-4">
                  {lowFuelVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                      <div>
                        <h4 className="font-semibold text-red-800">{vehicle.licensePlate}</h4>
                        <p className="text-sm text-red-600">
                          {vehicle.make} {vehicle.model} - {vehicle.currentFuel}% fuel remaining
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Locate Vehicle
                        </Button>
                        <Button size="sm">
                          Schedule Refill
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Fuel Consumption Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart placeholder - Weekly fuel consumption over time
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart placeholder - Vehicle efficiency comparison
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart placeholder - Fuel cost by vehicle/month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Consumers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockFuelData
                    .sort((a, b) => b.weeklyConsumption - a.weeklyConsumption)
                    .slice(0, 5)
                    .map((vehicle, index) => (
                      <div key={vehicle.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {index + 1}
                          </div>
                          <span className="font-medium">{vehicle.licensePlate}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {vehicle.weeklyConsumption}L/week
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
