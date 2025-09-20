import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Ingredient {
  name: string;
  grams?: number;
  quantity?: number;
}

interface IngredientRowProps {
  ingredient: Ingredient;
  onChange: (ingredient: Ingredient) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export function IngredientRow({ ingredient, onChange, onDelete, canDelete }: IngredientRowProps) {
  const [hasGrams, setHasGrams] = useState(!!ingredient.grams);
  const [hasQuantity, setHasQuantity] = useState(!!ingredient.quantity);

  useEffect(() => {
    setHasGrams(!!ingredient.grams);
    setHasQuantity(!!ingredient.quantity);
  }, [ingredient.grams, ingredient.quantity]);

  const handleNameChange = (name: string) => {
    onChange({ ...ingredient, name });
  };

  const handleGramsChange = (value: string) => {
    const grams = value ? parseFloat(value) : undefined;
    if (grams !== undefined) {
      onChange({ name: ingredient.name, grams, quantity: undefined });
    } else {
      onChange({ name: ingredient.name, grams: undefined, quantity: ingredient.quantity });
    }
  };

  const handleQuantityChange = (value: string) => {
    const quantity = value ? parseInt(value) : undefined;
    if (quantity !== undefined) {
      onChange({ name: ingredient.name, quantity, grams: undefined });
    } else {
      onChange({ name: ingredient.name, quantity: undefined, grams: ingredient.grams });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 p-4 glass rounded-xl border border-primary/20"
    >
      {/* Ingredient Name */}
      <div className="flex-1">
        <Input
          placeholder="Ingredient name"
          value={ingredient.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="glass border-primary/30 focus:border-primary/50 font-body"
        />
      </div>

      {/* Grams Input */}
      <div className="w-24">
        <Input
          type="number"
          placeholder="Grams"
          value={ingredient.grams || ""}
          onChange={(e) => handleGramsChange(e.target.value)}
          disabled={hasQuantity}
          className={`glass border-primary/30 focus:border-primary/50 font-body text-center ${
            hasQuantity ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <label className="text-xs text-muted-foreground text-center block mt-1 font-body">
          grams
        </label>
      </div>

      {/* Quantity Input */}
      <div className="w-24">
        <Input
          type="number"
          placeholder="Qty"
          value={ingredient.quantity || ""}
          onChange={(e) => handleQuantityChange(e.target.value)}
          disabled={hasGrams}
          className={`glass border-primary/30 focus:border-primary/50 font-body text-center ${
            hasGrams ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <label className="text-xs text-muted-foreground text-center block mt-1 font-body">
          quantity
        </label>
      </div>

      {/* Delete Button */}
      {canDelete && (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
