import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FilterSidebar = ({ onFiltersChange, initialFilters = {}, className }) => {
  const [filters, setFilters] = useState({
    status: initialFilters.status || [],
    priority: initialFilters.priority || [],
    type: initialFilters.type || [],
    assignee: initialFilters.assignee || []
  });

  const [expandedSections, setExpandedSections] = useState({
    status: true,
    priority: true, 
    type: true,
    assignee: true
  });

  const statusOptions = [
    { value: "backlog", label: "Backlog", color: "slate" },
    { value: "todo", label: "To Do", color: "blue" },
    { value: "in-progress", label: "In Progress", color: "yellow" },
    { value: "review", label: "Review", color: "purple" },
    { value: "done", label: "Done", color: "green" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "slate" },
    { value: "medium", label: "Medium", color: "yellow" },
    { value: "high", label: "High", color: "orange" },
    { value: "critical", label: "Critical", color: "red" }
  ];

  const typeOptions = [
    { value: "bug", label: "Bug", icon: "Bug", color: "red" },
    { value: "feature", label: "Feature", icon: "Sparkles", color: "blue" },
    { value: "task", label: "Task", icon: "CheckCircle", color: "green" }
  ];

  const assigneeOptions = [
    "Sarah Chen",
    "Alex Rivera", 
    "David Kim",
    "Carlos Rodriguez",
    "Jessica Wong",
    "Tom Anderson",
    "Kevin Zhang",
    "Nina Patel",
    "Sophie Martin",
    "Ryan Murphy",
    "Anna Thompson",
    "Michael Brown"
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (category, value) => {
    const newFilters = { ...filters };
    
    if (newFilters[category].includes(value)) {
      newFilters[category] = newFilters[category].filter(item => item !== value);
    } else {
      newFilters[category] = [...newFilters[category], value];
    }
    
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      status: [],
      priority: [],
      type: [],
      assignee: []
    };
    setFilters(emptyFilters);
    onFiltersChange?.(emptyFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  const FilterSection = ({ title, options, category, showIcons = false }) => (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={() => toggleSection(category)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors duration-200"
      >
        <span className="font-medium text-slate-700">{title}</span>
        <motion.div
          animate={{ rotate: expandedSections[category] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" size={16} className="text-slate-500" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {expandedSections[category] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {options.map((option) => {
                const value = typeof option === "string" ? option : option.value;
                const label = typeof option === "string" ? option : option.label;
                const isSelected = filters[category].includes(value);
                
                return (
                  <motion.label
                    key={value}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleFilterChange(category, value)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    
                    {showIcons && option.icon && (
                      <ApperIcon 
                        name={option.icon} 
                        size={14} 
                        className={cn(
                          option.color === "red" && "text-red-600",
                          option.color === "blue" && "text-blue-600", 
                          option.color === "green" && "text-green-600"
                        )}
                      />
                    )}
                    
                    <span className={cn(
                      "text-sm transition-colors duration-200",
                      isSelected ? "text-slate-900 font-medium" : "text-slate-600"
                    )}>
                      {label}
                    </span>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-blue-600 rounded-full ml-auto"
                      />
                    )}
                  </motion.label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={cn("bg-white border-r border-slate-200 h-full", className)}>
      <div className="sticky top-0 bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ApperIcon name="Filter" size={20} />
            Filters
          </h2>
          
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-slate-500 hover:text-slate-700"
            >
              Clear all
            </Button>
          )}
        </div>
        
        {getActiveFilterCount() > 0 && (
          <div className="mt-2 text-sm text-blue-600">
            {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? "s" : ""} active
          </div>
        )}
      </div>

      <div className="overflow-y-auto">
        <FilterSection 
          title="Status" 
          options={statusOptions} 
          category="status" 
        />
        <FilterSection 
          title="Priority" 
          options={priorityOptions} 
          category="priority" 
        />
        <FilterSection 
          title="Type" 
          options={typeOptions} 
          category="type" 
          showIcons 
        />
        <FilterSection 
          title="Assignee" 
          options={assigneeOptions} 
          category="assignee" 
        />
      </div>
    </div>
  );
};

export default FilterSidebar;