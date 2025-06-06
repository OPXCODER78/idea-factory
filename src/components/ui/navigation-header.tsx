import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  variant?: "nike" | "glasses";
}

export const NavigationHeader = ({
  variant = "nike",
}: NavigationHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const nikeNavItems = ["Men", "Women", "Kids", "Customise", "Sale", "SNKRS"];
  const glassesNavItems = [
    "GLASSES",
    "FRAMES",
    "NEW LAUNCH",
    "CONTACT US",
    "CART",
  ];

  const navItems = variant === "nike" ? nikeNavItems : glassesNavItems;

  return (
    <header className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - No animation */}
          <div className="flex-shrink-0">
            {variant === "nike" ? (
              <svg
                className="h-6 w-6 text-black"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.456 0-2.57-.616-3.342-1.848C-.925 12.993-.617 11.13.616 9.053c.925-1.54 2.262-3.08 4.006-4.621C6.442 2.77 8.397 1.54 10.56.924c2.163-.616 4.007-.308 5.54.924 1.232.924 1.848 2.262 1.848 4.006 0 .616-.154 1.232-.462 1.848L24 7.8z" />
              </svg>
            ) : (
              <div className="text-xl font-bold text-gray-800">EYEWEAR</div>
            )}
          </div>

          {/* Desktop Navigation - No animation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-900",
                  variant === "nike" ? "text-gray-700" : "text-gray-600",
                  item === "SNKRS" && "font-bold",
                )}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Actions - Simplified */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-48 pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                />
              </div>
            </div>

            {/* Action Icons */}
            <div className="hidden sm:flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="h-5 w-5 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingBag className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {variant === "glasses" && (
              <button className="bg-gray-800 text-white px-4 py-2 text-xs font-medium rounded border border-gray-700 hover:bg-gray-700 transition-colors">
                Shop Now
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
