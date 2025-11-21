import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title = "No issues found", description, actionLabel, onAction, icon = "FileText" }) => {
  return (
    <div className="flex items-center justify-center min-h-96 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name={icon} size={48} className="text-slate-400" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-slate-700 mb-3"
        >
          {title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 mb-8 leading-relaxed"
        >
          {description || "Get started by creating your first issue to track bugs, features, and tasks."}
        </motion.p>

        {actionLabel && onAction && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <ApperIcon name="Plus" size={18} />
              {actionLabel}
            </span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Empty;