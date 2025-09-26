import VehicleCard from '../VehicleCard';

export default function VehicleCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <VehicleCard
        id="1"
        registrationNumber="TRK-001-ZW"
        make="Mercedes-Benz"
        model="Actros"
        year={2020}
        status="active"
        currentLocation="Harare, Zimbabwe"
        fuelLevel={75}
        driverName="John Mukamba"
        lastUpdate="5 minutes ago"
      />
      
      <VehicleCard
        id="2"
        registrationNumber="TRK-002-ZW"
        make="Volvo"
        model="FH16"
        year={2019}
        status="maintenance"
        currentLocation="Bulawayo Service Center"
        fuelLevel={30}
        driverName="Sarah Moyo"
        lastUpdate="2 hours ago"
      />
      
      <VehicleCard
        id="3"
        registrationNumber="TRK-003-ZW"
        make="Scania"
        model="R450"
        year={2021}
        status="offline"
        currentLocation="Last known: Mutare"
        fuelLevel={15}
        driverName="Peter Chimuka"
        lastUpdate="1 day ago"
      />
    </div>
  );
}