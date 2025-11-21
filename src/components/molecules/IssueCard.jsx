import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import { format } from "date-fns";

const IssueCard = ({ 
  issue, 
  onClick, 
  isDragging = false,
  className,
  ...props 
}) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "bug": return "Bug";
      case "feature": return "Sparkles";
      case "task": return "CheckCircle";
      default: return "Circle";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "text-red-600";
      case "high": return "text-orange-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-slate-500";
      default: return "text-slate-500";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className={cn(
        "bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-200",
        isDragging && "rotate-3 shadow-lg scale-105",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon 
name={getTypeIcon(issue.type)} 
              size={16} 
              className={cn("shrink-0", {
                "text-red-600": issue.type === "bug",
                "text-blue-600": issue.type === "feature", 
                "text-green-600": issue.type === "task"
              })}
            />
            <span className="text-xs font-medium text-slate-500">
              #{issue.Id}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon 
              name="Flag" 
              size={14} 
              className={getPriorityColor(issue.priority)}
            />
          </div>
        </div>

        {/* Title */}
<h3 className="text-sm font-medium text-slate-900 line-clamp-2 leading-5">
          {issue.title}
        </h3>

        {/* Description */}
        {issue.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-4">
            {issue.description}
          </p>
        )}

        {/* Labels */}
        {issue.labels && issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Badge variant={issue.status} size="xs">
              {issue.status.replace("-", " ")}
            </Badge>
            <Badge variant={issue.priority} size="xs">
              {issue.priority}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {issue.comments && issue.comments.length > 0 && (
              <div className="flex items-center gap-1 text-slate-500">
                <ApperIcon name="MessageCircle" size={12} />
                <span className="text-xs">{issue.comments.length}</span>
              </div>
            )}
            {issue.assignee && (
              <Avatar 
                fallback={issue.assignee} 
                size="xs"
                className="ml-1"
              />
            )}
          </div>
        </div>

        {/* Updated time */}
        <div className="text-xs text-slate-400">
          Updated {format(new Date(issue.updatedAt), "MMM d")}
        </div>
      </div>
    </motion.div>
  );
};

export default IssueCard;