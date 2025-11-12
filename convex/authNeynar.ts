import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { internal } from "./_generated/api";

// Helper function to verify signerUuid with Neynar API
async function verifyNeynarSigner(fid: string, signerUuid: string) {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/signer?signer_uuid=${signerUuid}`,
    {
      headers: {
        "x-api-key": process.env.NEYNAR_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to verify Neynar credentials");
  }

  const signerData = await response.json();
  
  // Verify FID matches
  if (signerData.fid?.toString() !== fid) {
    throw new Error("Invalid credentials: FID mismatch");
  }

  // Verify signer is approved
  if (signerData.status !== "approved") {
    throw new Error("Signer not approved");
  }

  return signerData;
}

// Neynar Provider for Convex Auth
export const Neynar = ConvexCredentials({
  id: "neynar",
  authorize: async (credentials, ctx) => {
    const { fid, signerUuid, username, displayName, pfp } = credentials as {
      fid: string;
      signerUuid: string;
      username: string;
      displayName: string;
      pfp: string;
    };

    // Validate required fields
    if (!fid || !signerUuid || !username) {
      throw new Error("Missing required Neynar credentials");
    }

    // SECURITY: Verify credentials with Neynar API to prevent impersonation
    // This ensures the signerUuid actually belongs to the claimed FID
    await verifyNeynarSigner(fid, signerUuid);

    // Check if user already exists by Farcaster ID
    const existingAccount: any = await ctx.runQuery(
      internal.authHelpers.findAccountByFid,
      { fid }
    );

    if (existingAccount) {
      // User exists - update their data
      const userId: any = await ctx.runMutation(
        internal.authHelpers.updateExistingUser,
        {
          userId: existingAccount.userId,
          accountId: existingAccount._id,
          displayName: displayName || username,
          username,
          pfp,
          fid,
          signerUuid,
        }
      );

      return { userId };
    } else {
      // New user - create account
      const userId: any = await ctx.runMutation(
        internal.authHelpers.createNewUser,
        {
          displayName: displayName || username,
          username,
          pfp,
          fid,
          signerUuid,
        }
      );

      return { userId };
    }
  },
});
