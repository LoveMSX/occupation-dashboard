
import { Component, ErrorInfo, ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/components/LanguageProvider";
import Index from "./pages/Index";
import EmployeesPage from "./pages/EmployeesPage";
import ProjectsPageWrapper from "./pages/ProjectsPageWrapper";
import ImportPage from "./pages/ImportPage";
import SettingsPage from "./pages/SettingsPage";
import OccupancyAnalytics from "./pages/analytics/OccupancyAnalytics";
import ProjectsAnalytics from "./pages/analytics/ProjectsAnalytics";
import SalesAnalysis from "./pages/analytics/SalesAnalysis";
import SalesPerformance from "./pages/analytics/SalesPerformance";
import SalesPageWrapper from "./pages/SalesPageWrapper";
import NotFound from "./pages/NotFound";
import AIAnalyzePage from "./pages/AIAnalyzePage";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleCallback } from "@/components/auth/GoogleCallback";

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode, name: string }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode, name: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Use the imported logger instead of console.log directly
    if (typeof console !== 'undefined' && console.error) {
      console.error(`Error in ${this.props.name}:`, error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded bg-red-50">
          <h3 className="text-lg font-bold text-red-700">Error in {this.props.name}</h3>
          <p className="text-red-600">{this.state.error?.message || 'Unknown error'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient();

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  return (
    <LanguageProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`flex-1 overflow-auto transition-all duration-200`}>
          <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="h-full">
            <Routes>
              <Route path="/" element={<ErrorBoundary name="Dashboard"><Index /></ErrorBoundary>} />
              <Route path="/employees" element={<ErrorBoundary name="EmployeesPage"><EmployeesPage /></ErrorBoundary>} />
              <Route path="/projects" element={<ErrorBoundary name="ProjectsPageWrapper"><ProjectsPageWrapper /></ErrorBoundary>} />
              
              {/* Analytics routes */}
              <Route path="/analytics" element={<Navigate to="/analytics/occupancy" replace />} />
              <Route
                path="/analytics/occupancy"
                element={<ErrorBoundary name="OccupancyAnalytics"><OccupancyAnalytics /></ErrorBoundary>}
              />
              <Route
                path="/analytics/projects"
                element={<ErrorBoundary name="ProjectsAnalytics"><ProjectsAnalytics /></ErrorBoundary>}
              />
              <Route
                path="/analytics/sales"
                element={<ErrorBoundary name="SalesAnalysis"><SalesAnalysis /></ErrorBoundary>}
              />
              <Route
                path="/analytics/sales-performance"
                element={<ErrorBoundary name="SalesPerformance"><SalesPerformance /></ErrorBoundary>}
              />
              <Route path="/import" element={<ErrorBoundary name="ImportPage"><ImportPage /></ErrorBoundary>} />
              <Route path="/settings" element={<ErrorBoundary name="SettingsPage"><SettingsPage /></ErrorBoundary>} />
              <Route path="/sales" element={<ErrorBoundary name="SalesPage"><SalesPageWrapper /></ErrorBoundary>} />
              <Route path="/ai-analyze" element={<ErrorBoundary name="AIAnalyzePage"><AIAnalyzePage /></ErrorBoundary>} />
              <Route 
                path="/auth/google/callback"
                element={<ErrorBoundary name="GoogleCallback">
                  <GoogleCallback />
                </ErrorBoundary>} 
              />
              <Route path="*" element={<ErrorBoundary name="NotFound"><NotFound /></ErrorBoundary>} />
            </Routes>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <LanguageProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AppContent />
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
