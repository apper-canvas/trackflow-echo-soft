import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Loading from "@/components/ui/Loading";

// Create AuthContext
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContext.Provider');
  }
  return context;
};

function Root() {
  const [authInitialized, setAuthInitialized] = useState(false);

  const logout = async () => {
    // Handle logout logic here
    console.log('Logout functionality not implemented');
  };

  useEffect(() => {
    // Initialize authentication state
    // In a real app, this would check for existing tokens, validate sessions, etc.
    setAuthInitialized(true);
  }, []);

  if (!authInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

return (
    <AuthContext.Provider value={{ logout, isInitialized: authInitialized }}>
      <Outlet />
    </AuthContext.Provider>
  );
}

export default Root;