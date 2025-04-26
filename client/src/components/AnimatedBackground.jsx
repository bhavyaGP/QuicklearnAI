import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <motion.div 
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#00FF9D]/20 to-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-[#00FF9D]/20 to-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;