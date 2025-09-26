import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-6">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Truck className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-4">Route Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for seems to have taken a different route. 
            Let's get you back on track.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleGoHome} 
              className="w-full"
              data-testid="button-go-home"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="w-full"
              data-testid="button-go-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-muted-foreground">
              Need help? Contact fleet support for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
