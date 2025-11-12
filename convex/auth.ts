import { convexAuth } from "@convex-dev/auth/server";
import { Neynar } from "./authNeynar";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Neynar],
});
