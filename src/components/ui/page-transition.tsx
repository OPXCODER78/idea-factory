import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const childVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export const PageTransition = ({
  children,
  className,
}: PageTransitionProps) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SectionTransition = ({
  children,
  className,
}: PageTransitionProps) => {
  return (
    <motion.div
      variants={childVariants}
      initial="initial"
      whileInView="animate"
      exit="exit"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Advanced transition with custom effects
interface AdvancedTransitionProps extends PageTransitionProps {
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
}

export const AdvancedTransition = ({
  children,
  className,
  direction = "up",
  duration = 0.6,
  delay = 0,
}: AdvancedTransitionProps) => {
  const getDirectionVariants = () => {
    const directions = {
      up: { y: 50 },
      down: { y: -50 },
      left: { x: 50 },
      right: { x: -50 },
    };

    return {
      initial: {
        opacity: 0,
        ...directions[direction],
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
      exit: {
        opacity: 0,
        ...Object.fromEntries(
          Object.entries(directions[direction]).map(([key, value]) => [
            key,
            -value,
          ]),
        ),
        transition: {
          duration: duration * 0.7,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    };
  };

  return (
    <motion.div
      variants={getDirectionVariants()}
      initial="initial"
      whileInView="animate"
      exit="exit"
      viewport={{ once: true, margin: "-30px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
