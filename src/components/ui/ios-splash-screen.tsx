import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IOSSplashScreenProps {
  onComplete?: () => void;
}

export const IOSSplashScreen = ({ onComplete }: IOSSplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -10,
        scale: isVisible ? 1 : 0.98
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (!isVisible && onComplete) onComplete();
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black 
        ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: isVisible ? 1 : 1.1, 
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -20
        }}
        transition={{ 
          duration: 0.7, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1
        }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 flex items-center justify-center overflow-hidden ios-shadow">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut", 
              delay: 0.3
            }}
            className="text-4xl"
          >
            💡
          </motion.div>
        </div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white text-2xl font-semibold tracking-tight"
          style={{ 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            fontWeight: 600,
            letterSpacing: '-0.02em'
          }}
        >
          IDEA FACTORY
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-gray-400 mt-2 text-sm"
          style={{ 
            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          }}
        >
          by Prakhar Vardhan
        </motion.p>
      </motion.div>
      
      {/* iOS-style loading indicator */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isVisible ? 0.8 : 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-16"
      >
        <div className="w-8 h-8 relative">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1,
              ease: "linear"
            }}
            className="absolute inset-0 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}; 