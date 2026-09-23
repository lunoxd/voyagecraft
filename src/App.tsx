import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { AboutPage } from './pages/AboutPage';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { BookingsPage } from './pages/BookingsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { AdminPage } from './pages/AdminPage';
import { AdminManagePage } from './pages/AdminManagePage';
import { EurekaPage } from './pages/EurekaPage';
import { GatewayPage } from './pages/GatewayPage';
import { SagaPage } from './pages/SagaPage';
import { TestsPage } from './pages/TestsPage';
import { LogsPage } from './pages/LogsPage';
import { BookingModal } from './components/BookingModal';
import { AddPackageModal } from './components/AddPackageModal';
import { AuthModal } from './components/AuthModal';
import { SignInModal, SignUpModal } from './components/AuthModals';
import { ReceiptModal } from './components/ReceiptModal';
import { RubricsReviewModal } from './components/RubricsReviewModal';
import { Grainient } from './components/ui/Grainient';
import FooterSection from './components/FooterSection';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isManageRoute = location.pathname === '/admin/manage';

  if (isManageRoute) {
    return (
      <div className="min-h-screen bg-white text-black font-mono">
        <Routes>
          <Route path="/admin/manage" element={<AdminManagePage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col font-sans selection:bg-white selection:text-black relative">
      {/* Full-Screen Grainient WebGL Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <Grainient
          color1="#223d41"
          color2="#ffffff"
          color3="#132225"
          timeSpeed={0.25}
          colorBalance={0.0}
          warpStrength={1.0}
          warpFrequency={5.0}
          warpSpeed={2.0}
          warpAmplitude={50.0}
          blendAngle={0.0}
          blendSoftness={0.05}
          rotationAmount={500.0}
          noiseScale={2.0}
          grainAmount={0.1}
          grainScale={2.0}
          grainAnimated={false}
          contrast={1.5}
          gamma={1.0}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.9}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:id" element={<PackageDetailPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/manage" element={<AdminManagePage />} />
          <Route path="/eureka" element={<EurekaPage />} />
          <Route path="/gateway" element={<GatewayPage />} />
          <Route path="/saga" element={<SagaPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Routes>
      </main>

      {/* Modern Minimalist White Footer Section */}
      <FooterSection />

      {/* Global Modals */}
      <BookingModal />
      <AddPackageModal />
      <AuthModal />
      <SignInModal />
      <SignUpModal />
      <ReceiptModal />
      <RubricsReviewModal />
      </div>
    </div>
  );
};

export function App() {
  return (
    <Router>
      <StoreProvider>
        <AppLayout />
      </StoreProvider>
    </Router>
  );
}

export default App;
