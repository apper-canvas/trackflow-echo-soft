import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* 404 Animation */}
          <div className="relative mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 0.95, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl font-bold text-slate-300 mb-4"
            >
              404
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={40} className="text-red-600" />
              </div>
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-slate-900 mb-4"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 mb-8 leading-relaxed"
          >
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Button
            onClick={() => navigate("/")}
            className="w-full"
          >
            <ApperIcon name="Home" size={18} className="mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/list")}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              <ApperIcon name="List" size={16} className="mr-2" />
              View Issues
            </Button>
            
            <Button
              onClick={() => navigate("/board")}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              <ApperIcon name="Trello" size={16} className="mr-2" />
              Kanban Board
            </Button>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full blur-2xl -z-10"
        />
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full blur-2xl -z-10"
        />
      </div>
    </div>
  );
};

export default NotFound;