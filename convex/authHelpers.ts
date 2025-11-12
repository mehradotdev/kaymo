import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const findAccountByFid = internalQuery({
  args: { fid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) =>
        q.eq("provider", "neynar").eq("providerAccountId", args.fid)
      )
      .first();
  },
});

export const updateExistingUser = internalMutation({
  args: {
    userId: v.id("users"),
    accountId: v.id("authAccounts"),
    displayName: v.string(),
    username: v.string(),
    pfp: v.string(),
    fid: v.string(),
    signerUuid: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      name: args.displayName,
      image: args.pfp,
    });

    await ctx.db.patch(args.accountId, {
      secret: args.signerUuid,
    });

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        displayName: args.displayName,
        farcasterId: args.fid,
        farcasterUsername: args.username,
        profileImgUrl: args.pfp,
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        displayName: args.displayName,
        farcasterId: args.fid,
        farcasterUsername: args.username,
        profileImgUrl: args.pfp,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }

    return args.userId;
  },
});

export const createNewUser = internalMutation({
  args: {
    displayName: v.string(),
    username: v.string(),
    pfp: v.string(),
    fid: v.string(),
    signerUuid: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.displayName,
      image: args.pfp,
    });

    await ctx.db.insert("authAccounts", {
      userId,
      provider: "neynar",
      providerAccountId: args.fid,
      secret: args.signerUuid,
    });

    await ctx.db.insert("userProfiles", {
      userId,
      displayName: args.displayName,
      farcasterId: args.fid,
      farcasterUsername: args.username,
      profileImgUrl: args.pfp,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return userId;
  },
});
