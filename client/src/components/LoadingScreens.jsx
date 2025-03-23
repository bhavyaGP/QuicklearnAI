import { motion } from 'framer-motion';
import { FileText, Upload, Settings } from 'lucide-react';

export const UploadLoadingScreen = () => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div 
        className="flex items-center justify-center mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="relative">
          <motion.div 
            className="w-20 h-20 rounded-full bg-[#00FF9D]/10 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Upload className="w-10 h-10 text-[#00FF9D]" />
          </motion.div>
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-[#00FF9D]/30"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2">
          Uploading Your <span className="text-[#00FF9D]">Question Set</span>
        </h2>
        <p className="text-gray-400">Processing your file...</p>
      </motion.div>
    </div>
  </div>
);

export const GeneratingLoadingScreen = () => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div 
        className="flex items-center justify-center mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="relative">
          <motion.div 
            className="w-24 h-32 bg-[#00FF9D]/10 rounded-lg flex items-center justify-center"
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Settings className="w-12 h-12 text-[#00FF9D]" />
          </motion.div>
          <motion.div 
            className="absolute -right-4 -top-4 w-24 h-32 bg-[#00FF9D]/5 rounded-lg"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -left-4 -bottom-4 w-24 h-32 bg-[#00FF9D]/5 rounded-lg"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2">
          Generating Your <span className="text-[#00FF9D]">Question Papers</span>
        </h2>
        <p className="text-gray-400">Creating unique combinations...</p>
      </motion.div>
    </div>
  </div>
);

export const DownloadLoadingScreen = () => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div 
        className="flex items-center justify-center mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="relative">
          <motion.div 
            className="w-20 h-20 rounded-full bg-[#00FF9D]/10 flex items-center justify-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FileText className="w-10 h-10 text-[#00FF9D]" />
          </motion.div>
          <motion.div 
            className="absolute bottom-0 w-16 h-1 bg-[#00FF9D]/20 rounded-full mx-auto left-0 right-0"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2">
          Preparing Your <span className="text-[#00FF9D]">Download</span>
        </h2>
        <p className="text-gray-400">Getting your files ready...</p>
      </motion.div>
    </div>
  </div>
); 