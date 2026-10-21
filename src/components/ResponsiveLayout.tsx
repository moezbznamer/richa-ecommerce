
import { ReactNode } from 'react';
import MobileBottomNav from './MobileBottomNav';
import Navbar from './Navbar';

interface ResponsiveLayoutProps {
  children: ReactNode;
  showMobileNav?: boolean;
  showDesktopNav?: boolean;
}

const ResponsiveLayout = ({ 
  children, 
  showMobileNav = true, 
  showDesktopNav = true 
}: ResponsiveLayoutProps) => {
  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Desktop Navigation */}
      {showDesktopNav && (
        <div className="hidden lg:block">
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {showMobileNav && <MobileBottomNav />}
    </div>
  );
};

export default ResponsiveLayout;
