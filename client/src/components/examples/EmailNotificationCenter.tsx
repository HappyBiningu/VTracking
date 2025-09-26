import EmailNotificationCenter from '../EmailNotificationCenter';

export default function EmailNotificationCenterExample() {
  // todo: remove mock functionality  
  const mockNotifications = [
    {
      id: "1",
      type: "trip-update" as const,
      subject: "Trip TRP001 - Progress Update",
      recipient: "manager@logistics.com",
      status: "sent" as const,
      timestamp: "5 minutes ago",
      vehicleId: "TRK-001-ZW",
      priority: "medium" as const
    },
    {
      id: "2", 
      type: "fuel-alert" as const,
      subject: "Low Fuel Alert - TRK-003-ZW",
      recipient: "dispatch@logistics.com",
      status: "pending" as const,
      timestamp: "10 minutes ago",
      vehicleId: "TRK-003-ZW",
      priority: "high" as const
    },
    {
      id: "3",
      type: "maintenance-due" as const,
      subject: "Maintenance Reminder - TRK-002-ZW",
      recipient: "maintenance@logistics.com",
      status: "failed" as const,
      timestamp: "1 hour ago",
      vehicleId: "TRK-002-ZW", 
      priority: "medium" as const
    },
    {
      id: "4",
      type: "driver-message" as const,
      subject: "Border Crossing Update",
      recipient: "operations@logistics.com",
      status: "sent" as const,
      timestamp: "2 hours ago",
      priority: "low" as const
    }
  ];

  return (
    <div className="p-4 max-w-md">
      <EmailNotificationCenter notifications={mockNotifications} />
    </div>
  );
}