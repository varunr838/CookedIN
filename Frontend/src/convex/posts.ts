import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createPost = mutation({
  args: {
    title: v.string(),
    ingredients: v.array(v.object({
      name: v.string(),
      grams: v.optional(v.number()),
      quantity: v.optional(v.number()),
    })),
    caption: v.string(),
    mediaFiles: v.array(v.string()),
    flairs: v.object({
      cuisine: v.string(),
      foodType: v.string(),
      taste: v.string(),
      method: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to create a post");
    }

    // Validate ingredients - each must have exactly one of grams or quantity
    for (const ingredient of args.ingredients) {
      const hasGrams = ingredient.grams !== undefined && ingredient.grams !== null;
      const hasQuantity = ingredient.quantity !== undefined && ingredient.quantity !== null;
      
      if (hasGrams && hasQuantity) {
        throw new Error("Ingredient cannot have both grams and quantity");
      }
      if (!hasGrams && !hasQuantity) {
        throw new Error("Ingredient must have either grams or quantity");
      }
    }

    return await ctx.db.insert("posts", {
      title: args.title,
      ingredients: args.ingredients,
      caption: args.caption,
      mediaFiles: args.mediaFiles,
      flairs: args.flairs,
      authorId: user._id,
      authorName: user.name || "Anonymous Chef",
      authorImage: user.image,
      approvals: 0,
      disapprovals: 0,
      comments: 0,
    });
  },
});

export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const getPostsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.userId))
      .order("desc")
      .collect();
  },
});

export const toggleInteraction = mutation({
  args: {
    postId: v.id("posts"),
    type: v.union(v.literal("approve"), v.literal("disapprove")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to interact with posts");
    }

    // Check if user already has an interaction with this post
    const existingInteraction = await ctx.db
      .query("interactions")
      .withIndex("by_user_post", (q) => q.eq("userId", user._id).eq("postId", args.postId))
      .unique();

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (existingInteraction) {
      if (existingInteraction.type === args.type) {
        // Remove the interaction
        await ctx.db.delete(existingInteraction._id);
        
        // Update post counts
        if (args.type === "approve") {
          await ctx.db.patch(args.postId, { approvals: post.approvals - 1 });
        } else {
          await ctx.db.patch(args.postId, { disapprovals: post.disapprovals - 1 });
        }
      } else {
        // Change the interaction type
        await ctx.db.patch(existingInteraction._id, { type: args.type });
        
        // Update post counts
        if (args.type === "approve") {
          await ctx.db.patch(args.postId, { 
            approvals: post.approvals + 1,
            disapprovals: post.disapprovals - 1
          });
        } else {
          await ctx.db.patch(args.postId, { 
            approvals: post.approvals - 1,
            disapprovals: post.disapprovals + 1
          });
        }
      }
    } else {
      // Create new interaction
      await ctx.db.insert("interactions", {
        userId: user._id,
        postId: args.postId,
        type: args.type,
      });
      
      // Update post counts
      if (args.type === "approve") {
        await ctx.db.patch(args.postId, { approvals: post.approvals + 1 });
      } else {
        await ctx.db.patch(args.postId, { disapprovals: post.disapprovals + 1 });
      }
    }
  },
});

export const getUserInteraction = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("interactions")
      .withIndex("by_user_post", (q) => q.eq("userId", user._id).eq("postId", args.postId))
      .unique();
  },
});