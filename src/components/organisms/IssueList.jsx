import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import IssueModal from "@/components/molecules/IssueModal";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import issueService from "@/services/api/issueService";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const IssueList = ({ filters = {} }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedIssues, setSelectedIssues] = useState(new Set());

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");
      
      let allIssues;
      if (Object.keys(filters).some(key => filters[key]?.length > 0)) {
        allIssues = await issueService.getByFilters(filters);
      } else {
        allIssues = await issueService.getAll();
      }
      
      setIssues(allIssues);
    } catch (err) {
      setError(err.message || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [filters]);

  const sortedIssues = [...issues].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Handle priority sorting with custom order
    if (sortBy === "priority") {
      const priorityOrder = { "low": 1, "medium": 2, "high": 3, "critical": 4 };
      aValue = priorityOrder[aValue] || 0;
      bValue = priorityOrder[bValue] || 0;
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setShowIssueModal(true);
  };

  const handleIssueUpdate = (updatedIssue) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.Id === updatedIssue.Id ? updatedIssue : issue
      )
    );
    setSelectedIssue(updatedIssue);
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await issueService.updateStatus(issueId, newStatus);
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.Id === issueId 
            ? { ...issue, status: newStatus, updatedAt: new Date().toISOString() }
            : issue
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (issueId, newPriority) => {
    try {
      await issueService.updatePriority(issueId, newPriority);
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.Id === issueId 
            ? { ...issue, priority: newPriority, updatedAt: new Date().toISOString() }
            : issue
        )
      );
      toast.success("Priority updated successfully");
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const toggleIssueSelection = (issueId) => {
    setSelectedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(issueId)) {
        newSet.delete(issueId);
      } else {
        newSet.add(issueId);
      }
      return newSet;
    });
  };

  const selectAllIssues = () => {
    if (selectedIssues.size === sortedIssues.length) {
      setSelectedIssues(new Set());
    } else {
      setSelectedIssues(new Set(sortedIssues.map(issue => issue.Id)));
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "bug": return "Bug";
      case "feature": return "Sparkles";
      case "task": return "CheckCircle";
      default: return "Circle";
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadIssues} />;

  if (issues.length === 0) {
    return (
      <Empty
        title="No issues found"
        description="Create your first issue to get started with tracking bugs, features, and tasks."
        actionLabel="Create Issue"
        onAction={() => {
          setSelectedIssue(null);
          setShowIssueModal(true);
        }}
        icon="List"
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header with sorting and bulk actions */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Issues ({sortedIssues.length})
            </h2>
            
            {selectedIssues.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-600 font-medium">
                  {selectedIssues.size} selected
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedIssues(new Set())}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm"
            >
              <option value="updatedAt">Updated</option>
              <option value="createdAt">Created</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </Select>
            
            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
            >
              <ApperIcon 
                name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
                size={16} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm font-medium text-slate-600 border-b border-slate-100">
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            checked={selectedIssues.size === sortedIssues.length && sortedIssues.length > 0}
            onChange={selectAllIssues}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-1">Type</div>
        <div className="col-span-4">Title</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-2">Assignee</div>
        <div className="col-span-1">Updated</div>
      </div>

      {/* Issue Rows */}
      <div className="divide-y divide-slate-100">
        <AnimatePresence mode="popLayout">
          {sortedIssues.map((issue, index) => (
            <motion.div
              key={issue.Id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.02 }}
              className={cn(
                "group hover:bg-slate-50 transition-colors duration-200",
                selectedIssues.has(issue.Id) && "bg-blue-50"
              )}
            >
              {/* Desktop Row */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedIssues.has(issue.Id)}
                    onChange={() => toggleIssueSelection(issue.Id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                <div className="col-span-1">
                  <ApperIcon 
                    name={getTypeIcon(issue.type)} 
                    size={16}
                    className={cn(
                      issue.type === "bug" && "text-red-600",
                      issue.type === "feature" && "text-blue-600",
                      issue.type === "task" && "text-green-600"
                    )}
                  />
                </div>
                
                <div 
                  className="col-span-4 cursor-pointer"
                  onClick={() => handleIssueClick(issue)}
                >
                  <div className="font-medium text-slate-900 hover:text-blue-600 transition-colors duration-200">
                    #{issue.Id} {issue.title}
                  </div>
                  {issue.labels && issue.labels.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {issue.labels.slice(0, 2).map((label, index) => (
                        <Badge key={index} variant="default" size="xs">
                          {label}
                        </Badge>
                      ))}
                      {issue.labels.length > 2 && (
                        <Badge variant="default" size="xs">
                          +{issue.labels.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="col-span-2">
                  <Select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.Id, e.target.value)}
                    className="text-xs border-none bg-transparent focus:ring-1"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </Select>
                </div>
                
                <div className="col-span-1">
                  <Select
                    value={issue.priority}
                    onChange={(e) => handlePriorityChange(issue.Id, e.target.value)}
                    className="text-xs border-none bg-transparent focus:ring-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  {issue.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar fallback={issue.assignee} size="xs" />
                      <span className="text-sm text-slate-700 truncate">
                        {issue.assignee}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">Unassigned</span>
                  )}
                </div>
                
                <div className="col-span-1 text-xs text-slate-500">
                  {format(new Date(issue.updatedAt), "MMM d")}
                </div>
              </div>

              {/* Mobile Row */}
              <div 
                className="md:hidden p-4 cursor-pointer"
                onClick={() => handleIssueClick(issue)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedIssues.has(issue.Id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleIssueSelection(issue.Id);
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <ApperIcon 
                        name={getTypeIcon(issue.type)} 
                        size={14}
                        className={cn(
                          issue.type === "bug" && "text-red-600",
                          issue.type === "feature" && "text-blue-600",
                          issue.type === "task" && "text-green-600"
                        )}
                      />
                      <span className="text-xs font-medium text-slate-500">
                        #{issue.Id}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-slate-900 mb-2">
                      {issue.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant={issue.status} size="xs">
                        {issue.status.replace("-", " ")}
                      </Badge>
                      <Badge variant={issue.priority} size="xs">
                        {issue.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        {issue.assignee ? (
                          <>
                            <Avatar fallback={issue.assignee} size="xs" />
                            <span>{issue.assignee}</span>
                          </>
                        ) : (
                          <span>Unassigned</span>
                        )}
                      </div>
                      <div>
                        {format(new Date(issue.updatedAt), "MMM d")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Issue Modal */}
      <IssueModal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        issue={selectedIssue}
        onUpdate={handleIssueUpdate}
        mode={selectedIssue ? "view" : "create"}
      />
    </div>
  );
};

export default IssueList;