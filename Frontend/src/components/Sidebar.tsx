import { motion } from "framer-motion";
import { Home, Plus, Calendar, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Plus, label: "Create", path: "/create" },
  { icon: Calendar, label: "Personalized Plans", path: "/plans" },
  { icon: Gift, label: "Redeem Rewards", path: "/rewards" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ 
        x: 0,
        width: collapsed ? 64 : 256 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] glass-strong border-r z-40"
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full glass border shadow-lg hover:scale-110 transition-transform"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="p-4 pt-8">
        <div className="space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredItem(item.label)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={`w-full justify-start gap-3 h-12 relative overflow-hidden ${
                    collapsed ? "px-3" : "px-4"
                  } ${
                    isActive 
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg glow-primary" 
                      : "hover:bg-primary/10"
                  }`}
                >
                  <item.icon className={`${collapsed ? "w-5 h-5" : "w-5 h-5"} flex-shrink-0`} />
                  
                  <motion.span
                    animate={{
                      opacity: collapsed ? 0 : 1,
                      width: collapsed ? 0 : "auto"
                    }}
                    transition={{ duration: 0.2 }}
                    className="font-heading font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-2 h-2 bg-white rounded-full"
                    />
                  )}

                  {/* Hover effect */}
                  {hoveredItem === item.label && !isActive && (
                    <motion.div
                      layoutId="hoverEffect"
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </Button>

                {/* Tooltip for collapsed state */}
                {collapsed && hoveredItem === item.label && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-16 top-0 glass-strong border rounded-lg px-3 py-2 text-sm font-heading font-medium whitespace-nowrap z-50"
                  >
                    {item.label}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </nav>
    </motion.aside>
  );
}