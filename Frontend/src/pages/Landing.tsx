import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ChefHat, Sparkles, Users, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 glass-strong border-b"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <ChefHat className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-heading font-bold">
                Cooked<span className="text-accent">IN</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-heading font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  "Loading..."
                ) : isAuthenticated ? (
                  "Dashboard"
                ) : (
                  "Get Started"
                )}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-body text-sm font-medium">Dopamine Cooking Experience</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Cook. Share. Inspire.
              </h1>
              
              <p className="text-xl md:text-2xl font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join the most vibrant cooking community where every recipe tells a story, 
                every ingredient sparks joy, and every meal becomes a celebration.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={handleGetStarted}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-heading font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg glow-primary"
              >
                {isLoading ? (
                  "Loading..."
                ) : isAuthenticated ? (
                  "Go to Dashboard"
                ) : (
                  "Start Cooking Today"
                )}
                <ChefHat className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="glass border-2 border-primary/30 hover:border-primary/50 font-heading font-semibold px-8 py-4 rounded-full text-lg"
              >
                Watch Demo
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Why Chefs Love <span className="text-accent">CookedIN</span>
            </h2>
            <p className="text-xl font-body text-muted-foreground max-w-2xl mx-auto">
              Experience cooking like never before with our vibrant, community-driven platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Vibrant Community",
                description: "Connect with passionate home cooks and professional chefs from around the world",
                color: "from-primary to-accent"
              },
              {
                icon: Sparkles,
                title: "Dopamine Design",
                description: "Every interaction is designed to spark joy and make cooking feel like a celebration",
                color: "from-accent to-secondary"
              },
              {
                icon: TrendingUp,
                title: "Trending Recipes",
                description: "Discover what's hot in the culinary world and get inspired by trending dishes",
                color: "from-secondary to-primary"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">{feature.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="glass-strong rounded-3xl p-12 glow-accent"
          >
            <div className="text-6xl mb-6">🍳✨</div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Transform Your Kitchen?
            </h2>
            <p className="text-xl font-body text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of food lovers who are already sharing their culinary adventures on CookedIN
            </p>
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-heading font-bold px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-xl"
            >
              {isLoading ? (
                "Loading..."
              ) : isAuthenticated ? (
                "Enter Your Kitchen"
              ) : (
                "Join CookedIN Now"
              )}
              <ChefHat className="ml-3 w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="w-6 h-6 text-primary" />
            <span className="font-heading font-bold text-lg">
              Cooked<span className="text-accent">IN</span>
            </span>
          </div>
          <p className="font-body text-muted-foreground">
            Made with ❤️ for food lovers everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}