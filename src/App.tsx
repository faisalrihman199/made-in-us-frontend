import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CarDetails from "./pages/CarDetails";
import About from "./pages/About";
import Blog from "./pages/Blog";
import SecurePay from "./pages/SecurePay";
import PaymentOptions from "./pages/PaymentOptions";
import VehicleArrival from "./pages/VehicleArrival";
import Membership from "./pages/Membership";
import Cookies from "./pages/Cookies";
import VehicleInspection from "./pages/VehicleInspection";
import ReserveVehicle from "./pages/ReserveVehicle";
import FindVehicle from "./pages/FindVehicle";
import Contact from "./pages/Contact";
import CompletePayment from "./pages/CompletePayment";
import AdminQuote from "./pages/AdminQuote";
import AdminInspection from "./pages/AdminInspection";
import AdminReservation from "./pages/AdminReservation";
import AdminFindVehicle from "./pages/AdminFindVehicle";
import AdminSubscription from "./pages/AdminSubscription";
import AdminInquiry from "./pages/AdminInquiry";
import Confirmation from "./pages/Confirmation";
import PaymentResubmit from "./pages/PaymentResubmit";
import Watchlist from "./pages/Watchlist";
import AdminDashboard from "./pages/AdminDashboard";
import BlogDetail from "./pages/BlogDetail";
import { ScrollToTop } from "./components/ScrollToTop";
import ShippingModal from "./components/car-details/ShippingModal";
import CookiesBanner from "./components/CookiesBanner";
import Chatbot from "./components/Chatbot";
import { GlobalStateProvider, useGlobalState } from "./context/GlobalStateContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const GlobalModals = () => {
  const { isShippingModalOpen, closeShippingModal, isCookiesBannerForced, closeCookiesBanner } = useGlobalState();
  
  return (
    <>
      <ShippingModal isOpen={isShippingModalOpen} onClose={closeShippingModal} />
      <CookiesBanner forceShow={isCookiesBannerForced} onClose={closeCookiesBanner} />
      <Chatbot />
    </>
  );
};
const AppContent = () => (
  <BrowserRouter>
    <ScrollToTop />
    <GlobalModals />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/cars/:id/:slug" element={<CarDetails />} />
      <Route path="/secure-pay" element={<SecurePay />} />
      <Route path="/payment-options" element={<PaymentOptions />} />
      <Route path="/vehicle-arrival" element={<VehicleArrival />} />
      <Route path="/complete-payment" element={<CompletePayment />} />
      <Route path="/membership" element={<Membership />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/vehicle-inspection" element={<VehicleInspection />} />
      <Route path="/reserve-vehicle" element={<ReserveVehicle />} />
      <Route path="/find-vehicle" element={<FindVehicle />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/shipping-quote/:id" element={<AdminQuote />} />
      <Route path="/admin/inspection/:id" element={<AdminInspection />} />
      <Route path="/admin/reservation/:id" element={<AdminReservation />} />
      <Route path="/admin/find-vehicle/:id" element={<AdminFindVehicle />} />
      <Route path="/admin/subscription/:id" element={<AdminSubscription />} />
      <Route path="/admin/inquiry/:id" element={<AdminInquiry />} />
      <Route path="/admin/:tab?/:subtab?" element={<AdminDashboard />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/resubmit-payment/:type/:id" element={<PaymentResubmit />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <GlobalStateProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </AuthProvider>
          </GlobalStateProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
