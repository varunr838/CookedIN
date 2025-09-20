import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to comment");
    }

    // Insert the comment
    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: user._id,
      authorName: user.name || "Anonymous Chef",
      authorImage: user.image,
      content: args.content,
      parentCommentId: args.parentCommentId,
    });

    // Increment post comment count
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, { comments: post.comments + 1 });
    }

    return commentId;
  },
});

export const listForPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    // Get top-level comments (no parent)
    const topLevelComments = await ctx.db
      .query("comments")
      .withIndex("by_post_parent", (q) => 
        q.eq("postId", args.postId).eq("parentCommentId", undefined)
      )
      .order("desc")
      .collect();

    // For each top-level comment, get its replies
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await ctx.db
          .query("comments")
          .withIndex("by_post_parent", (q) => 
            q.eq("postId", args.postId).eq("parentCommentId", comment._id)
          )
          .order("asc")
          .collect();

        return {
          ...comment,
          replies,
        };
      })
    );

    return commentsWithReplies;
  },
});
