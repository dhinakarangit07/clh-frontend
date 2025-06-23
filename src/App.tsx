import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Advocate from "./pages/Advocates";
import Forum from "./pages/Forum";
import NotFound from "./pages/NotFound";
import DiaryDashboardLayout from "./components/dashboards/AdvocateDashboard/DigitalDiary/DashboardLayout";
import TrainingDashboardLayout from "./components/dashboards/AdvocateDashboard/TrainingProgram/DashboardLayout";
import AdvocateHandbagDashboardLayout from "./components/dashboards/AdvocateDashboard/AdvocateHandbag/DashboardLayout";
import AdvocateHandbagRequest from "./components/dashboards/AdvocateDashboard/AdvocateHandbag/HandbagRequest";
import EcourtsSearchDashboardLayout from "./components/dashboards/AdvocateDashboard/E-courtsSearch/DashboardLayout";
import CoworkingspacesDashboardLayout from "./components/dashboards/AdvocateDashboard/CoworkingSpaces/DashboardLayout";
import StarHealthInsuranceDashboardLayout from "./components/dashboards/AdvocateDashboard/StarHealthInsurance/DashboardLayout";
import AnnualAwardsDashboardLayout from "./components/dashboards/AdvocateDashboard/AnnualAwards/DashboardLayout";
import MembershipProfileDashboardLayout from "./components/dashboards/AdvocateDashboard/MembershipProfile/DashboardLayout";
import InternationalNetworkDashboardLayout from "./components/dashboards/AdvocateDashboard/InternationalNetwork/DashboardLayout";
import VirtualMentorshipDashboardLayout from "./components/dashboards/AdvocateDashboard/VirtualMentorship/DashboardLayout";
import HotelDiscountsDashboardLayout from "./components/dashboards/AdvocateDashboard/HotelDiscounts/DashboardLayout";
import DiscussionBoardDashboardLayout from "./components/dashboards/AdvocateDashboard/DiscussionBoard/DashboardLayout";
import AICaseManagementDashboardLayout from "./components/dashboards/AdvocateDashboard/AICaseManagement/DashboardLayout";
import FreeZeroBalanceAccountDashboardLayout from "./components/dashboards/AdvocateDashboard/FreeZeroBalanceAccount/DashboardLayout";
import LegalDatabaseAccessDashboardLayout from "./components/dashboards/AdvocateDashboard/LegalDatabaseAccess/DashboardLayout";
import ClientDashboardLayout from "./components/dashboards/ClientDashboard/DashboardLayout";
import AdvocateProfile from "./pages/AdvocateProfile";
import ScrollToTop from "@/components/ui/ScrollToTop";

const queryClient = new QueryClient();

const API_URL = `${import.meta.env.VITE_API_URL}`;

// Component to handle external redirect
const AdminRedirect = () => {
  window.location.href = API_URL;
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="clh-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/advocate" element={<Advocate />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/digital-diary" element={<DiaryDashboardLayout />} />
            <Route path="/training-program" element={<TrainingDashboardLayout/>} />
            <Route path="/advocate-handbag" element={<AdvocateHandbagDashboardLayout/>} />
            <Route path="/handbag-request" element={<AdvocateHandbagRequest/>} />
            <Route path="/ecourt-search" element={<EcourtsSearchDashboardLayout/>}/>
            <Route path="/coworking-spaces" element={<CoworkingspacesDashboardLayout/>}/>
            <Route path="/health-insurance" element={<StarHealthInsuranceDashboardLayout/>}/>
            <Route path="/annual-awards" element={<AnnualAwardsDashboardLayout/>}/>
            <Route path="/membership-profile" element={<MembershipProfileDashboardLayout/>}/>
            <Route path="/international-network" element={<InternationalNetworkDashboardLayout/>}/>
            <Route path="/virtual-mentorship" element={<VirtualMentorshipDashboardLayout/>}/>
            <Route path="/hotel-discount" element={<HotelDiscountsDashboardLayout/>}/>
            <Route path="/discussion-board" element={<DiscussionBoardDashboardLayout/>}/>
            <Route path="/ai-case-management" element={<AICaseManagementDashboardLayout/>}/>
            <Route path="/zero-balance-account" element={<FreeZeroBalanceAccountDashboardLayout/>}/>
            <Route path="/legal-database-access" element={<LegalDatabaseAccessDashboardLayout/>}/>
            <Route path="/client-dashboard" element={<ClientDashboardLayout/>} />
            <Route path="/advocate-profile" element={<AdvocateProfile />} />
            <Route path="/admin" element={<AdminRedirect />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
