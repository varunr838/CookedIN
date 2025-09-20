import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";

type Reward = {
  _id: Id<"rewards">;
  _creationTime: number;
  name: string;
  image: string;
  cost: number;
  active: boolean;
};

export default function Redeem() {
  const user = useQuery(api.users.currentUser, {});
  const rewards = useQuery(api.rewards.listActive, {});
  const redeem = useMutation(api.rewards.redeem);

  const [selected, setSelected] = useState<Reward | null>(null);
  const canAfford = (cost: number) => (user?.honorPoints || 0) >= cost;

  return (
    <div className="pt-16 max-w-6xl mx-auto px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Rewards Marketplace
          </h1>
          <p className="text-muted-foreground font-body">Redeem your Honor Points for tasty perks.</p>
        </div>
        <div className="text-right">
          <p className="font-body text-sm text-muted-foreground">Your Points</p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            {user?.honorPoints ?? 0}
          </motion.div>
        </div>
      </div>

      {rewards === undefined ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="font-body text-muted-foreground">Loading rewards...</p>
        </div>
      ) : rewards.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎁</div>
          <p className="font-heading font-semibold mb-2">No rewards available</p>
          <p className="font-body text-muted-foreground text-sm">Check back later for new treats.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, index) => {
            const afford = canAfford(reward.cost);
            return (
              <motion.div key={reward._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card
                  className={`rounded-3xl overflow-hidden shadow-xl ${
                    afford ? "glass-strong border-2 border-primary/20" : "glass border-2 border-border/40"
                  } ${!afford ? "opacity-50 grayscale" : ""}`}
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={reward.image}
                      alt={reward.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-heading">{reward.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="font-heading">{reward.cost} pts</span>
                    <Button
                      disabled={!afford}
                      onClick={() => setSelected(reward)}
                      className="bg-gradient-to-r from-primary to-accent disabled:opacity-60"
                    >
                      Redeem
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              {selected ? `Redeem ${selected.name} for ${selected.cost} points?` : "Confirm"}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-accent"
              onClick={async () => {
                if (!selected) return;
                try {
                  await redeem({ rewardId: selected._id });
                  toast("Redeemed successfully! 🎉");
                  setSelected(null);
                } catch (e) {
                  toast.error("Redemption failed");
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
