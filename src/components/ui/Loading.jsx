import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center space-y-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative mx-auto"
        >
          <div className="h-16 w-16 border-4 border-slate-200 rounded-full"></div>
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full absolute top-0 left-0"></div>
        </motion.div>
        
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-slate-700"
          >
            Loading TrackFlow
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-slate-500"
          >
            Setting up your issue tracking workspace...
          </motion.div>
        </div>

        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
              className="h-2 bg-gradient-to-r from-primary to-blue-400 rounded-full"
              style={{ width: `${60 + i * 20}%`, margin: "0 auto" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;