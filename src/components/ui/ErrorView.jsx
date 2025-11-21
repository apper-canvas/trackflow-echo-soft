import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="AlertTriangle" size={40} className="text-red-600" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-slate-800 mb-3"
        >
          Something went wrong
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 mb-6 leading-relaxed"
        >
          {error || "We encountered an error while loading your issues. Please try again or contact support if the problem persists."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <ApperIcon name="RotateCcw" size={18} />
              Try Again
            </span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            Refresh Page
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorView;