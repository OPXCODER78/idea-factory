import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedFooterProps {
  className?: string;
  variant?: "nike" | "glasses";
}

export const AnimatedFooter = ({
  className,
  variant = "nike",
}: AnimatedFooterProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const socialIcons = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Github, href: "#", label: "Github" },
  ];

  const nikeLinks = [
    { title: "Products", links: ["Shoes", "Clothing", "Gear", "New Releases"] },
    {
      title: "Sports",
      links: ["Running", "Basketball", "Training", "Lifestyle"],
    },
    {
      title: "Support",
      links: ["Size Guide", "Returns", "Shipping", "Contact"],
    },
  ];

  const glassesLinks = [
    {
      title: "Collections",
      links: ["Prescription", "Sunglasses", "Reading", "Blue Light"],
    },
    {
      title: "Services",
      links: ["Eye Exam", "Lens Options", "Repairs", "Insurance"],
    },
    { title: "About", links: ["Our Story", "Locations", "Careers", "Reviews"] },
  ];

  const links = variant === "nike" ? nikeLinks : glassesLinks;

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "relative overflow-hidden",
        variant === "nike"
          ? "bg-black text-white"
          : "bg-gray-900 text-gray-100",
        className,
      )}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * 200,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * 200,
              opacity: [0, 0.1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <motion.div whileHover={{ scale: 1.05 }} className="mb-6">
              {variant === "nike" ? (
                <svg
                  className="h-8 w-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.456 0-2.57-.616-3.342-1.848C-.925 12.993-.617 11.13.616 9.053c.925-1.54 2.262-3.08 4.006-4.621C6.442 2.77 8.397 1.54 10.56.924c2.163-.616 4.007-.308 5.54.924 1.232.924 1.848 2.262 1.848 4.006 0 .616-.154 1.232-.462 1.848L24 7.8z" />
                </svg>
              ) : (
                <div className="text-2xl font-bold">EYEWEAR</div>
              )}
            </motion.div>

            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              {variant === "nike"
                ? "Bringing inspiration and innovation to every athlete in the world. If you have a body, you are an athlete."
                : "Premium eyewear designed for those who appreciate quality, style, and perfect vision. See the world differently."}
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-gray-300"
              >
                <Mail className="h-4 w-4" />
                <span>hello@{variant === "nike" ? "nike" : "eyewear"}.com</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-gray-300"
              >
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-gray-300"
              >
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Links Sections */}
          {links.map((section, index) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="space-y-4"
            >
              <h3 className="font-semibold text-lg text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: linkIndex * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.a
                      href="#"
                      whileHover={{ x: 5, color: "#ffffff" }}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm block"
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-700 pt-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="font-semibold text-lg text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-300 text-sm">
                Get the latest{" "}
                {variant === "nike"
                  ? "releases and exclusive offers"
                  : "collections and eye care tips"}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex space-x-2 w-full md:w-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        >
          <div className="text-gray-400 text-sm">
            © 2024 {variant === "nike" ? "Nike" : "Eyewear"}, Inc. All rights
            reserved.
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialIcons.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.2,
                  y: -2,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
