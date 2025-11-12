import { QueryCtx, MutationCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}

export async function getProfile(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  return await ctx.db
    .query("userProfiles")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .first();
}

export async function requireUserProfile(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  const profile = await getProfile(ctx, userId);
  if (!profile) {
    throw new Error("User profile not found. Please complete your profile first.");
  }
  return profile;
}
