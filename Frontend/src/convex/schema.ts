import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Recipe posts table
    posts: defineTable({
      title: v.string(),
      ingredients: v.array(v.string()),
      caption: v.string(),
      mediaFiles: v.array(v.string()), // URLs to stored files
      authorId: v.id("users"),
      authorName: v.string(),
      authorImage: v.optional(v.string()),
      approvals: v.number(),
      disapprovals: v.number(),
      comments: v.number(),
    }).index("by_author", ["authorId"]),

    // Comments table
    comments: defineTable({
      postId: v.id("posts"),
      authorId: v.id("users"),
      authorName: v.string(),
      authorImage: v.optional(v.string()),
      content: v.string(),
    }).index("by_post", ["postId"]),

    // User interactions table
    interactions: defineTable({
      userId: v.id("users"),
      postId: v.id("posts"),
      type: v.union(v.literal("approve"), v.literal("disapprove")),
    }).index("by_user_post", ["userId", "postId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;