import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, getProfile } from "./lib/auth";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await getProfile(ctx, userId);
  },
});

export const createOrUpdateProfile = mutation({
  args: {
    displayName: v.string(),
    farcasterId: v.string(),
    farcasterUsername: v.string(),
    profileImgUrl: v.optional(v.string()),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const existingProfile = await getProfile(ctx, userId);

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        displayName: args.displayName,
        farcasterId: args.farcasterId,
        farcasterUsername: args.farcasterUsername,
        profileImgUrl: args.profileImgUrl,
        timezone: args.timezone,
      });
      return existingProfile._id;
    } else {
      return await ctx.db.insert("userProfiles", {
        userId,
        displayName: args.displayName,
        farcasterId: args.farcasterId,
        farcasterUsername: args.farcasterUsername,
        profileImgUrl: args.profileImgUrl,
        timezone: args.timezone,
      });
    }
  },
});
