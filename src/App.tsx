import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          window.location.href = '/';
          return;
        }

        if (session) {
          // Force a refresh of the auth state
          await supabase.auth.refreshSession();
          window.location.href = '/';
        } else {
          // If no session, try to get the session from the URL
          const { data: { session: urlSession }, error: urlError } = await supabase.auth.getSession();
          if (urlError) {
            console.error('Error getting URL session:', urlError);
            window.location.href = '/';
            return;
          }
          if (urlSession) {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        window.location.href = '/';
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Completing sign in...</p>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-white min-h-screen">
            <div className="max-w-[1440px] mx-auto">
              <Toaster />
              <Sonner />
              <Router>
                <Navbar />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/features" element={<Navigate to="/#features" replace />} />
                    <Route path="/benefits" element={<Navigate to="/#benefits" replace />} />
                    <Route path="/testimonials" element={<Navigate to="/#testimonials" replace />} />
                    <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route
                      path="/assessment"
                      element={
                        <ProtectedRoute>
                          <Assessment />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </Router>
            </div>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
