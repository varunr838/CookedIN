import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface FlairPillsProps {
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  colorVariant?: "primary" | "secondary" | "accent" | "success";
}

const colorVariants = {
  primary: "from-primary to-accent",
  secondary: "from-secondary to-primary", 
  accent: "from-accent to-secondary",
  success: "from-green-500 to-emerald-500",
};

export function FlairPills({ title, options, selected, onSelect, colorVariant = "primary" }: FlairPillsProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-heading font-semibold text-lg text-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <motion.div
            key={option}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selected === option ? "default" : "outline"}
              size="sm"
              onClick={() => onSelect(option)}
              className={`relative overflow-hidden font-body font-medium transition-all duration-300 ${
                selected === option
                  ? `bg-gradient-to-r ${colorVariants[colorVariant]} text-white shadow-lg glow-primary`
                  : "glass border-primary/30 hover:border-primary/50 hover:bg-primary/10"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {option}
                {selected === option && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3 h-3" />
                  </motion.div>
                )}
              </span>
              
              {selected === option && (
                <motion.div
                  layoutId={`selected-${title}`}
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
