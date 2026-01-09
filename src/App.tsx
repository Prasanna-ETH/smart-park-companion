import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Owner Pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import CameraSetup from "./pages/owner/CameraSetup";
import ParkingData from "./pages/owner/ParkingData";
import Payments from "./pages/owner/Payments";
import Logs from "./pages/owner/Logs";
import Analytics from "./pages/owner/Analytics";

// User Pages
import UserHome from "./pages/user/UserHome";
import NearbyParks from "./pages/user/NearbyParks";
import Bookings from "./pages/user/Bookings";
import Profile from "./pages/user/Profile";
import BookParking from "./pages/user/BookParking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Owner Routes */}
              <Route path="/owner" element={<DashboardLayout />}>
                <Route index element={<OwnerDashboard />} />
                <Route path="camera" element={<CameraSetup />} />
                <Route path="data" element={<ParkingData />} />
                <Route path="payments" element={<Payments />} />
                <Route path="logs" element={<Logs />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>

              {/* User Routes */}
              <Route path="/user" element={<DashboardLayout />}>
                <Route index element={<UserHome />} />
                <Route path="nearby" element={<NearbyParks />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="book/:parkId" element={<BookParking />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
