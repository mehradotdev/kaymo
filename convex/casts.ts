import { v } from "convex/values";
import { mutation, query, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAuth, requireUserProfile } from "./lib/auth";
import { getAuthUserId } from "@convex-dev/auth/server";

export const scheduleCast = mutation({
  args: {
    content: v.string(),
    imageUrl: v.optional(v.string()),
    scheduledTime: v.number(),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    await requireUserProfile(ctx, userId);

    const castId = await ctx.db.insert("scheduledCasts", {
      userId,
      content: args.content,
      imageUrl: args.imageUrl,
      scheduledTime: args.scheduledTime,
      timezone: args.timezone,
      status: "pending",
    });

    const delay = args.scheduledTime - Date.now();
    const scheduledJobId = await ctx.scheduler.runAfter(
      delay,
      internal.casts.postCast,
      { castId }
    );

    await ctx.db.patch(castId, { scheduledJobId });

    return castId;
  },
});

export const getScheduledCasts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("scheduledCasts")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getCast = query({
  args: { castId: v.id("scheduledCasts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const cast = await ctx.db.get(args.castId);
    if (!cast || cast.userId !== userId) {
      return null;
    }

    return cast;
  },
});

export const updateCast = mutation({
  args: {
    castId: v.id("scheduledCasts"),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    scheduledTime: v.number(),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const cast = await ctx.db.get(args.castId);
    if (!cast || cast.userId !== userId) {
      throw new Error("Cast not found");
    }

    if (cast.status !== "pending") {
      throw new Error("Can only update pending casts");
    }

    if (cast.scheduledJobId) {
      await ctx.scheduler.cancel(cast.scheduledJobId);
    }

    await ctx.db.patch(args.castId, {
      content: args.content,
      imageUrl: args.imageUrl,
      scheduledTime: args.scheduledTime,
      timezone: args.timezone,
    });

    const delay = args.scheduledTime - Date.now();
    const scheduledJobId = await ctx.scheduler.runAfter(
      delay,
      internal.casts.postCast,
      { castId: args.castId }
    );

    await ctx.db.patch(args.castId, { scheduledJobId });

    return args.castId;
  },
});

export const deleteCast = mutation({
  args: { castId: v.id("scheduledCasts") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const cast = await ctx.db.get(args.castId);
    if (!cast || cast.userId !== userId) {
      throw new Error("Cast not found");
    }

    if (cast.status === "pending" && cast.scheduledJobId) {
      await ctx.scheduler.cancel(cast.scheduledJobId);
    }

    await ctx.db.patch(args.castId, { status: "cancelled" });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const postCast = internalAction({
  args: { castId: v.id("scheduledCasts") },
  handler: async (ctx, args) => {
    const cast = await ctx.runQuery(internal.casts.getCastInternal, {
      castId: args.castId,
    });

    if (!cast) {
      return;
    }

    const signerUuid = await ctx.runQuery(internal.neynar.getSignerUuidForUser, {
      userId: cast.userId,
    });

    if (!signerUuid) {
      await ctx.runMutation(internal.casts.updateCastStatus, {
        castId: args.castId,
        status: "failed",
        errorMessage: "Neynar signer not found",
      });
      return;
    }

    try {
      const payload: {
        signer_uuid: string;
        text: string;
        embeds?: Array<{ url: string }>;
      } = {
        signer_uuid: signerUuid,
        text: cast.content,
      };

      if (cast.imageUrl) {
        const publicUrl = await ctx.runQuery(internal.casts.getStorageUrl, {
          storageId: cast.imageUrl,
        });
        if (publicUrl) {
          payload.embeds = [{ url: publicUrl }];
        }
      }

      const response = await fetch("https://api.neynar.com/v2/farcaster/cast/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEYNAR_API_KEY!,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to post cast: ${response.status} ${errorText}`);
      }

      await ctx.runMutation(internal.casts.updateCastStatus, {
        castId: args.castId,
        status: "posted",
      });
    } catch (error) {
      await ctx.runMutation(internal.casts.updateCastStatus, {
        castId: args.castId,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

export const getCastInternal = internalQuery({
  args: { castId: v.id("scheduledCasts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.castId);
  },
});

export const updateCastStatus = internalMutation({
  args: {
    castId: v.id("scheduledCasts"),
    status: v.union(v.literal("posted"), v.literal("failed")),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.castId, {
      status: args.status,
      errorMessage: args.errorMessage,
    });
  },
});

export const getStorageUrl = internalQuery({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
