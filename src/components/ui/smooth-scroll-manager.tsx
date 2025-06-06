import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";

interface SmoothScrollManagerProps {
  children: React.ReactNode;
  smoothness?: number;
}

// Full smooth scrolling implementation - only used on high-end devices
export const FullSmoothScrollManager = ({
  children,
  smoothness = 0.08, // Reduced for better performance
}: SmoothScrollManagerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTop = useRef(0);
  const targetScrollTop = useRef(0);
  const rafId = useRef<number>();
  const isScrolling = useRef(false);
  const lastTimestamp = useRef(0);

  // Simple throttle function to limit processing
  const throttle = useCallback((callback: () => void, limit: number) => {
    const now = Date.now();
    if (now - lastTimestamp.current >= limit) {
      callback();
      lastTimestamp.current = now;
    }
  }, []);

  // Optimized smooth scroll with frame timing
  const smoothScroll = useCallback(() => {
    if (!containerRef.current || !contentRef.current) {
      isScrolling.current = false;
      return;
    }

    const diff = targetScrollTop.current - scrollTop.current;
    const delta = Math.abs(diff);

    if (delta < 0.1) {
      scrollTop.current = targetScrollTop.current;
      isScrolling.current = false;
      return;
    }

    // Adaptive smoothness based on delta
    // Faster for large changes, smoother for small tweaks
    const adaptiveSmoothness = delta > 100 ? smoothness * 1.5 : smoothness;
    
    // Use eased interpolation with precise timing
    scrollTop.current += diff * adaptiveSmoothness;

    // Apply transform with minimal properties
    gsap.set(contentRef.current, {
      y: -scrollTop.current,
      force3D: true,
    });

    if (isScrolling.current) {
      rafId.current = requestAnimationFrame(smoothScroll);
    }
  }, [smoothness]);

  // Optimized wheel event handler with iOS-like momentum
  const handleScroll = useCallback(
    (e: Event) => {
      if (!containerRef.current) return;
      
      e.preventDefault();

      const delta = (e as WheelEvent).deltaY;
      
      // iOS-like acceleration/deceleration
      const acceleration = Math.sign(delta) * Math.min(Math.abs(delta) * 0.7, 60);
      
      targetScrollTop.current += acceleration;

      // Clamp scroll position
      const maxScroll =
        (contentRef.current?.scrollHeight || 0) - window.innerHeight;
      targetScrollTop.current = Math.max(
        0,
        Math.min(maxScroll, targetScrollTop.current),
      );

      if (!isScrolling.current) {
        isScrolling.current = true;
        rafId.current = requestAnimationFrame(smoothScroll);
      }
    },
    [smoothScroll],
  );

  // Touch handling for mobile with improved physics - iOS style
  const touchStart = useRef({ y: 0, time: 0 });
  const velocity = useRef(0);
  const lastY = useRef(0);
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = {
      y: e.touches[0].clientY,
      time: Date.now(),
    };
    lastY.current = e.touches[0].clientY;
    velocity.current = 0;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!containerRef.current) return;
      
      e.preventDefault();

      const touch = e.touches[0];
      const deltaY = lastY.current - touch.clientY;
      const deltaTime = Math.max(16, Date.now() - touchStart.current.time);
      
      // iOS-style velocity calculation with smoothing
      velocity.current = 0.7 * velocity.current + 0.3 * (deltaY / deltaTime) * 16;
      
      // iOS-like response curve (more resistance as you scroll more)
      const dampeningFactor = 1.0 - Math.min(0.8, Math.abs(deltaY) / 500);
      targetScrollTop.current += deltaY * dampeningFactor;

      // Clamp scroll position
      const maxScroll =
        (contentRef.current?.scrollHeight || 0) - window.innerHeight;
      targetScrollTop.current = Math.max(
        0,
        Math.min(maxScroll, targetScrollTop.current),
      );

      lastY.current = touch.clientY;
      touchStart.current.time = Date.now();

      if (!isScrolling.current) {
        isScrolling.current = true;
        rafId.current = requestAnimationFrame(smoothScroll);
      }
    },
    [smoothScroll],
  );
  
  // iOS-style momentum scrolling on touch end
  const handleTouchEnd = useCallback(() => {
    if (!velocity.current) return;
    
    // iOS-style deceleration
    const momentumScroll = () => {
      // iOS has a specific deceleration rate feel
      velocity.current *= 0.92; // iOS-like deceleration
      
      if (Math.abs(velocity.current) < 0.1) {
        velocity.current = 0;
        return;
      }
      
      // Apply momentum with iOS bounce effect
      targetScrollTop.current += velocity.current * 2.0; // iOS multiplier
      
      // Clamp with "bounce" effect for iOS feel
      const maxScroll = (contentRef.current?.scrollHeight || 0) - window.innerHeight;
      
      // Implement bounce effect at boundaries
      if (targetScrollTop.current < 0) {
        targetScrollTop.current *= 0.5; // Bounce back
        velocity.current *= 0.8; // Slow down faster at edges
      } else if (targetScrollTop.current > maxScroll) {
        const overScroll = targetScrollTop.current - maxScroll;
        targetScrollTop.current = maxScroll + overScroll * 0.5; // Bounce back
        velocity.current *= 0.8; // Slow down faster at edges
      }
      
      if (Math.abs(velocity.current) >= 0.1) {
        requestAnimationFrame(momentumScroll);
      }
    };
    
    if (Math.abs(velocity.current) > 0.5) {
      requestAnimationFrame(momentumScroll);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent default scrolling
    const preventScroll = (e: Event) => e.preventDefault();

    // Add event listeners with optimized options
    container.addEventListener("wheel", handleScroll, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    // Prevent scroll on document
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
    >
      <div
        ref={contentRef}
        style={{
          transform: "translateZ(0)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Lightweight solution with minimal overhead for better performance
export const LightweightSmoothScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  useEffect(() => {
    // Detect device type for optimized scrolling
    const detectDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    // Initial detection
    detectDeviceType();
    
    // Listen for resize events with throttling
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        detectDeviceType();
      }, 200);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // CSS-only optimizations that mimic iOS feel without JavaScript overhead
    const style = document.createElement("style");
    style.textContent = `
      html {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
      
      body {
        overscroll-behavior-y: none;
      }
      
      /* iOS-style scrollbar */
      ::-webkit-scrollbar {
        width: ${deviceType === 'mobile' ? '3px' : '5px'};
        background: transparent;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.15);
        border-radius: 100px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.25);
      }
      
      /* Performance optimizations */
      .gpu-layer {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
      }
      
      /* Disable heavy animations on mobile */
      @media (max-width: 768px) {
        .parallax-element {
          transform: none !important;
        }
        
        .floating-element {
          animation-duration: 0s !important;
        }
        
        * {
          -webkit-overflow-scrolling: touch !important;
        }
      }
      
      /* Simple scroll sections */
      .scroll-section {
        scroll-margin-top: 70px;
      }
      
      /* iOS-style animations */
      .ios-transition {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      /* Disable pointer events during scroll for better performance */
      body.is-scrolling * {
        pointer-events: none !important;
      }
      
      /* Optimize video performance */
      video {
        object-fit: cover;
        will-change: transform;
        transform: translateZ(0);
      }
    `;

    document.head.appendChild(style);
    
    // Optimize scroll performance
    let scrollTimer: number;
    const scrollHandler = () => {
      document.body.classList.add("is-scrolling");
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 100);
    };
    
    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', scrollHandler);
      clearTimeout(scrollTimer);
      clearTimeout(resizeTimer);
    };
  }, [deviceType]);

  return (
    <div className={`device-${deviceType}`}>
      {children}
    </div>
  );
};

// For backward compatibility
export const SmoothScrollManager = LightweightSmoothScroll;
