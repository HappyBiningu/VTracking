
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Truck } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Vehicle {
  id: string;
  registrationNumber: string;
  lat: number;
  lng: number;
  status: "active" | "maintenance" | "offline";
  heading: number;
  speed: number;
}

interface MapViewProps {
  vehicles: Vehicle[];
}

const statusColors = {
  active: "#22c55e",
  maintenance: "#f97316", 
  offline: "#ef4444"
} as const;

const statusLabels = {
  active: "Active",
  maintenance: "Maintenance", 
  offline: "Offline"
} as const;

export default function MapView({ vehicles }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // Initialize map if not already created
    if (!mapRef.current) {
      const map = L.map('fleet-map').setView([-18.0, 29.0], 6); // Centered on Zimbabwe
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
    }

    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.clearLayers();
    }

    // Add vehicle markers
    vehicles.forEach((vehicle) => {
      if (markersRef.current) {
        // Create custom icon based on status
        const iconHtml = `
          <div style="
            width: 24px; 
            height: 24px; 
            background-color: ${statusColors[vehicle.status]}; 
            border: 2px solid white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M3 6h2l.5 2h13l.5-2h2v3h-1l-1 8H5l-1-8H3V6zm5 2v8h8V8H8z"/>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-vehicle-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([vehicle.lat, vehicle.lng], { 
          icon: customIcon 
        });

        // Add popup with vehicle information
        const popupContent = `
          <div style="font-family: system-ui; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
              ${vehicle.registrationNumber}
            </h3>
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <div style="
                width: 8px; 
                height: 8px; 
                background-color: ${statusColors[vehicle.status]}; 
                border-radius: 50%;
              "></div>
              <span style="font-size: 12px; color: #666;">
                ${statusLabels[vehicle.status]}
              </span>
            </div>
            <div style="font-size: 11px; color: #888;">
              Lat: ${vehicle.lat.toFixed(4)}, Lng: ${vehicle.lng.toFixed(4)}
            </div>
            ${vehicle.speed > 0 ? `
              <div style="font-size: 11px; color: #888;">
                Speed: ${vehicle.speed} km/h
              </div>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.addLayer(marker);
      }
    });

    // Fit map to show all vehicles
    if (vehicles.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(vehicles.map(v => [v.lat, v.lng]));
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [vehicles]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <Card data-testid="map-view">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">Fleet Location Overview</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{vehicles.length} vehicles tracked</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Real Map Container */}
        <div 
          id="fleet-map" 
          style={{ height: '400px', width: '100%' }}
          className="rounded-lg border"
        />

        {/* Vehicle Status Legend */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-muted-foreground">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">Offline</span>
            </div>
          </div>

          <Badge variant="secondary" className="text-xs">
            Powered by OpenStreetMap
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
</Leaflet>
