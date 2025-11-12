import { internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSignerUuid = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const account = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) =>
        q.eq("userId", userId).eq("provider", "neynar")
      )
      .first();

    if (!account || !account.secret) {
      throw new Error("Neynar account not found");
    }

    return account.secret;
  },
});

export const getSignerUuidForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) =>
        q.eq("userId", args.userId).eq("provider", "neynar")
      )
      .first();

    if (!account || !account.secret) {
      throw new Error("Neynar account not found");
    }

    return account.secret;
  },
});

export const getFarcasterProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      return null;
    }

    return {
      displayName: profile.displayName,
      farcasterId: profile.farcasterId,
      farcasterUsername: profile.farcasterUsername,
      profileImgUrl: profile.profileImgUrl,
      timezone: profile.timezone,
    };
  },
});
