import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
}

export const ScrollProgress = ({ className }: ScrollProgressProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();

  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Detect screen size changes
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Initial check
    handleResize();
    
    // Add resize listener
    window.addEventListener("resize", handleResize, { passive: true });
    
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setIsVisible(latest > 0.05 && latest < 0.95);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollYProgress, handleResize]);

  return (
    <motion.div
      style={{ opacity, height: isMobile ? "2px" : "3px" }}
      className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-transparent via-gray-400 to-transparent ${className}`}
    >
      <motion.div
        style={{ width }}
        className="h-full bg-gradient-to-r from-gray-600 via-gray-800 to-black shadow-lg"
      />
    </motion.div>
  );
};

export const ScrollIndicator = ({ className }: ScrollProgressProps) => {
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState(0);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Responsive section mapping based on screen size
  const getSectionMapping = useCallback(() => {
    // Mobile has different scroll points because content layout changes
    if (screenSize === 'mobile') {
      return {
        0: [0, 0.25],     // Hero
        1: [0.25, 0.55],  // Video
        2: [0.55, 1]      // Vision
      };
    } else if (screenSize === 'tablet') {
      return {
        0: [0, 0.3],     // Hero
        1: [0.3, 0.65],  // Video
        2: [0.65, 1]     // Vision
      };
    } else {
      return {
        0: [0, 0.3],     // Hero
        1: [0.3, 0.6],   // Video
        2: [0.6, 1]      // Vision
      };
    }
  }, [screenSize]);

  // Handle resize events
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) {
      setScreenSize('mobile');
    } else if (width < 1024) {
      setScreenSize('tablet');
    } else {
      setScreenSize('desktop');
    }
  }, []);

  useEffect(() => {
    // Initial check
    handleResize();
    
    // Add resize listener
    window.addEventListener("resize", handleResize, { passive: true });
    
    const sectionMapping = getSectionMapping();
    
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (latest >= sectionMapping[0][0] && latest < sectionMapping[0][1]) {
        setCurrentSection(0); // Hero
      } else if (latest >= sectionMapping[1][0] && latest < sectionMapping[1][1]) {
        setCurrentSection(1); // Video
      } else if (latest >= sectionMapping[2][0]) {
        setCurrentSection(2); // Vision
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollYProgress, handleResize, getSectionMapping]);

  const sections = ["Hero", "Video", "Vision"];
  
  // Different position and style based on screen size
  const getPosition = () => {
    if (screenSize === 'mobile') {
      return 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex flex-row space-x-3';
    } else if (screenSize === 'tablet') {
      return 'fixed right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4';
    } else {
      return 'fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: screenSize === 'mobile' ? 0 : 20, y: screenSize === 'mobile' ? 20 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={`${getPosition()} ${className}`}
    >
      <div className={screenSize === 'mobile' ? "flex flex-row space-x-3" : "flex flex-col space-y-4"}>
        {sections.map((section, index) => (
          <motion.div
            key={section}
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              animate={{
                scale: currentSection === index ? 1.5 : 1,
                backgroundColor:
                  currentSection === index ? "#1a1a1a" : "#d1d5db",
              }}
              className={`${screenSize === 'mobile' ? 'w-2.5 h-2.5' : 'w-3 h-3'} rounded-full border-2 border-gray-300`}
            />
            <motion.span
              animate={{
                opacity: currentSection === index ? 1 : 0.5,
                x: currentSection === index ? 0 : -10,
              }}
              className={`text-sm font-medium text-gray-700 ${screenSize === 'mobile' ? 'hidden' : (screenSize === 'tablet' ? 'hidden lg:block' : 'hidden lg:block')}`}
            >
              {section}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
