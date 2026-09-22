import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  return (
    <div className="min-h-screen bg-slate-50/60 text-neutral-900 flex flex-col font-sans selection:bg-black selection:text-white relative">
      {/* Full-Screen Sky Blue & White Mix Grainient Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <Grainient
          color1="#FFFFFF"
          color2="#38BDF8"
          color3="#BAE6FD"
          timeSpeed={0.2}
          colorBalance={0.1}
          warpStrength={0.85}
          warpFrequency={4.5}
          warpSpeed={1.8}
          warpAmplitude={45.0}
          blendAngle={25.0}
          blendSoftness={0.08}
          rotationAmount={380.0}
          noiseScale={2.0}
          grainAmount={0.06}
          grainScale={2.2}
          grainAnimated={true}
          contrast={1.25}
          gamma={1.0}
          saturation={1.15}
          centerX={0.0}
          centerY={0.0}
          zoom={0.9}
        />
        {/* Soft atmospheric clarity layer */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] pointer-events-none" />
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
