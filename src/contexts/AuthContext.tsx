import { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Export the context with proper typing
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // In a real app, you would make an API call here
    // This is a mock implementation
    const mockUser = { email, id: "mock-user-id" };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signUp = async (email: string, password: string) => {
    // In a real app, you would make an API call here
    // This is a mock implementation
    const mockUser = { email, id: "mock-user-id" };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signOut = async () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
} 