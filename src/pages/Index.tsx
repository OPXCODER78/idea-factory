import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { ProductShowcase } from "@/components/ui/product-showcase";
import { AnimatedFooter } from "@/components/ui/animated-footer";
import {
  ScrollProgress,
  ScrollIndicator,
} from "@/components/ui/scroll-progress";
import { IOSScrollOptimizer } from "@/components/ui/ios-scroll-optimizer";

// Register GSAP plugins with performance optimizations
gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [currentVariant, setCurrentVariant] = useState<"nike" | "glasses">(
    "glasses",
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const ticking = useRef(false);

  // Switch between Nike and Glasses variants
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVariant((prev) => (prev === "nike" ? "glasses" : "nike"));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Ultra-smooth GSAP ScrollTrigger animations with 60 FPS optimization
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Configure GSAP for maximum performance
      gsap.config({
        force3D: true,
        nullTargetWarn: false,
        autoSleep: 60,
        units: { rotation: "rad" },
      });

      // Set refresh priority for smooth scrolling
      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        ignoreMobileResize: true,
      });

      // Background color transition with hardware acceleration
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          backgroundColor: "#1a1a1a",
          duration: 2,
          ease: "power2.inOut",
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const metallicBlack = gsap.utils.interpolate(
                "#ffffff",
                "#1a1a1a",
                progress,
              );
              gsap.set(containerRef.current, {
                backgroundColor: metallicBlack,
                force3D: true,
              });
            },
          },
        });
      }

      // Product showcase ultra-smooth animations
      if (showcaseRef.current) {
        const productCards = showcaseRef.current.querySelectorAll(
          ".product-card, .showcase-item",
        );

        if (productCards.length > 0) {
          gsap.fromTo(
            productCards,
            {
              y: 80,
              opacity: 0,
              rotationY: -20,
              scale: 0.95,
              force3D: true,
            },
            {
              y: 0,
              opacity: 1,
              rotationY: 0,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.08,
              force3D: true,
              scrollTrigger: {
                trigger: showcaseRef.current,
                start: "top 75%",
                end: "bottom 25%",
                toggleActions: "play none none reverse",
                fastScrollEnd: true,
                preventOverlaps: true,
              },
            },
          );

          // Metallic effect with performance optimization
          gsap.to(productCards, {
            background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            border: "1px solid #333",
            duration: 1.2,
            ease: "power2.inOut",
            force3D: true,
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: "top 45%",
              end: "bottom top",
              scrub: 1,
              fastScrollEnd: true,
            },
          });
        }
      }

      // Features section with optimized animations
      if (featuresRef.current) {
        const featureElements = featuresRef.current.querySelectorAll(
          ".feature-item, h2, p, button",
        );

        if (featureElements.length > 0) {
          gsap.fromTo(
            featureElements,
            {
              y: 100,
              opacity: 0,
              rotationX: 20,
              force3D: true,
            },
            {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 1,
              ease: "power2.out",
              stagger: 0.06,
              force3D: true,
              scrollTrigger: {
                trigger: featuresRef.current,
                start: "top 65%",
                end: "bottom 35%",
                toggleActions: "play none none reverse",
                fastScrollEnd: true,
                preventOverlaps: true,
              },
            },
          );

          // Metallic gradient background with performance optimization
          gsap.to(featuresRef.current, {
            background:
              "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
            duration: 1.5,
            ease: "power2.inOut",
            force3D: true,
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 75%",
              end: "bottom 25%",
              scrub: 1,
              fastScrollEnd: true,
            },
          });
        }
      }

      // Stats section with optimized counter animations
      if (statsRef.current) {
        const statNumbers = statsRef.current.querySelectorAll(".stat-number");
        const statLabels = statsRef.current.querySelectorAll(".stat-label");

        // Animate numbers with hardware acceleration
        statNumbers.forEach((number, index) => {
          const target = number.textContent;
          const numericValue = parseInt(target?.replace(/\D/g, "") || "0");

          gsap.fromTo(
            number,
            { textContent: 0 },
            {
              textContent: numericValue,
              duration: 1.5,
              ease: "power2.out",
              snap: { textContent: 1 },
              force3D: true,
              scrollTrigger: {
                trigger: number,
                start: "top 85%",
                toggleActions: "play none none reverse",
                fastScrollEnd: true,
              },
              onUpdate: function () {
                const currentValue = Math.floor(this.targets()[0].textContent);
                const suffix = target?.replace(/\d/g, "") || "";
                this.targets()[0].textContent = currentValue + suffix;
              },
            },
          );
        });

        // Labels animation with metallic effect
        if (statLabels.length > 0) {
          gsap.fromTo(
            statLabels,
            {
              y: 25,
              opacity: 0,
              color: "#666",
              force3D: true,
            },
            {
              y: 0,
              opacity: 1,
              color: "#b8b8b8",
              duration: 1,
              ease: "power2.out",
              stagger: 0.06,
              force3D: true,
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
                fastScrollEnd: true,
              },
            },
          );
        }
      }

      // Optimized parallax scrolling with minimal repaints
      const parallaxElements = document.querySelectorAll(".parallax-element");
      parallaxElements.forEach((element, index) => {
        const speed = ((index % 3) + 1) * 0.15; // Reduced for smoother performance

        gsap.to(element, {
          yPercent: -15 * speed,
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Optimized product slider with 60 FPS performance
  const products = [
    { id: 1, name: "Air Max 270", price: "$150", image: "product1.jpg" },
    { id: 2, name: "React Infinity", price: "$160", image: "product2.jpg" },
    { id: 3, name: "Air Force 1", price: "$90", image: "product3.jpg" },
    { id: 4, name: "Zoom Pegasus", price: "$120", image: "product4.jpg" },
    { id: 5, name: "Air Jordan 1", price: "$170", image: "product5.jpg" },
    { id: 6, name: "Blazer Mid", price: "$100", image: "product6.jpg" },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, products.length - 2));
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, products.length - 2)) %
        Math.max(1, products.length - 2),
    );
  }, [products.length]);

  return (
    <IOSScrollOptimizer>
      <div
        ref={containerRef}
        className="min-h-screen bg-white transition-all duration-1000 ultra-smooth-scroll gpu-layer"
      >
        {/* Ultra-smooth Scroll Progress Indicators */}
        <ScrollProgress />
        <ScrollIndicator />

        {/* iOS-style Centered Header */}
        <motion.header
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-4xl gpu-layer"
        >
          <div className="bg-black/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg px-6 py-3 ios-blur">
            <div className="flex flex-col items-center justify-center">
              {/* Logo */}
              <div className="text-xl font-bold text-white mb-2"
                   style={{ fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
                IDEA FACTORY
              </div>

              {/* Centered Navigation */}
              <nav className="flex space-x-8 items-center justify-center">
                <motion.a
                  href="#"
                  whileHover={{ y: -1, color: "#007AFF" }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="text-sm font-medium text-white hover:text-white/90 transition-colors duration-150 relative group"
                  style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
                >
                  Home
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white/30 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-150"></span>
                </motion.a>
                
                <motion.a
                  href="#"
                  whileHover={{ y: -1, color: "#007AFF" }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="text-sm font-medium text-white hover:text-white/90 transition-colors duration-150 relative group"
                  style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
                >
                  Idea Factory
                  <motion.div 
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    whileHover={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-lg rounded-lg text-xs px-2 py-1 pointer-events-none"
                    style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
                  >
                    Coming Soon
                  </motion.div>
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white/30 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-150"></span>
                </motion.a>
                
                <motion.a
                  href="#about"
                  whileHover={{ y: -1, color: "#007AFF" }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="text-sm font-medium text-white hover:text-white/90 transition-colors duration-150 relative group"
                  style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
                >
                  About Us
                  <motion.div 
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    whileHover={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute top-full mt-1 right-0 bg-white/20 backdrop-blur-lg rounded-lg text-xs px-2 py-1 whitespace-nowrap pointer-events-none"
                    style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
                  >
                    Founder: Prakhar Vardhan
                  </motion.div>
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white/30 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-150"></span>
                </motion.a>
              </nav>
            </div>
          </div>
        </motion.header>

        {/* Ultra-smooth Extended Hero Section */}
        <div className="parallax-element parallax-60fps scroll-section">
          <AnimatedHero className="pt-20" />
        </div>

        {/* Performance Optimized Product Showcase Section */}
        <div
          ref={showcaseRef}
          className="showcase-section performance-container scroll-section"
        >
          <ProductShowcase variant={currentVariant} />
        </div>

        {/* Ultra-smooth Enhanced Features Section */}
        <motion.section
          ref={featuresRef}
          className="py-20 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden feature-section gpu-layer scroll-section"
        >
          {/* Optimized floating metallic particles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="floating-element optimized-float absolute w-1 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-15"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  willChange: "transform",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Just Do It Header */}
            <div className="text-center mb-16">
              <motion.h2 className="text-5xl md:text-7xl font-bold mb-8 feature-item smooth-scale-text">
                {currentVariant === "nike"
                  ? "Just Do It"
                  : "See the Difference"}
              </motion.h2>

              <motion.p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto feature-item">
                {currentVariant === "nike"
                  ? "Innovation meets performance in every product we create. Push your limits."
                  : "Experience clarity like never before with our precision-crafted eyewear."}
              </motion.p>
            </div>

            {/* Ultra-smooth Premium Product Slider */}
            <div className="relative mb-16 performance-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Premium Collection</h3>
                <div className="flex space-x-2">
                  <motion.button
                    onClick={prevSlide}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-150 fps-button"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={nextSlide}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-150 fps-button"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl">
                <motion.div
                  className="flex gpu-layer"
                  animate={{ x: -currentSlide * 280 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="min-w-[260px] mx-2 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover-60fps"
                      whileHover={{
                        scale: 1.03,
                        y: -8,
                        boxShadow: "0 20px 40px rgba(255,255,255,0.1)",
                        transition: { duration: 0.2, ease: "easeOut" },
                      }}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-gray-300 text-sm">
                          {product.name}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                          {product.price}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="p-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors duration-150 fps-button"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Ultra-smooth slider indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.max(1, products.length - 2) }).map(
                  (_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      animate={{
                        scale: currentSlide === index ? 1.15 : 1,
                        opacity: currentSlide === index ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="w-3 h-3 rounded-full bg-white smooth-indicator"
                    />
                  ),
                )}
              </div>
            </div>

            {/* Ultra-smooth Action Buttons */}
            <div className="text-center">
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center feature-item">
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 30px rgba(192,192,192,0.3)",
                    background: "linear-gradient(45deg, #c0c0c0, #e0e0e0)",
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 fps-button"
                >
                  Shop Collection
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                    background: "linear-gradient(45deg, #1a1a1a, #2a2a2a)",
                    borderColor: "#c0c0c0",
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 fps-button"
                >
                  Explore More
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Additional Product Showcase */}
        <motion.section
          className={`parallax-element parallax-60fps scroll-section ${currentVariant === "nike" ? "bg-gray-50" : "bg-white"}`}
        >
          <ProductShowcase variant={currentVariant} className="py-20" />
        </motion.section>

        {/* Ultra-smooth Stats Section */}
        <motion.section
          ref={statsRef}
          className="py-16 bg-white stats-section performance-container scroll-section"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(currentVariant === "nike"
                ? [
                    {
                      number: "1000000",
                      label: "Athletes Trust Us",
                      suffix: "+",
                    },
                    { number: "50", label: "Countries Worldwide", suffix: "+" },
                    { number: "100", label: "Product Lines", suffix: "+" },
                    { number: "24", label: "Customer Support", suffix: "/7" },
                  ]
                : [
                    { number: "500000", label: "Happy Customers", suffix: "+" },
                    { number: "30", label: "Years Experience", suffix: "+" },
                    { number: "200", label: "Frame Styles", suffix: "+" },
                    { number: "99", label: "Satisfaction Rate", suffix: "%" },
                  ]
              ).map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center stat-item hover-60fps"
                >
                  <div className="stat-number text-3xl md:text-4xl font-bold text-gray-900 mb-2 smooth-scale-text">
                    {stat.number}
                    {stat.suffix}
                  </div>
                  <div className="stat-label text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* About Us Section with iOS style */}
        <motion.section
          id="about"
          className="py-20 bg-black text-white relative overflow-hidden scroll-section"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-90"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
            
            {/* iOS-style gradient orbs */}
            <div className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 left-[20%] w-80 h-80 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-3xl opacity-20"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
              >
                About Us
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-8 rounded-full"
              ></motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg text-gray-300 max-w-3xl mx-auto mb-12"
                style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
              >
                Idea Factory is an innovation hub where creativity meets technology. 
                We're dedicated to turning visionary concepts into reality through 
                cutting-edge design and forward-thinking solutions.
              </motion.p>
            </div>
            
            {/* Founder Section with iOS styling */}
            <div className="flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl ios-card mb-12 max-w-3xl"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden ios-shadow border-2 border-white/20">
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-4xl">👨‍💻</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 
                      className="text-2xl font-bold mb-3 text-white"
                      style={{ fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
                    >
                      Prakhar Vardhan
                    </h3>
                    <h4 
                      className="text-blue-400 font-medium mb-4 text-sm"
                      style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
                    >
                      Founder & Creative Director
                    </h4>
                    <p 
                      className="text-gray-300 mb-6"
                      style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
                    >
                      Prakhar is a visionary entrepreneur with a passion for innovation and design. 
                      With a background in technology and creative arts, he founded Idea Factory 
                      to bridge the gap between imagination and implementation.
                    </p>
                    <div className="flex justify-center md:justify-start space-x-4">
                      <motion.a
                        whileHover={{ y: -3, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="#"
                        className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium text-sm ios-button hover:bg-blue-600 transition-colors"
                      >
                        Contact
                      </motion.a>
                      <motion.a
                        whileHover={{ y: -3, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="#"
                        className="bg-white/10 text-white px-4 py-2 rounded-full font-medium text-sm ios-button hover:bg-white/20 transition-colors border border-white/20"
                      >
                        Portfolio
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Coming Soon Banner - iOS Style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 rounded-2xl ios-shadow-lg max-w-xl mx-auto text-center"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                  <h3 
                    className="text-white text-lg font-semibold"
                    style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
                  >
                    More exciting features coming soon!
                  </h3>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <AnimatedFooter variant={currentVariant} className="scroll-section" />

        {/* Ultra-smooth Variant Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <motion.div
            animate={{
              scale: [1, 1.03, 1],
              boxShadow: [
                "0 0 0 rgba(192,192,192,0)",
                "0 0 12px rgba(192,192,192,0.2)",
                "0 0 0 rgba(192,192,192,0)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm border border-gray-600 smooth-indicator"
          >
            {currentVariant === "nike" ? "🏃 Nike Mode" : "👓 Glasses Mode"}
          </motion.div>
        </motion.div>
      </div>
    </IOSScrollOptimizer>
  );
};

export default Index;
