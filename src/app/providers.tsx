"use client";

import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { type Context } from "@farcaster/miniapp-sdk";
import { useMiniApp } from "~/hooks/useMiniApp";

interface FrameContextType {
  isSDKLoaded: boolean;
  context: Context.MiniAppContext | undefined;
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const FrameContext = React.createContext<FrameContextType | undefined>(undefined);

export function Provider({ children }: { children: React.ReactNode }) {
  const { isSDKLoaded, context } = useMiniApp();

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <ConvexProvider client={convex}>
      <FrameContext.Provider value={{ isSDKLoaded, context }}>
        {children}
      </FrameContext.Provider>
    </ConvexProvider>
  );
} 