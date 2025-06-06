import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  category: string;
  opacity?: number;
  rotation?: number;
}

interface ProductShowcaseProps {
  className?: string;
  variant?: "nike" | "glasses";
}

export const ProductShowcase = ({
  className,
  variant = "nike",
}: ProductShowcaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // Transform values for parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Mock products for Nike style
  const nikeProducts: Product[] = [
    {
      id: "1",
      name: "Air Jordan 1",
      image: "/api/placeholder/300/300",
      price: "$170",
      category: "Basketball",
      opacity: 0.2,
    },
    {
      id: "2",
      name: "Air Max 90",
      image: "/api/placeholder/300/300",
      price: "$120",
      category: "Lifestyle",
      opacity: 0.4,
    },
    {
      id: "3",
      name: "React Infinity",
      image: "/api/placeholder/300/300",
      price: "$160",
      category: "Running",
      opacity: 0.7,
    },
    {
      id: "4",
      name: "Air Force 1",
      image: "/api/placeholder/300/300",
      price: "$90",
      category: "Classic",
      opacity: 1,
    },
  ];

  // Mock products for glasses style
  const glassesProducts: Product[] = [
    {
      id: "1",
      name: "Classic Round",
      image: "/api/placeholder/300/200",
      price: "$149",
      category: "Vintage",
      rotation: 28,
    },
    {
      id: "2",
      name: "Modern Square",
      image: "/api/placeholder/300/200",
      price: "$199",
      category: "Contemporary",
      rotation: 9,
    },
    {
      id: "3",
      name: "Aviator Style",
      image: "/api/placeholder/300/200",
      price: "$179",
      category: "Classic",
      rotation: -15,
    },
  ];

  const products = variant === "nike" ? nikeProducts : glassesProducts;

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      className={cn(
        "relative py-20 overflow-hidden",
        variant === "nike" ? "bg-white" : "bg-gray-50",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {variant === "nike" ? "Just Do It" : "Perfect Vision"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {variant === "nike"
              ? "Discover the latest innovations in athletic footwear and performance gear."
              : "Find the perfect frames that complement your style and enhance your vision."}
          </p>
        </motion.div>

        {/* Product Grid for Nike */}
        {variant === "nike" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                  <motion.div style={{ y }} className="aspect-square">
                    <div
                      className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
                      style={{ opacity: product.opacity }}
                    >
                      <div className="text-gray-500 text-sm font-medium">
                        {product.name}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/20 flex items-center justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm"
                    >
                      Quick Add
                    </motion.button>
                  </motion.div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="font-semibold text-gray-900">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Carousel for Glasses */}
        {variant === "glasses" && (
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="relative h-96 bg-white flex items-center justify-center"
                >
                  <motion.div
                    style={{
                      rotate: products[currentSlide]?.rotation || 0,
                    }}
                    className="w-80 h-60 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-gray-600 font-medium">
                      {products[currentSlide]?.name}
                    </div>
                  </motion.div>

                  {/* Product Info Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-lg"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {products[currentSlide]?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {products[currentSlide]?.category}
                    </p>
                    <p className="font-bold text-lg text-gray-900">
                      {products[currentSlide]?.price}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {products.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  animate={{
                    scale: currentSlide === index ? 1.2 : 1,
                    opacity: currentSlide === index ? 1 : 0.4,
                  }}
                  whileHover={{ scale: 1.1 }}
                  className="w-3 h-3 rounded-full bg-gray-600"
                />
              ))}
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {(variant === "nike"
            ? [
                {
                  title: "Innovation",
                  description: "Cutting-edge technology in every step",
                },
                {
                  title: "Performance",
                  description: "Engineered for athletes and everyday heroes",
                },
                {
                  title: "Style",
                  description: "Where sport meets street fashion",
                },
              ]
            : [
                {
                  title: "Precision",
                  description: "Expertly crafted with attention to detail",
                },
                {
                  title: "Comfort",
                  description: "All-day wearability without compromise",
                },
                {
                  title: "Style",
                  description: "Timeless designs that never go out of fashion",
                },
              ]
          ).map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="font-semibold text-xl text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};
