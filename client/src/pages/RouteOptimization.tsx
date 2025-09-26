
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Route,
  MapPin,
  Clock,
  Fuel,
  TrendingDown,
  TrendingUp,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Calculator,
  Map,
  Plus,
  Settings
} from "lucide-react";

interface RouteOption {
  id: string;
  name: string;
  distance: number;
  estimatedTime: number;
  fuelCost: number;
  tollCosts: number;
  trafficCondition: "light" | "moderate" | "heavy";
  roadCondition: "excellent" | "good" | "fair" | "poor";
  difficulty: "easy" | "moderate" | "difficult";
  waypoints: Array<{
    name: string;
    coordinates: { lat: number; lng: number; };
    stopTime?: number;
  }>;
  weatherImpact: "none" | "low" | "moderate" | "high";
  riskFactors: string[];
  advantages: string[];
}

interface OptimizationCriteria {
  priority: "time" | "cost" | "fuel" | "balanced";
  avoidTolls: boolean;
  avoidHighways: boolean;
  maxStops: number;
  vehicleType: "truck" | "van" | "car";
  cargoWeight: number;
}

export default function RouteOptimization() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<OptimizationCriteria>({
    priority: "balanced",
    avoidTolls: false,
    avoidHighways: false,
    maxStops: 5,
    vehicleType: "truck",
    cargoWeight: 2000
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Mock route options
  const mockRouteOptions: RouteOption[] = [
    {
      id: "route-001",
      name: "Fastest Route",
      distance: 440,
      estimatedTime: 5.5,
      fuelCost: 165,
      tollCosts: 25,
      trafficCondition: "moderate",
      roadCondition: "excellent",
      difficulty: "easy",
      waypoints: [
        { name: "Harare", coordinates: { lat: -17.8292, lng: 31.0522 } },
        { name: "Chegutu", coordinates: { lat: -18.1167, lng: 30.15 }, stopTime: 15 },
        { name: "Kadoma", coordinates: { lat: -18.3333, lng: 29.9167 }, stopTime: 10 },
        { name: "Bulawayo", coordinates: { lat: -20.1619, lng: 28.5833 } }
      ],
      weatherImpact: "none",
      riskFactors: ["Highway traffic during peak hours"],
      advantages: ["Direct route", "Good road conditions", "Multiple fuel stations"]
    },
    {
      id: "route-002",
      name: "Most Economic",
      distance: 485,
      estimatedTime: 6.8,
      fuelCost: 142,
      tollCosts: 0,
      trafficCondition: "light",
      roadCondition: "good",
      difficulty: "moderate",
      waypoints: [
        { name: "Harare", coordinates: { lat: -17.8292, lng: 31.0522 } },
        { name: "Marondera", coordinates: { lat: -18.1833, lng: 31.55 }, stopTime: 20 },
        { name: "Gweru", coordinates: { lat: -19.4499, lng: 29.8119 }, stopTime: 30 },
        { name: "Bulawayo", coordinates: { lat: -20.1619, lng: 28.5833 } }
      ],
      weatherImpact: "low",
      riskFactors: ["Some road construction", "Rural areas with limited services"],
      advantages: ["No toll fees", "Lower fuel consumption", "Scenic route"]
    },
    {
      id: "route-003",
      name: "Balanced Route",
      distance: 462,
      estimatedTime: 6.0,
      fuelCost: 155,
      tollCosts: 12,
      trafficCondition: "light",
      roadCondition: "good",
      difficulty: "easy",
      waypoints: [
        { name: "Harare", coordinates: { lat: -17.8292, lng: 31.0522 } },
        { name: "Norton", coordinates: { lat: -17.8833, lng: 30.7 }, stopTime: 10 },
        { name: "Kwekwe", coordinates: { lat: -18.9167, lng: 29.8167 }, stopTime: 20 },
        { name: "Bulawayo", coordinates: { lat: -20.1619, lng: 28.5833 } }
      ],
      weatherImpact: "none",
      riskFactors: ["Minor traffic in urban areas"],
      advantages: ["Good time-cost balance", "Reliable road conditions", "Emergency services available"]
    }
  ];

  const getTrafficColor = (condition: string) => {
    switch (condition) {
      case "light": return "text-green-600";
      case "moderate": return "text-orange-600";
      case "heavy": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getRoadConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "fair": return "text-orange-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600";
      case "moderate": return "text-orange-600";
      case "difficult": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const optimizeRoute = () => {
    if (!origin || !destination) {
      alert("Please enter both origin and destination");
      return;
    }

    setIsOptimizing(true);
    // Simulate optimization process
    setTimeout(() => {
      setRouteOptions(mockRouteOptions);
      setIsOptimizing(false);
    }, 2000);
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, ""]);
  };

  const updateWaypoint = (index: number, value: string) => {
    const updated = [...waypoints];
    updated[index] = value;
    setWaypoints(updated);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const selectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
    console.log(`Selected route: ${route.name}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Route Optimization</h1>
          <p className="text-muted-foreground">
            Find the most efficient routes considering traffic, costs, and road conditions
          </p>
        </div>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Optimization Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Optimization Criteria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={criteria.priority} onValueChange={(value: any) => setCriteria({...criteria, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Minimize Time</SelectItem>
                    <SelectItem value="cost">Minimize Cost</SelectItem>
                    <SelectItem value="fuel">Minimize Fuel</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select value={criteria.vehicleType} onValueChange={(value: any) => setCriteria({...criteria, vehicleType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cargo Weight (kg)</Label>
                <Input 
                  type="number" 
                  value={criteria.cargoWeight} 
                  onChange={(e) => setCriteria({...criteria, cargoWeight: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={criteria.avoidTolls}
                  onChange={(e) => setCriteria({...criteria, avoidTolls: e.target.checked})}
                />
                <Label>Avoid toll roads</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={criteria.avoidHighways}
                  onChange={(e) => setCriteria({...criteria, avoidHighways: e.target.checked})}
                />
                <Label>Avoid highways</Label>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setIsSettingsOpen(false)}>
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Route Planning Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Route Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  placeholder="Starting location"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="End location"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              {/* Waypoints */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Waypoints</Label>
                  <Button size="sm" variant="outline" onClick={addWaypoint}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stop
                  </Button>
                </div>
                {waypoints.map((waypoint, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Stop ${index + 1}`}
                      value={waypoint}
                      onChange={(e) => updateWaypoint(index, e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeWaypoint(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Quick Criteria</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={criteria.priority === "time" ? "default" : "outline"}
                    onClick={() => setCriteria({...criteria, priority: "time"})}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Fastest
                  </Button>
                  <Button
                    size="sm"
                    variant={criteria.priority === "cost" ? "default" : "outline"}
                    onClick={() => setCriteria({...criteria, priority: "cost"})}
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Cheapest
                  </Button>
                  <Button
                    size="sm"
                    variant={criteria.priority === "fuel" ? "default" : "outline"}
                    onClick={() => setCriteria({...criteria, priority: "fuel"})}
                  >
                    <Fuel className="h-4 w-4 mr-2" />
                    Eco-friendly
                  </Button>
                  <Button
                    size="sm"
                    variant={criteria.priority === "balanced" ? "default" : "outline"}
                    onClick={() => setCriteria({...criteria, priority: "balanced"})}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Balanced
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={optimizeRoute}
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Route className="h-4 w-4 mr-2" />
                    Optimize Route
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Options */}
      {routeOptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Route Options</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {routeOptions.map((route) => (
              <Card 
                key={route.id} 
                className={`cursor-pointer transition-all ${
                  selectedRoute?.id === route.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => selectRoute(route)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                    {selectedRoute?.id === route.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Distance</div>
                      <div className="font-semibold">{route.distance} km</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time</div>
                      <div className="font-semibold">{route.estimatedTime}h</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Fuel Cost</div>
                      <div className="font-semibold">${route.fuelCost}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tolls</div>
                      <div className="font-semibold">${route.tollCosts}</div>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Traffic</span>
                      <Badge variant="outline" className={getTrafficColor(route.trafficCondition)}>
                        {route.trafficCondition}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Road Condition</span>
                      <Badge variant="outline" className={getRoadConditionColor(route.roadCondition)}>
                        {route.roadCondition}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Difficulty</span>
                      <Badge variant="outline" className={getDifficultyColor(route.difficulty)}>
                        {route.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Waypoints */}
                  <div>
                    <div className="text-sm font-medium mb-2">Route</div>
                    <div className="space-y-1">
                      {route.waypoints.map((waypoint, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            index === 0 ? 'bg-green-500' : 
                            index === route.waypoints.length - 1 ? 'bg-red-500' : 
                            'bg-blue-500'
                          }`} />
                          <span>{waypoint.name}</span>
                          {waypoint.stopTime && (
                            <Badge variant="secondary" className="text-xs">
                              {waypoint.stopTime}min
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Factors */}
                  {route.riskFactors.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Risk Factors
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {route.riskFactors.map((risk, index) => (
                          <li key={index}>• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Advantages */}
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Advantages
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {route.advantages.map((advantage, index) => (
                        <li key={index}>• {advantage}</li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    variant={selectedRoute?.id === route.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectRoute(route);
                    }}
                  >
                    {selectedRoute?.id === route.id ? "Selected" : "Select Route"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selected Route Details */}
      {selectedRoute && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Selected Route: {selectedRoute.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Detailed Breakdown</TabsTrigger>
                <TabsTrigger value="weather">Weather & Conditions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{selectedRoute.distance} km</div>
                      <div className="text-sm text-muted-foreground">Total Distance</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{selectedRoute.estimatedTime}h</div>
                      <div className="text-sm text-muted-foreground">Estimated Time</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">${selectedRoute.fuelCost + selectedRoute.tollCosts}</div>
                      <div className="text-sm text-muted-foreground">Total Cost</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{selectedRoute.waypoints.length - 2}</div>
                      <div className="text-sm text-muted-foreground">Stops</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Cost Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Fuel Cost:</span>
                        <span>${selectedRoute.fuelCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Toll Fees:</span>
                        <span>${selectedRoute.tollCosts}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>${selectedRoute.fuelCost + selectedRoute.tollCosts}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Efficiency Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Cost per km:</span>
                        <span>${((selectedRoute.fuelCost + selectedRoute.tollCosts) / selectedRoute.distance).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Speed:</span>
                        <span>{(selectedRoute.distance / selectedRoute.estimatedTime).toFixed(0)} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel Efficiency:</span>
                        <span>{(selectedRoute.distance / (selectedRoute.fuelCost / 1.5)).toFixed(1)} km/L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-4">Route Segments</h4>
                  <div className="space-y-3">
                    {selectedRoute.waypoints.map((waypoint, index) => {
                      if (index === selectedRoute.waypoints.length - 1) return null;
                      const nextWaypoint = selectedRoute.waypoints[index + 1];
                      const segmentDistance = Math.floor(selectedRoute.distance / (selectedRoute.waypoints.length - 1));
                      const segmentTime = (selectedRoute.estimatedTime / (selectedRoute.waypoints.length - 1));
                      
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-green-500' : 'bg-blue-500'
                            }`} />
                            {index < selectedRoute.waypoints.length - 2 && (
                              <div className="w-0.5 h-8 bg-gray-300 mt-1" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{waypoint.name} → {nextWaypoint.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {segmentDistance} km • {segmentTime.toFixed(1)}h
                              {waypoint.stopTime && (
                                <span> • {waypoint.stopTime}min stop</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="weather" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Weather Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Weather Impact:</span>
                          <Badge variant="outline">
                            {selectedRoute.weatherImpact}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current weather conditions show {selectedRoute.weatherImpact} impact on travel time and safety.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Road Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Overall Condition:</span>
                          <Badge variant="outline" className={getRoadConditionColor(selectedRoute.roadCondition)}>
                            {selectedRoute.roadCondition}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Road surface and infrastructure are in {selectedRoute.roadCondition} condition.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Live Traffic Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Current Traffic:</span>
                        <Badge variant="outline" className={getTrafficColor(selectedRoute.trafficCondition)}>
                          {selectedRoute.trafficCondition}
                        </Badge>
                      </div>
                      <Progress value={
                        selectedRoute.trafficCondition === "light" ? 25 :
                        selectedRoute.trafficCondition === "moderate" ? 60 : 90
                      } />
                      <div className="text-sm text-muted-foreground">
                        Traffic conditions are currently {selectedRoute.trafficCondition}. 
                        Consider departing during off-peak hours for better travel times.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline">
                Export Route
              </Button>
              <Button>
                Start Navigation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
