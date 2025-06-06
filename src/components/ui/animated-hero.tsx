import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface AnimatedHeroProps {
  className?: string;
}

export const AnimatedHero = ({ className }: AnimatedHeroProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const perfectVisionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Handle resize events for responsive animations
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

  // Get animation parameters based on device type
  const getAnimationParams = useCallback(() => {
    // Scale animation intensity by device type
    switch (screenSize) {
      case 'mobile':
        return {
          textScaleFactor: 1.2,      // Reduced for performance
          yTransformFactor: 40,      // Less movement on mobile
          parallaxFactor: 0,         // No parallax on mobile for performance
          heroHeight: '120vh',       // Shorter sections on mobile
          perfectHeight: '120vh'
        };
      case 'tablet':
        return {
          textScaleFactor: 1.5,      // Medium scaling on tablets
          yTransformFactor: 60,      // Medium movement on tablets
          parallaxFactor: 0.05,      // Minimal parallax on tablets
          heroHeight: '150vh',       // Medium sections on tablets
          perfectHeight: '130vh'
        };
      case 'desktop':
      default:
        return {
          textScaleFactor: 1.8,      // Full scaling on desktop
          yTransformFactor: 80,      // Full movement on desktop
          parallaxFactor: 0.1,       // Full parallax on desktop
          heroHeight: '180vh',       // Full sections on desktop
          perfectHeight: '150vh'
        };
    }
  }, [screenSize]);

  // Toggle video play/pause
  const toggleVideo = useCallback(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  }, [isVideoPlaying]);

  // Pause video when scrolling past hero section
  const handleVideoPause = useCallback(() => {
    if (videoRef.current && isVideoPlaying && window.scrollY > window.innerHeight) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  }, [isVideoPlaying]);

  // Resume video when scrolling back to hero section
  const handleVideoResume = useCallback(() => {
    if (videoRef.current && !isVideoPlaying && window.scrollY < window.innerHeight / 2) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  }, [isVideoPlaying]);

  // Optimized scroll handler with RAF
  const updateScrollAnimations = useCallback(() => {
    if (!heroRef.current || !textRef.current) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const heroHeight = heroRef.current.offsetHeight;
    const animParams = getAnimationParams();

    // Calculate scroll progress with high precision
    const heroProgress = Math.max(
      0,
      Math.min(1, scrollY / (heroHeight - windowHeight)),
    );
    const perfectProgress = Math.max(
      0,
      Math.min(1, (scrollY - heroHeight * 0.7) / (windowHeight * 0.8)),
    );

    // Ultra-smooth text scaling with hardware acceleration and device-specific tuning
    if (textRef.current) {
      const scale = 1 + heroProgress * animParams.textScaleFactor;
      const yTransform = -(heroProgress * animParams.yTransformFactor);
      const opacity = Math.max(0.3, 1 - heroProgress * 0.4);

      gsap.set(textRef.current, {
        scale,
        y: yTransform,
        opacity,
        force3D: true,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      });
    }

    // Check if we should pause/resume video based on scroll position
    if (scrollY > windowHeight / 1.5 && isVideoPlaying) {
      handleVideoPause();
    } else if (scrollY <= windowHeight / 2 && !isVideoPlaying) {
      handleVideoResume();
    }

    // Perfect Vision section animation with device-specific tuning
    if (perfectVisionRef.current) {
      const perfectMainText =
        perfectVisionRef.current.querySelector(".perfect-main-text");
      if (perfectMainText) {
        // Scale down animations for smaller screens
        const perfectScale = 1 + perfectProgress * (screenSize === 'mobile' ? 1.2 : 
                                                   (screenSize === 'tablet' ? 1.5 : 1.8));
        const perfectY = -(perfectProgress * (screenSize === 'mobile' ? 40 : 
                                             (screenSize === 'tablet' ? 60 : 80)));
        const perfectOpacity = Math.max(0.4, 1 - perfectProgress * 0.4);

        gsap.set(perfectMainText, {
          scale: perfectScale,
          y: perfectY,
          opacity: perfectOpacity,
          force3D: true,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        });
      }
    }

    lastScrollY.current = scrollY;
    ticking.current = false;
  }, [getAnimationParams, screenSize, isVideoPlaying, handleVideoPause, handleVideoResume]);

  // RAF-based smooth scroll listener
  const requestScrollUpdate = useCallback(() => {
    if (!ticking.current) {
      rafRef.current = requestAnimationFrame(updateScrollAnimations);
      ticking.current = true;
    }
  }, [updateScrollAnimations]);

  // Optimized scroll event listener
  useEffect(() => {
    // Initial device detection
    handleResize();
    
    const handleScroll = () => {
      requestScrollUpdate();
    };

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Initial call
    requestScrollUpdate();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [requestScrollUpdate, handleResize]);

  // Animation phases with optimized timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Enhanced GSAP animations for initial load with responsive parameters
  useEffect(() => {
    if (!heroRef.current || !perfectVisionRef.current) return;
    const animParams = getAnimationParams();

    const ctx = gsap.context(() => {
      // Optimize GSAP settings for performance
      gsap.config({
        force3D: true,
        nullTargetWarn: false,
      });

      // Perfect Vision section initial animations
      const perfectElements = perfectVisionRef.current?.querySelectorAll(
        ".perfect-vision-text",
      );
      if (perfectElements) {
        gsap.fromTo(
          perfectElements,
          {
            y: 100,
            opacity: 0,
            scale: 0.8,
            force3D: true,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: screenSize === 'mobile' ? 0.9 : 1.2, // Faster animations on mobile
            ease: "power2.out",
            stagger: screenSize === 'mobile' ? 0.06 : 0.08, // Faster stagger on mobile
            force3D: true,
            scrollTrigger: {
              trigger: perfectVisionRef.current,
              start: screenSize === 'mobile' ? "top 90%" : "top 85%", // Earlier trigger on mobile
              end: screenSize === 'mobile' ? "bottom 25%" : "bottom 15%",
              toggleActions: "play none none reverse",
              fastScrollEnd: true,
              preventOverlaps: true,
            },
          },
        );
      }

      // Parallax elements with optimized settings and device-specific intensity
      const parallaxElements = document.querySelectorAll(".parallax-element");
      parallaxElements.forEach((element, index) => {
        // Reduce parallax effect for mobile
        const speed = ((index % 3) + 1) * animParams.parallaxFactor;

        gsap.to(element, {
          yPercent: -20 * speed, 
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, [screenSize, getAnimationParams]);

  // Initialize video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.loop = true;
      
      if (isVideoPlaying) {
        videoRef.current.play().catch(err => {
          console.log("Video autoplay failed:", err);
          setIsVideoPlaying(false);
        });
      }
    }
  }, [isVideoPlaying]);

  const words = ["THIS", "IS", "YOUR", "WORLD"];
  const colors = ["#666664", "#252624", "#1D1D1D", "#5A5B58"];
  
  // Responsive text sizes
  const getSizes = () => {
    if (screenSize === 'mobile') {
      return ["text-3xl", "text-4xl", "text-5xl", "text-3xl"];
    } else if (screenSize === 'tablet') {
      return ["text-3xl", "text-4xl", "text-5xl", "text-3xl"];
    } else {
      return ["text-4xl", "text-5xl", "text-6xl", "text-4xl"];
    }
  };
  
  const sizes = getSizes();
  const perfectWords = ["PERFECT", "VISION"];
  const perfectColors = ["#1D1D1D", "#666664"];
  const animParams = getAnimationParams();

  return (
    <div className={cn("relative bg-black", className)}>
      {/* Main Hero Section - Optimized for performance */}
      <div
        ref={heroRef}
        className="relative flex items-start justify-center overflow-hidden bg-black"
        style={{
          minHeight: animParams.heroHeight,
          contain: "layout style paint",
          willChange: "transform",
        }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            loop
            src="/videos/hero.mp4"
          />
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* iOS-style Play/Pause Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          onClick={toggleVideo}
          className="absolute bottom-10 right-10 z-40 p-4 rounded-full bg-white bg-opacity-25 backdrop-blur-md border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-200"
          style={{
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          {isVideoPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" />
          )}
        </motion.button>

        {/* Main Content Container - Hardware accelerated */}
        <div
          className="relative z-10 text-center max-w-6xl mx-auto px-4 pt-32"
          style={{
            contain: "layout style",
            willChange: "auto",
            paddingTop: screenSize === 'mobile' ? '32px' : '48px',
          }}
        >
          {/* Ultra-smooth Scalable Text */}
          <div
            ref={textRef}
            className="hero-text-container mt-20"
            style={{
              contain: "layout style",
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
          >
            <div className={`flex flex-wrap items-center justify-center gap-${screenSize === 'mobile' ? '3' : '4'} md:gap-${screenSize === 'mobile' ? '6' : '8'}`}>
              {words.map((word, wordIndex) => (
                <motion.div
                  key={`${word}-${currentPhase}`}
                  initial={{ opacity: 0.9, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: wordIndex * 0.05,
                  }}
                  className="relative"
                  style={{
                    contain: "layout style",
                    willChange: "transform",
                  }}
                >
                  <motion.span
                    animate={{
                      scale: currentPhase === wordIndex ? 1.06 : 1,
                      color:
                        currentPhase === wordIndex ? "#FFFFFF" : "#CCCCCC",
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={cn(
                      "font-bold inline-block transition-all duration-200",
                      sizes[wordIndex],
                      screenSize === 'mobile' ? 
                        "md:text-4xl lg:text-5xl xl:text-6xl" : 
                        "md:text-6xl lg:text-7xl xl:text-8xl",
                    )}
                    style={{
                      color: currentPhase === wordIndex ? "#FFFFFF" : "#CCCCCC",
                      fontFamily:
                        "SF Pro Display, -apple-system, Roboto, Helvetica, sans-serif",
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      contain: "layout style",
                      willChange: "transform, color",
                    }}
                  >
                    {word.split("").map((letter, letterIndex) => (
                      <motion.span
                        key={letterIndex}
                        initial={{ opacity: 0.95, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: wordIndex * 0.1 + letterIndex * 0.02,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        whileHover={{
                          y: -2,
                          scale: 1.03,
                          transition: { duration: 0.15, ease: "easeOut" },
                        }}
                        className="inline-block"
                        style={{
                          contain: "layout style",
                          willChange: "transform",
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.span>
                </motion.div>
              ))}
            </div>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
              style={{
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                fontFamily: "SF Pro Text, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Experience the future with our innovative designs that blend form and function.
            </motion.p>
            
            {/* iOS-style CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-10 bg-white text-black px-8 py-3 rounded-full font-medium text-lg shadow-lg"
              style={{
                fontFamily: "SF Pro Text, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Explore Now
            </motion.button>
          </div>
          
          {/* Optimized Phase Indicators - iOS style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className={`flex justify-center space-x-3 mt-${screenSize === 'mobile' ? '8' : '12'}`}
            style={{ contain: "layout style" }}
          >
            {[0, 1, 2, 3].map((phase) => (
              <motion.div
                key={phase}
                animate={{
                  scale: currentPhase === phase ? 1.15 : 1,
                  opacity: currentPhase === phase ? 1 : 0.4,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`w-${screenSize === 'mobile' ? '2' : '2.5'} h-${screenSize === 'mobile' ? '2' : '2.5'} rounded-full bg-white`}
                style={{
                  contain: "layout style paint",
                  willChange: "transform, opacity",
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Ultra-smooth Perfect Vision Section */}
      <div
        ref={perfectVisionRef}
        className="relative flex items-start justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white scroll-section"
        style={{
          minHeight: animParams.perfectHeight,
          contain: "layout style paint",
          willChange: "transform",
        }}
      >
        {/* Optimized Background Elements - device-specific count */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(screenSize === 'mobile' ? 4 : (screenSize === 'tablet' ? 6 : 8))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-15"
              animate={{
                x: [0, Math.random() * (screenSize === 'mobile' ? 80 : 150)],
                y: [0, Math.random() * (screenSize === 'mobile' ? 80 : 150)],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: (screenSize === 'mobile' ? 10 : 15) + Math.random() * (screenSize === 'mobile' ? 5 : 8),
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                contain: "layout style paint",
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>

        {/* Perfect Vision Content */}
        <div
          className="relative z-10 text-center max-w-6xl mx-auto px-4 pt-32 scroll-section"
          style={{ 
            contain: "layout style",
            paddingTop: screenSize === 'mobile' ? '24px' : '32px',
          }}
        >
          {/* iOS style icon */}
          <motion.div
            className="relative mb-12 perfect-vision-text"
            style={{ contain: "layout style" }}
          >
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`w-${screenSize === 'mobile' ? '48' : '64'} h-${screenSize === 'mobile' ? '48' : '64'} bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center shadow-lg`}
                style={{
                  contain: "layout style paint",
                  willChange: "transform",
                }}
              >
                <div className={`text-${screenSize === 'mobile' ? '5xl' : '6xl'}`}>👁️</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Ultra-smooth Perfect Vision Text */}
          <div
            className="perfect-main-text"
            style={{
              contain: "layout style",
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
          >
            <div className={`flex flex-wrap items-center justify-center gap-${screenSize === 'mobile' ? '4' : '6'} md:gap-${screenSize === 'mobile' ? '8' : '12'}`}>
              {perfectWords.map((word, wordIndex) => (
                <motion.div
                  key={word}
                  className="relative perfect-vision-text"
                  style={{ contain: "layout style" }}
                >
                  <span
                    className={`font-bold inline-block text-${
                      screenSize === 'mobile' ? '4xl md:text-5xl lg:text-6xl xl:text-7xl' : 
                      (screenSize === 'tablet' ? '5xl md:text-6xl lg:text-7xl xl:text-8xl' : 
                      '6xl md:text-7xl lg:text-8xl xl:text-9xl')
                    }`}
                    style={{
                      color: perfectColors[wordIndex],
                      fontFamily:
                        "SF Pro Display, -apple-system, Roboto, Helvetica, sans-serif",
                      textShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      contain: "layout style",
                      willChange: "transform",
                    }}
                  >
                    {word.split("").map((letter, letterIndex) => (
                      <motion.span
                        key={letterIndex}
                        className="inline-block perfect-vision-text"
                        whileHover={{
                          y: -3,
                          scale: 1.05,
                          transition: { duration: 0.15, ease: "easeOut" },
                        }}
                        style={{
                          contain: "layout style",
                          willChange: "transform",
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Optimized Subtitle */}
          <motion.p
            className={`text-${screenSize === 'mobile' ? 'lg md:text-xl' : 'xl md:text-2xl'} text-gray-300 mt-8 max-w-2xl mx-auto perfect-vision-text`}
            style={{ contain: "layout style" }}
          >
            Crystal clear optics meet cutting-edge design for the ultimate
            visual experience
          </motion.p>

          {/* Optimized CTA Button */}
          <motion.div
            className="mt-16 perfect-vision-text"
            style={{ contain: "layout style" }}
          >
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 12px 28px rgba(255,255,255,0.15)",
                background: "linear-gradient(45deg, #ffffff, #e0e0e0)",
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white text-gray-900 px-${screenSize === 'mobile' ? '8' : '10'} py-${screenSize === 'mobile' ? '3' : '4'} rounded-full font-semibold text-${screenSize === 'mobile' ? 'base' : 'lg'} transition-all duration-200 shadow-lg`}
              style={{
                contain: "layout style",
                willChange: "transform, background-color, box-shadow",
              }}
            >
              Discover More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
