import AppSidebar from '../AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AppSidebarExample() {
  // todo: remove mock functionality
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Manager',
    email: 'john.manager@fleettrack.com',
    profileImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Mock the useAuth hook for demonstration
  const originalAuth = require('@/hooks/useAuth');
  const mockUseAuth = () => ({
    user: mockUser,
    isLoading: false,
    isAuthenticated: true
  });

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 p-4">
          <div className="text-center text-muted-foreground">
            Main content area - sidebar navigation demo
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}