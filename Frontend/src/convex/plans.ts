import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getTodayPlans = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to view plans");
    }

    const today = new Date().toISOString().split("T")[0];

    // Only read existing plans; do not insert from a query
    return await ctx.db
      .query("plans")
      .withIndex("by_user_and_day", (q) => q.eq("userId", user._id).eq("day", today))
      .collect();
  },
});

// Optional helper to ensure plans exist (can be called from UI once)
export const ensureTodayPlans = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to ensure plans");
    }

    const today = new Date().toISOString().split("T")[0];
    const existingPlans = await ctx.db
      .query("plans")
      .withIndex("by_user_and_day", (q) => q.eq("userId", user._id).eq("day", today))
      .collect();

    if (existingPlans.length > 0) {
      return existingPlans;
    }

    const samplePlans = [
      {
        userId: user._id,
        day: today,
        title: "Mediterranean Morning Boost",
        content:
          "Start your day with a vibrant Greek-inspired breakfast! Try making a colorful bowl with Greek yogurt, fresh berries, honey drizzle, and crushed walnuts. The combination of protein and antioxidants will energize your morning cooking adventures.",
        image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400",
      },
      {
        userId: user._id,
        day: today,
        title: "Spice Adventure Challenge",
        content:
          "Today's challenge: experiment with a new spice blend! Create your own garam masala or try making harissa from scratch. Document your spice journey and share how these bold flavors transform your favorite dishes.",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
      },
      {
        userId: user._id,
        day: today,
        title: "Comfort Food Reimagined",
        content:
          "Take a classic comfort food and give it a healthy twist! Try cauliflower mac and cheese, zucchini lasagna, or sweet potato gnocchi. Share your creative spin on beloved classics with the CookedIN community.",
        image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400",
      },
    ];

    const createdIds = [];
    for (const plan of samplePlans) {
      const id = await ctx.db.insert("plans", plan);
      createdIds.push(id);
    }

    const created = [];
    for (const id of createdIds) {
      const doc = await ctx.db.get(id);
      if (doc) created.push(doc);
    }
    return created;
  },
});