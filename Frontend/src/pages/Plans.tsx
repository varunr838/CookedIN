import { motion } from "framer-motion";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Plans() {
  const plans = useQuery(api.plans.getTodayPlans, {});
  const ensure = useMutation(api.plans.ensureTodayPlans);

  useEffect(() => {
    // Ensure plans exist once on mount
    ensure({}).catch(() => {});
  }, []);

  return (
    <div className="pt-16 max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Personalized Plans
        </h1>
        <p className="text-muted-foreground font-body">
          A fresh deck of cooking inspiration, tailored for today.
        </p>
      </div>

      {plans === undefined ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="font-body text-muted-foreground">Loading plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📖</div>
          <p className="font-heading font-semibold mb-2">No plans yet</p>
          <p className="font-body text-muted-foreground text-sm">
            Please check back in a moment while we prepare your deck.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-full">
            {plans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="min-w-[280px] sm:min-w-[340px]"
              >
                <Card className="glass-strong border-2 border-primary/20 shadow-2xl rounded-3xl overflow-hidden">
                  {plan.image && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={plan.image}
                        alt={plan.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">
                      {plan.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-sm text-foreground/90 leading-relaxed">
                      {plan.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
