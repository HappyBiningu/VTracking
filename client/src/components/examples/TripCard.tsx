import TripCard from '../TripCard';

export default function TripCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <TripCard
        id="TRP001"
        origin="Harare, Zimbabwe"
        destination="Cape Town, South Africa"
        vehicle={{
          registrationNumber: "TRK-001-ZW",
          driverName: "John Mukamba"
        }}
        status="in-progress"
        startDate="Dec 15, 2024"
        expectedArrival="Dec 18, 2024"
        progress={65}
        loadWeight={25000}
        distance={1247}
        fuelBudget={450}
      />
      
      <TripCard
        id="TRP002"
        origin="Bulawayo, Zimbabwe"
        destination="Johannesburg, South Africa"
        vehicle={{
          registrationNumber: "TRK-002-ZW", 
          driverName: "Sarah Moyo"
        }}
        status="planned"
        startDate="Dec 16, 2024"
        expectedArrival="Dec 17, 2024"
        loadWeight={18000}
        distance={567}
        fuelBudget={220}
      />
      
      <TripCard
        id="TRP003"
        origin="Mutare, Zimbabwe"
        destination="Beira, Mozambique"
        vehicle={{
          registrationNumber: "TRK-003-ZW",
          driverName: "Peter Chimuka"
        }}
        status="delayed"
        startDate="Dec 14, 2024"
        expectedArrival="Dec 15, 2024"
        progress={85}
        loadWeight={22000}
        distance={290}
        fuelBudget={150}
      />
    </div>
  );
}