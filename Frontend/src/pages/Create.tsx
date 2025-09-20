import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FlairPills } from "@/components/FlairPills";
import { IngredientRow } from "@/components/IngredientRow";
import { ChefHat, Plus, Upload, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Ingredient {
  name: string;
  grams?: number;
  quantity?: number;
}

interface Flairs {
  cuisine: string;
  foodType: string;
  taste: string;
  method: string;
}

const flairOptions = {
  cuisine: ["Italian", "Japanese", "Mexican", "North Indian", "South Indian", "French", "Thai", "Chinese", "Spanish", "Mediterranean", "Other"],
  foodType: ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"],
  taste: ["Spicy", "Sweet", "Sour", "Savory", "Bitter", "Tangy", "Other"],
  method: ["Baked", "Fried", "Roasted", "Grilled", "Steamed", "Boiled", "Smoked", "Other"],
};

export default function Create() {
  const navigate = useNavigate();
  const createPost = useMutation(api.posts.createPost);
  
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [flairs, setFlairs] = useState<Partial<Flairs>>({});
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", grams: undefined, quantity: undefined }]);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFlair = (category: keyof Flairs, value: string) => {
    setFlairs(prev => ({ ...prev, [category]: value }));
  };

  const updateIngredient = (index: number, ingredient: Ingredient) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = ingredient;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: "", grams: undefined, quantity: undefined }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addMediaUrl = () => {
    if (mediaUrl.trim()) {
      setMediaFiles(prev => [...prev, mediaUrl.trim()]);
      setMediaUrl("");
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return title.trim().length > 0 && title.length <= 150 && 
               caption.trim().length > 0 && caption.length <= 1000;
      case 2:
        return Object.keys(flairs).length === 4 && 
               Object.values(flairs).every(value => value.trim().length > 0);
      case 3:
        return ingredients.length > 0 && 
               ingredients.every(ing => 
                 ing.name.trim().length > 0 && 
                 ((ing.grams !== undefined && ing.grams > 0) || (ing.quantity !== undefined && ing.quantity > 0))
               );
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost({
        title: title.trim(),
        caption: caption.trim(),
        flairs: flairs as Flairs,
        ingredients: ingredients.map(ing => ({
          name: ing.name.trim(),
          grams: ing.grams || undefined,
          quantity: ing.quantity || undefined,
        })),
        mediaFiles,
      });

      toast("Recipe shared! 🎉", {
        description: "Your culinary creation is now live for the community to enjoy!",
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to share recipe", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Share Your Creation
            </h1>
          </div>
          <p className="text-lg font-body text-muted-foreground">
            Transform your kitchen magic into a story that inspires others
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                  step >= stepNum
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "glass border-2 border-primary/30 text-muted-foreground"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {stepNum}
              </motion.div>
              {stepNum < 4 && (
                <div className={`w-16 h-1 mx-2 rounded-full ${
                  step > stepNum ? "bg-gradient-to-r from-primary to-accent" : "bg-border"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-strong border-2 border-primary/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-heading font-bold text-center">
                {step === 1 && "The Basics"}
                {step === 2 && "Flair Selection"}
                {step === 3 && "Ingredients List"}
                {step === 4 && "Media & Finish"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Basics */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-heading font-semibold mb-2">
                      Recipe Title <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Give your recipe an irresistible name..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={150}
                      className="glass border-primary/30 focus:border-primary/50 font-body text-lg h-12"
                    />
                    <p className="text-xs text-muted-foreground mt-1 font-body">
                      {title.length}/150 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-heading font-semibold mb-2">
                      Recipe Story <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Tell us about your culinary creation! What inspired you? How does it taste? Share the story behind this dish..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      maxLength={1000}
                      rows={6}
                      className="glass border-primary/30 focus:border-primary/50 font-body resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1 font-body">
                      {caption.length}/1000 characters
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Flair Selection */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <p className="text-center font-body text-muted-foreground">
                    Help others discover your recipe with these colorful tags
                  </p>
                  
                  <FlairPills
                    title="Cuisine/Region"
                    options={flairOptions.cuisine}
                    selected={flairs.cuisine || null}
                    onSelect={(value) => updateFlair("cuisine", value)}
                    colorVariant="primary"
                  />
                  
                  <FlairPills
                    title="Food Type"
                    options={flairOptions.foodType}
                    selected={flairs.foodType || null}
                    onSelect={(value) => updateFlair("foodType", value)}
                    colorVariant="secondary"
                  />
                  
                  <FlairPills
                    title="Taste Profile"
                    options={flairOptions.taste}
                    selected={flairs.taste || null}
                    onSelect={(value) => updateFlair("taste", value)}
                    colorVariant="accent"
                  />
                  
                  <FlairPills
                    title="Cooking Method"
                    options={flairOptions.method}
                    selected={flairs.method || null}
                    onSelect={(value) => updateFlair("method", value)}
                    colorVariant="success"
                  />
                </motion.div>
              )}

              {/* Step 3: Ingredients */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <p className="text-center font-body text-muted-foreground">
                    List your ingredients with measurements (use either grams OR quantity, not both)
                  </p>
                  
                  <div className="space-y-4">
                    {ingredients.map((ingredient, index) => (
                      <IngredientRow
                        key={index}
                        ingredient={ingredient}
                        onChange={(ing) => updateIngredient(index, ing)}
                        onDelete={() => removeIngredient(index)}
                        canDelete={ingredients.length > 1}
                      />
                    ))}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={addIngredient}
                      variant="outline"
                      className="w-full glass border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/10 font-heading font-semibold h-12"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Another Ingredient
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 4: Media */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <p className="text-center font-body text-muted-foreground">
                    Add photos to make your recipe irresistible (optional)
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste image URL here..."
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="glass border-primary/30 focus:border-primary/50 font-body"
                      />
                      <Button
                        onClick={addMediaUrl}
                        disabled={!mediaUrl.trim()}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>

                    {mediaFiles.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mediaFiles.map((url, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            <img
                              src={url}
                              alt={`Recipe media ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg glass border border-primary/20"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeMedia(index)}
                              className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => step > 1 ? setStep(step - 1) : navigate("/dashboard")}
                  className="glass border-primary/30 hover:border-primary/50 font-heading font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {step > 1 ? "Previous" : "Cancel"}
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!validateStep(step)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-heading font-semibold"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !validateStep(step)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-heading font-bold px-8 glow-primary"
                  >
                    {isSubmitting ? "Sharing..." : "Share My Creation!"}
                    <ChefHat className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
