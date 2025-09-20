import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("rewards")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
  },
});

export const redeem = mutation({
  args: { rewardId: v.id("rewards") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to redeem rewards");
    }

    const reward = await ctx.db.get(args.rewardId);
    if (!reward || !reward.active) {
      throw new Error("Reward not found or inactive");
    }

    const userPoints = user.honorPoints || 0;
    if (userPoints < reward.cost) {
      throw new Error("Insufficient honor points");
    }

    // Deduct points and add to redemption history
    const newPoints = userPoints - reward.cost;
    const redemptionEntry = {
      itemId: reward._id,
      name: reward.name,
      cost: reward.cost,
      redeemedAt: Date.now(),
    };

    const currentHistory = user.redemptionHistory || [];
    
    await ctx.db.patch(user._id, {
      honorPoints: newPoints,
      redemptionHistory: [...currentHistory, redemptionEntry],
    });

    return { newPoints, redemption: redemptionEntry };
  },
});
