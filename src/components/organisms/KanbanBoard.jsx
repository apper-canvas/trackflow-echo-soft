import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import IssueCard from "@/components/molecules/IssueCard";
import IssueModal from "@/components/molecules/IssueModal";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import issueService from "@/services/api/issueService";
import { cn } from "@/utils/cn";

const KanbanBoard = ({ filters = {} }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [draggedIssue, setDraggedIssue] = useState(null);

  const columns = [
    { 
      id: "backlog", 
      title: "Backlog", 
      color: "slate",
      icon: "Circle"
    },
    { 
      id: "todo", 
      title: "To Do", 
      color: "blue",
      icon: "Clock"
    },
    { 
      id: "in-progress", 
      title: "In Progress", 
      color: "yellow",
      icon: "PlayCircle"
    },
    { 
      id: "review", 
      title: "Review", 
      color: "purple",
      icon: "Eye"
    },
    { 
      id: "done", 
      title: "Done", 
      color: "green",
      icon: "CheckCircle"
    }
  ];

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

  const getIssuesForColumn = (status) => {
    return issues.filter(issue => issue.status === status);
  };

  const handleDragStart = (e, issue) => {
    setDraggedIssue(issue);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedIssue || draggedIssue.status === newStatus) {
      setDraggedIssue(null);
      return;
    }

    try {
      await issueService.updateStatus(draggedIssue.Id, newStatus);
      
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.Id === draggedIssue.Id 
            ? { ...issue, status: newStatus, updatedAt: new Date().toISOString() }
            : issue
        )
      );
      
      toast.success(`Issue moved to ${newStatus.replace("-", " ")}`);
    } catch (error) {
      toast.error("Failed to update issue status");
    } finally {
      setDraggedIssue(null);
    }
  };

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
        icon="Trello"
      />
    );
  }

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-6 min-w-max p-6">
        {columns.map((column) => {
          const columnIssues = getIssuesForColumn(column.id);
          
          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-80 flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-slate-200 mb-4">
                <div className="flex items-center gap-3">
                  <ApperIcon 
                    name={column.icon} 
                    size={18} 
                    className={cn(
                      column.color === "slate" && "text-slate-600",
                      column.color === "blue" && "text-blue-600",
                      column.color === "yellow" && "text-yellow-600", 
                      column.color === "purple" && "text-purple-600",
                      column.color === "green" && "text-green-600"
                    )}
                  />
                  <h3 className="font-semibold text-slate-900">{column.title}</h3>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  column.color === "slate" && "bg-slate-100 text-slate-600",
                  column.color === "blue" && "bg-blue-100 text-blue-600",
                  column.color === "yellow" && "bg-yellow-100 text-yellow-600",
                  column.color === "purple" && "bg-purple-100 text-purple-600", 
                  column.color === "green" && "bg-green-100 text-green-600"
                )}>
                  {columnIssues.length}
                </div>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                className={cn(
                  "flex-1 min-h-96 p-4 rounded-lg border-2 border-dashed transition-all duration-200",
                  draggedIssue && draggedIssue.status !== column.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
                )}
              >
                {/* Issues */}
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {columnIssues.map((issue) => (
                      <motion.div
                        key={issue.Id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, issue)}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <IssueCard
                          issue={issue}
                          onClick={() => handleIssueClick(issue)}
                          isDragging={draggedIssue?.Id === issue.Id}
                          className="hover:shadow-lg transition-shadow duration-200"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Empty Column */}
                {columnIssues.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-slate-400">
                    <div className="text-center">
                      <ApperIcon name="Package" size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No issues</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
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

export default KanbanBoard;