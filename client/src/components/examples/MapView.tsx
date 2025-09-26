import MapView from '../MapView';

export default function MapViewExample() {
  // todo: remove mock functionality
  const mockVehicles = [
    {
      id: "1",
      registrationNumber: "TRK-001-ZW",
      lat: -17.8252,
      lng: 31.0335,
      status: "active" as const,
      heading: 45,
      speed: 65
    },
    {
      id: "2", 
      registrationNumber: "TRK-002-ZW",
      lat: -20.1547,
      lng: 28.5833,
      status: "maintenance" as const,
      heading: 180,
      speed: 0
    },
    {
      id: "3",
      registrationNumber: "TRK-003-ZW", 
      lat: -18.9756,
      lng: 32.6850,
      status: "active" as const,
      heading: 270,
      speed: 45
    },
    {
      id: "4",
      registrationNumber: "TRK-004-ZW",
      lat: -19.0159,
      lng: 29.1549,
      status: "offline" as const,
      heading: 0,
      speed: 0
    },
    {
      id: "5",
      registrationNumber: "TRK-005-ZW",
      lat: -17.8316,
      lng: 31.0492,
      status: "active" as const,
      heading: 90,
      speed: 55
    }
  ];

  return (
    <div className="p-4 h-[600px]">
      <MapView vehicles={mockVehicles} />
    </div>
  );
}