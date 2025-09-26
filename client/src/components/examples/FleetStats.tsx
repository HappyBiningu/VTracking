import FleetStats from '../FleetStats';

export default function FleetStatsExample() {
  // todo: remove mock functionality
  const mockStats = {
    totalVehicles: 24,
    activeVehicles: 18,
    maintenanceVehicles: 4,
    offlineVehicles: 2,
    activeTrips: 12,
    plannedTrips: 8,
    completedTripsToday: 5,
    avgFuelLevel: 68,
    lowFuelAlerts: 3,
    totalDistance: 45780
  };

  return (
    <div className="p-4">
      <FleetStats stats={mockStats} />
    </div>
  );
}