"use client";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { useMiniApp } from "~/hooks/useMiniApp";
import { useState } from "react";
import HomePage from "~/components/HomePage";
import { Authenticated, Unauthenticated } from "convex/react";
import { NeynarSignInButton } from "~/components/NeynarSignInButton";

// --- Types ---
export enum Tab {
  Home = "home",
  Actions = "actions",
  Context = "context",
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const { isSDKLoaded } = useMiniApp();

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p>Loading SDK...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome to Kaymo!
          </h1>
          <p className="text-lg text-gray-600">a simple Schedule Caster :3</p>
          <p className="text-lg text-gray-600 mb-8">
            Schedule your Farcaster posts in advance
          </p>
          <NeynarSignInButton />
        </div>
      </Unauthenticated>

      <Authenticated>
        {/* Header should be full width */}
        <Header />

        {/* Main content and footer should be centered */}
        <div className="container py-2 pb-20">
          {/* Tab content rendering */}
          {activeTab === Tab.Home && <HomePage />}
          {activeTab === Tab.Actions && <HomePage />}
          {activeTab === Tab.Context && <HomePage />}

          {/* Footer with navigation */}
          <Footer activeTab={activeTab as Tab} setActiveTab={setActiveTab} />
        </div>
      </Authenticated>
    </div>
  );
}
