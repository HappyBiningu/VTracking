import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import AppSidebar from "@/components/AppSidebar";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import FleetOverview from "@/pages/FleetOverview";
import VehicleDetails from "@/pages/VehicleDetails";
import DriverManagement from "@/pages/DriverManagement";
import ActiveTrips from "@/pages/ActiveTrips";
import TripPlanning from "@/pages/TripPlanning";
import RouteOptimization from "@/pages/RouteOptimization";
import FuelManagement from "@/pages/FuelManagement";
import Reports from "@/pages/Reports";
import Documents from "@/pages/Documents";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/fleet" component={FleetOverview} />
      <Route path="/vehicles" component={VehicleDetails} />
      <Route path="/drivers" component={DriverManagement} />
      <Route path="/trips" component={ActiveTrips} />
      <Route path="/planning" component={TripPlanning} />
      <Route path="/routes" component={RouteOptimization} />
      <Route path="/fuel" component={FuelManagement} />
      <Route path="/reports" component={Reports} />
      <Route path="/documents" component={Documents} />
      <Route component={NotFound} />
    </Switch>
  );
}

function UnauthenticatedRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Custom sidebar width for vehicle tracking application
  const style = {
    "--sidebar-width": "20rem",       // 320px for better content
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <SidebarInset>
            <header className="flex items-center justify-between p-4 border-b">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-auto">
              <AuthenticatedRouter />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return <UnauthenticatedRouter />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="fleettrack-theme">
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}