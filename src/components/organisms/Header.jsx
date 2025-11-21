import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import IssueModal from "@/components/molecules/IssueModal";

const Header = ({ onIssueCreated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/list", label: "List View", icon: "List" },
    { path: "/board", label: "Board View", icon: "Trello" },
    { path: "/search", label: "Search", icon: "Search" }
  ];

  const isActivePath = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleIssueCreated = (newIssue) => {
    onIssueCreated?.(newIssue);
    setShowCreateModal(false);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 bg-white border-b border-slate-200 z-40"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={18} className="text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-slate-900">TrackFlow</h1>
                  <p className="text-xs text-slate-500 -mt-1">Issue Tracking</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePath(item.path)
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <ApperIcon name={item.icon} size={16} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              {/* Desktop Search */}
              <div className="hidden lg:block w-80">
                <SearchBar placeholder="Search issues..." />
              </div>

              {/* Create Issue Button */}
              <Button
                onClick={() => setShowCreateModal(true)}
                size="sm"
                className="hidden sm:flex"
              >
                <ApperIcon name="Plus" size={16} />
                New Issue
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <SearchBar placeholder="Search issues..." />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <nav className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(item.path)
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </button>
              ))}
              
              <div className="pt-2 border-t border-slate-200">
                <Button
                  onClick={() => {
                    setShowCreateModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <ApperIcon name="Plus" size={16} />
                  New Issue
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Create Issue Modal */}
      <IssueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUpdate={handleIssueCreated}
        mode="create"
      />

      {/* Mobile FAB for Create Issue */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-30 transition-all duration-200"
      >
        <ApperIcon name="Plus" size={24} />
      </motion.button>
    </>
  );
};

export default Header;