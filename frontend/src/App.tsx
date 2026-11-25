import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { api } from './services/api';

// Public & Farmer Pages
import { LandingPage } from './pages/LandingPage';
import { FarmerPortal } from './pages/FarmerPortal';

// 14 Operational Suite Pages (Preserved 100%)
import { OverviewDashboard } from './pages/OverviewDashboard';
import { FleetManagement } from './pages/FleetManagement';
import { DigitalTwin } from './pages/DigitalTwin';
import { AIPredictions } from './pages/AIPredictions';
import { SensorMonitoring } from './pages/SensorMonitoring';
import { MaintenancePlanning } from './pages/MaintenancePlanning';
import { WorkOrders } from './pages/WorkOrders';
import { Technicians } from './pages/Technicians';
import { SpareParts } from './pages/SpareParts';
import { Analytics } from './pages/Analytics';
import { BaselineComparison } from './pages/BaselineComparison';
import { DemoSimulation } from './pages/DemoSimulation';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [criticalCount, setCriticalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const isPublicLanding = location.pathname === '/';

  const fetchAlertsCount = async () => {
    try {
      setRefreshing(true);
      const res = await api.getAlerts({ status_filter: 'New', level: 'Critical' });
      setCriticalCount(res.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlertsCount();
    // Poll every 15s for live updates
    const interval = setInterval(fetchAlertsCount, 15000);
    return () => clearInterval(interval);
  }, []);

  // Landing page renders clean full-bleed Agrovia experience
  if (isPublicLanding) {
    return <LandingPage />;
  }

  // App shell for Farmer Portal and 14 Fleet Admin Operations Modules
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased">
      {/* Navigation Sidebar */}
      <Sidebar criticalAlertCount={criticalCount} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header
          criticalAlertCount={criticalCount}
          onRefresh={fetchAlertsCount}
          isLoading={refreshing}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Routes>
            {/* Farmer Experience */}
            <Route path="/farmer-portal" element={<FarmerPortal />} />

            {/* 14 Operational Fleet Modules */}
            <Route path="/dashboard" element={<OverviewDashboard />} />
            <Route path="/fleet" element={<FleetManagement />} />
            <Route path="/twin" element={<DigitalTwin />} />
            <Route path="/predictions" element={<AIPredictions />} />
            <Route path="/sensors" element={<SensorMonitoring />} />
            <Route path="/planning" element={<MaintenancePlanning />} />
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/spare-parts" element={<SpareParts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/baseline" element={<BaselineComparison />} />
            <Route path="/demo" element={<DemoSimulation />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};
