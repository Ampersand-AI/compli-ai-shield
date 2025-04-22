import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";

export const Hero = () => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  const handleAssessmentClick = () => {
    if (user) {
      navigate("/assessment");
    } else {
      setShowAuthDialog(true);
    }
  };

  return (
    <div className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/adf712c1-1833-455b-9c00-599fdf91c4b4.png')] bg-no-repeat bg-cover opacity-10"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Turn Compliance from Chaos to{' '}
            <span className="text-gray-900 dark:text-gray-100">Confidence</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            AI-powered compliance automation that helps businesses reduce risk,
            cut costs, and stay ahead of regulatory changes. No more manual tracking
            or costly consultants.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              size="lg" 
              className="group bg-gray-900 hover:bg-gray-800 text-white"
              onClick={handleAssessmentClick}
            >
              Start Free Assessment
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </div>
  );
};
