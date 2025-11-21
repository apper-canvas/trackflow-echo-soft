import { useState } from "react";
import { motion } from "framer-motion";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import IssueList from "@/components/organisms/IssueList";
import ApperIcon from "@/components/ApperIcon";

const ListView = () => {
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    type: [],
    assignee: []
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="flex h-screen">
        {/* Mobile Filter Overlay */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-80 h-full bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <FilterSidebar
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-80 h-full">
          <FilterSidebar
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="Filter" size={16} />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Issues</h1>
                  <p className="text-sm text-slate-600 mt-1">
                    Manage and track all your issues in one place
                  </p>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ApperIcon name="Filter" size={14} />
                  <span>Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      {getActiveFilterCount()} active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Issue List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 overflow-y-auto p-6"
          >
            <IssueList filters={filters} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ListView;