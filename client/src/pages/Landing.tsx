import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Fuel, Mail, BarChart3, Shield, Zap, Globe } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    console.log('Login triggered');
    window.location.href = '/login';
  };

  const features = [
    {
      icon: MapPin,
      title: "Real-time GPS Tracking",
      description: "Monitor vehicle locations and routes in real-time across SADC regions"
    },
    {
      icon: Mail,
      title: "Email Communications",
      description: "Integrated email notifications for driver updates and fleet alerts"
    },
    {
      icon: Fuel,
      title: "Fuel Management",
      description: "Track fuel consumption, costs, and receive low-fuel alerts"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Generate comprehensive reports and performance insights"
    },
    {
      icon: Shield,
      title: "Border Documentation",
      description: "Manage customs and border crossing documents efficiently"
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Real-time email notifications for maintenance and operational updates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative">
          <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
            <div className="max-w-4xl text-center space-y-8">
              {/* Logo & Brand */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Truck className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">FleetTrack Pro</h1>
                  <p className="text-sm text-muted-foreground">Vehicle Tracking System</p>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-1">
                  <Globe className="w-4 h-4 mr-1" />
                  Built for SADC Region
                </Badge>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Professional Fleet
                  <br />
                  <span className="text-primary">Management System</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive vehicle tracking and fleet management designed specifically for 
                  logistics companies operating in Zimbabwe and across SADC borders.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={handleLogin}
                  data-testid="button-login"
                >
                  Access Fleet Dashboard
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8"
                  onClick={() => window.location.href = '/signup'}
                  data-testid="button-signup"
                >
                  Sign Up Free
                </Button>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-2xl mx-auto">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <p className="text-sm text-muted-foreground">Real-time Monitoring</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary">16+</div>
                    <p className="text-sm text-muted-foreground">SADC Countries</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary">Email</div>
                    <p className="text-sm text-muted-foreground">Communication System</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Complete Fleet Management Solution</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All the tools you need to efficiently manage your truck fleet, 
              optimize routes, and maintain comprehensive operational oversight.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-6">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 FleetTrack Pro. Professional Vehicle Tracking for SADC Region.</p>
        </div>
      </footer>
    </div>
  );
}