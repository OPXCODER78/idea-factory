import { useEffect, useState } from "react";

// iOS style scroll optimization
export const IOSScrollOptimizer = ({
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
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif;
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
      
      /* iOS-style buttons */
      .ios-button {
        border-radius: 9999px;
        padding: 0.5rem 1rem;
        font-weight: 500;
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      /* iOS-style cards */
      .ios-card {
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }
      
      /* iOS-style colors */
      .ios-blue { color: #007AFF; }
      .ios-green { color: #34C759; }
      .ios-indigo { color: #5856D6; }
      .ios-orange { color: #FF9500; }
      .ios-red { color: #FF3B30; }
      
      /* iOS typography */
      h1, h2, h3, h4, h5, h6 {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;
        font-weight: 600;
      }
      
      p, span, div, button {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
      }
      
      .ios-rounded-xl {
        border-radius: 16px;
      }
      
      .ios-rounded-lg {
        border-radius: 12px;
      }
      
      .ios-shadow {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }
      
      /* iOS-style backdrop blur */
      .ios-blur {
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }
      
      /* Grid pattern background for About Us section */
      .bg-grid-pattern {
        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      /* Additional iOS shadow styles */
      .ios-shadow-lg {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 
                    0 0 1px rgba(255, 255, 255, 0.2);
      }
      
      /* Enhanced animations for iOS feel */
      @keyframes gentle-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .gentle-float {
        animation: gentle-float 5s ease-in-out infinite;
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
    <div className={`ios-optimized device-${deviceType}`}>
      {children}
    </div>
  );
}; 