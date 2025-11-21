import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import IssueCard from "@/components/molecules/IssueCard";
import IssueModal from "@/components/molecules/IssueModal";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import issueService from "@/services/api/issueService";
import { format, isToday, isYesterday } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");
      
      const allIssues = await issueService.getAll();
      setIssues(allIssues);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

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

  // Calculate dashboard metrics
  const totalIssues = issues.length;
  const openIssues = issues.filter(issue => issue.status !== "done").length;
  const criticalIssues = issues.filter(issue => issue.priority === "critical").length;
  const recentIssues = issues
    .filter(issue => {
      const updatedDate = new Date(issue.updatedAt);
      const today = new Date();
      const daysDiff = Math.floor((today - updatedDate) / (1000 * 60 * 60 * 24));
      return daysDiff <= 3;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);
  
  const highPriorityIssues = issues
    .filter(issue => issue.priority === "high" || issue.priority === "critical")
    .filter(issue => issue.status !== "done")
    .slice(0, 4);

  const statusDistribution = {
    backlog: issues.filter(i => i.status === "backlog").length,
    todo: issues.filter(i => i.status === "todo").length,
    "in-progress": issues.filter(i => i.status === "in-progress").length,
    review: issues.filter(i => i.status === "review").length,
    done: issues.filter(i => i.status === "done").length
  };

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadIssues} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-slate-600">
                Here's what's happening with your issues today.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/list")}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <ApperIcon name="List" size={16} />
                View All Issues
              </Button>
              <Button
                onClick={() => {
                  setSelectedIssue(null);
                  setShowIssueModal(true);
                }}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" size={16} />
                New Issue
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Issues",
              value: totalIssues,
              icon: "FileText",
              color: "blue",
              bgGradient: "from-blue-500 to-blue-600"
            },
            {
              title: "Open Issues", 
              value: openIssues,
              icon: "AlertCircle",
              color: "orange",
              bgGradient: "from-orange-500 to-orange-600"
            },
            {
              title: "Critical Priority",
              value: criticalIssues,
              icon: "AlertTriangle", 
              color: "red",
              bgGradient: "from-red-500 to-red-600"
            },
            {
              title: "Completed",
              value: statusDistribution.done,
              icon: "CheckCircle",
              color: "green", 
              bgGradient: "from-green-500 to-green-600"
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {metric.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${metric.bgGradient} rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={metric.icon} size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Issues */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <ApperIcon name="Clock" size={20} />
                  Recent Activity
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/list")}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View all
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentIssues.map((issue, index) => (
                  <motion.div
                    key={issue.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <IssueCard
                      issue={issue}
                      onClick={() => handleIssueClick(issue)}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </div>
              
              {recentIssues.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <ApperIcon name="Clock" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="BarChart3" size={18} />
                Status Overview
              </h3>
              
              <div className="space-y-3">
                {Object.entries(statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={status} size="xs">
                        {status.replace("-", " ")}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <Button
                  onClick={() => navigate("/board")}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  View Board
                  <ApperIcon name="ArrowRight" size={14} className="ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* High Priority Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Flag" size={18} className="text-red-600" />
                High Priority
              </h3>
              
              <div className="space-y-3">
                {highPriorityIssues.map((issue) => (
                  <motion.div
                    key={issue.Id}
                    whileHover={{ x: 4 }}
                    className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors duration-200"
                    onClick={() => handleIssueClick(issue)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={issue.priority} size="xs">
                            {issue.priority}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            #{issue.Id}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {issue.title}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant={issue.status} size="xs">
                            {issue.status.replace("-", " ")}
                          </Badge>
                          {issue.assignee && (
                            <Avatar fallback={issue.assignee} size="xs" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {highPriorityIssues.length === 0 && (
                <div className="text-center py-4 text-slate-500">
                  <ApperIcon name="CheckCircle" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No high priority issues!</p>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Zap" size={18} />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSelectedIssue(null);
                    setShowIssueModal(true);
                  }}
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Create Issue
                </Button>
                
                <Button
                  onClick={() => navigate("/list")}
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                >
                  <ApperIcon name="List" size={16} className="mr-2" />
                  View All Issues
                </Button>
                
                <Button
                  onClick={() => navigate("/board")}
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                >
                  <ApperIcon name="Trello" size={16} className="mr-2" />
                  Kanban Board
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
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

export default Dashboard;