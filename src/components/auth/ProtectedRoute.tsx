import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuthDialog(true);
    }
  }, [isLoading, user]);

  if (isLoading) {
    // You could show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <Navigate to="/" replace state={{ from: location }} />
        <AuthDialog
          isOpen={showAuthDialog}
          onClose={() => {
            setShowAuthDialog(false);
          }}
        />
      </>
    );
  }

  return <>{children}</>;
} 