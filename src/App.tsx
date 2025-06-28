
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import PublicLayout from "@/components/public/PublicLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import LoginForm from "@/components/admin/LoginForm";
import SecureRoute from "@/components/security/SecureRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PortfolioProvider>
          <Routes>
            <Route path="/" element={<PublicLayout />} />
            <Route 
              path="/admin" 
              element={
                <SecureRoute fallback={<LoginForm />}>
                  <AdminLayout />
                </SecureRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PortfolioProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
