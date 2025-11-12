import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  numbers: defineTable({
    value: v.number(),
  }),

  userProfiles: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    farcasterId: v.string(),
    farcasterUsername: v.string(),
    profileImgUrl: v.optional(v.string()),
    timezone: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_farcaster_id", ["farcasterId"]),

  scheduledCasts: defineTable({
    userId: v.id("users"),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    scheduledTime: v.number(),
    timezone: v.string(),
    status: v.union(v.literal("pending"), v.literal("posted"), v.literal("failed"), v.literal("cancelled")),
    scheduledJobId: v.optional(v.id("_scheduled_functions")),
    errorMessage: v.optional(v.string()),
  }).index("by_user_id", ["userId"])
    .index("by_status", ["status"]),
});

export default schema;
