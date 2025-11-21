import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleIssueCreated = () => {
    // Trigger a refresh of child components
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onIssueCreated={handleIssueCreated} />
      <main className="flex-1">
        <div key={refreshKey}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;