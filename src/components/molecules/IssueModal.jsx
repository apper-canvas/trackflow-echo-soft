import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import issueService from "@/services/api/issueService";
import { format } from "date-fns";

const IssueModal = ({ isOpen, onClose, issue, onUpdate, mode = "view" }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(mode === "create");
  const [loading, setLoading] = useState(false);
  
const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    type: "task",
    priority: "medium",
    status: "backlog",
    assignee: "",
    labels: [],
createdAt: ""
  });

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
if (issue && mode !== "create") {
setFormData({
        name: issue.name || "",
        title: issue.title || "",
        description: issue.description || "",
        type: issue.type || "task",
        priority: issue.priority || "medium", 
        status: issue.status || "backlog",
        assignee: issue.assignee || "",
        labels: issue.labels || [],
createdAt: issue.createdAt || ""
      });
    } else {
setFormData({
        name: "",
        title: "",
        description: "",
        type: "task", 
        priority: "medium",
        status: "backlog",
        assignee: "",
        labels: [],
        CreatedOn: ""
      });
    }
  }, [issue, mode, isOpen]);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!formData.title.trim()) {
        toast.error("Title is required");
        return;
      }

      let updatedIssue;
      if (mode === "create") {
        updatedIssue = await issueService.create(formData);
        toast.success("Issue created successfully");
      } else {
        updatedIssue = await issueService.update(issue.Id, formData);
        toast.success("Issue updated successfully");
      }
      
      onUpdate?.(updatedIssue);
      
      if (mode === "create") {
        onClose();
      } else {
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to save issue");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !issue) return;
    
    try {
      setLoading(true);
      await issueService.addComment(issue.Id, {
        content: newComment.trim(),
        author: "Current User"
      });
      
      // Refresh issue data
      const updatedIssue = await issueService.getById(issue.Id);
      onUpdate?.(updatedIssue);
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              {issue && (
                <>
                  <ApperIcon 
                    name={getTypeIcon(issue.type)} 
                    size={20}
                    className={
                      issue.type === "bug" ? "text-red-600" :
                      issue.type === "feature" ? "text-blue-600" :
                      "text-green-600"
                    }
                  />
                  <span className="text-sm font-medium text-slate-500">
                    #{issue.Id}
                  </span>
                </>
              )}
              <h2 className="text-xl font-semibold text-slate-900">
                {mode === "create" ? "Create New Issue" : issue?.title}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing && mode !== "create" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <ApperIcon name="Edit" size={16} />
                  Edit
                </Button>
              )}
              
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                activeTab === "details" 
                  ? "text-blue-600 border-blue-600" 
                  : "text-slate-500 border-transparent hover:text-slate-700"
              }`}
            >
              Details
            </button>
            {mode !== "create" && issue && (
              <button
                onClick={() => setActiveTab("activity")}
                className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === "activity" 
                    ? "text-blue-600 border-blue-600" 
                    : "text-slate-500 border-transparent hover:text-slate-700"
                }`}
              >
                Activity {issue.comments?.length > 0 && `(${issue.comments.length})`}
              </button>
            )}
          </div>

{/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[32rem]">
            {activeTab === "details" && (
              <div className="p-6 space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter issue name..."
                        className="w-full"
                      />
                    ) : (
                      <div className="text-lg font-medium text-slate-900">
                        {issue?.name}
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter issue title..."
                        className="w-full"
                      />
                    ) : (
                      <div className="text-lg font-medium text-slate-900">
                        {issue?.title}
                      </div>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type
                    </label>
                    {isEditing ? (
                      <Select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="bug">Bug</option>
                        <option value="feature">Feature</option>
                        <option value="task">Task</option>
                      </Select>
                    ) : (
                      <Badge variant={issue?.type}>
                        {issue?.type}
                      </Badge>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priority
                    </label>
                    {isEditing ? (
                      <Select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </Select>
                    ) : (
                      <Badge variant={issue?.priority}>
                        {issue?.priority}
                      </Badge>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status
                    </label>
                    {isEditing ? (
                      <Select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="backlog">Backlog</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </Select>
                    ) : (
                      <Badge variant={issue?.status}>
                        {issue?.status?.replace("-", " ")}
                      </Badge>
                    )}
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Assignee
                    </label>
                    {isEditing ? (
                      <Select
                        value={formData.assignee}
                        onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                      >
                        <option value="">Unassigned</option>
                        <option value="Sarah Chen">Sarah Chen</option>
                        <option value="Alex Rivera">Alex Rivera</option>
                        <option value="David Kim">David Kim</option>
                        <option value="Carlos Rodriguez">Carlos Rodriguez</option>
                        <option value="Jessica Wong">Jessica Wong</option>
                        <option value="Tom Anderson">Tom Anderson</option>
                        <option value="Kevin Zhang">Kevin Zhang</option>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        {issue?.assignee ? (
                          <>
                            <Avatar fallback={issue.assignee} size="sm" />
                            <span className="text-sm text-slate-700">{issue.assignee}</span>
                          </>
                        ) : (
                          <span className="text-sm text-slate-500">Unassigned</span>
                        )}
                      </div>
)}
                  </div>

                  {/* Created On */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Created On
                    </label>
                    <div className="text-sm text-slate-600">
{issue?.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Not available'}
                    </div>
                  </div>
</div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter issue description..."
                      rows={6}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4 min-h-24">
                      {issue?.description || "No description provided"}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.labels?.join(', ') || ''}
                      onChange={(e) => {
                        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                        setFormData(prev => ({ ...prev, labels: tagsArray }));
                      }}
                      placeholder="Enter tags separated by commas (e.g., frontend, urgent, bug)"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {issue?.labels && issue.labels.length > 0 ? (
                        issue.labels.map((label, index) => (
                          <Badge key={index} variant="default" size="xs">
                            {label}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No tags assigned</span>
                      )}
                    </div>
                  )}
</div>

                {/* Meta info */}
                {!isEditing && issue && (
                  <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                    <div>Created {format(new Date(issue.createdAt), "MMM d, yyyy 'at' h:mm a")} by {issue.reporter}</div>
                    <div>Updated {format(new Date(issue.updatedAt), "MMM d, yyyy 'at' h:mm a")}</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && issue && (
              <div className="p-6">
                {/* Add comment */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <Avatar fallback="You" size="sm" />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || loading}
                          size="sm"
                        >
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-4">
                  {issue.comments && issue.comments.length > 0 ? (
                    issue.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                        <Avatar fallback={comment.author} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-900">
                              {comment.author}
                            </span>
                            <span className="text-xs text-slate-500">
                              {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
{isEditing && (
            <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 z-10">
              <Button
                variant="secondary"
                onClick={() => {
                  if (mode === "create") {
                    onClose();
                  } else {
                    setIsEditing(false);
                    // Reset form data to original issue values
setFormData({
                      name: issue?.name || "",
                      title: issue?.title || "",
                      description: issue?.description || "",
                      type: issue?.type || "task",
                      priority: issue?.priority || "medium",
                      status: issue?.status || "backlog",
                      assignee: issue?.assignee || "",
labels: issue?.labels || [],
                      createdAt: issue?.createdAt || ""
                    });
                  }
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                ) : (
                  <ApperIcon name="Save" size={16} className="mr-2" />
                )}
                {mode === "create" ? "Create Issue" : "Save Changes"}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IssueModal;