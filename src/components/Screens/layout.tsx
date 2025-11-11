"use client";

import Button from "~/components/Button";
import { LogOut } from "lucide-react";
import { useUserStore } from "~/store/userStore";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ScreenLayout = ({ children }: Props) => {
  const clearUser = useUserStore((state) => state.clearUser);

  const handleSignout = () => {
    clearUser();
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen text-white bg-gradient-to-b from-[#122744] to-[#0F1F36]">
      <header className="flex justify-between items-center p-5">
        <div className="flex items-center">
          <Image
            src="/logos/wownar-logo.svg"
            width={60}
            height={60}
            alt="SimpleCaster Logo"
          />
          <h1 className="text-xl font-extralight font-bold ml-3">Kaymo</h1>
        </div>
          <div className="flex items-center">
            <Button
              onClick={handleSignout}
              title="Sign Out"
              icon={<LogOut height="20px" width="20px" />}
            />
          </div>
      </header>
      {children}
      <footer className="flex flex-col justify-center items-center gap-y-6 text-center p-4">
        <Link
          href="https://docs.neynar.com/docs/how-to-let-users-connect-farcaster-accounts-with-write-access-for-free-using-sign-in-with-neynar-siwn"
          target="_blank"
        >
          Connect Farcaster accounts for free using&nbsp;
          <span className="font-bold">Sign in with Neynar</span>
        </Link>
        <Link
          href="https://github.com/neynarxyz/farcaster-examples/tree/main/wownar"
          target="_blank"
        >
          Github Repo -&gt; <span className="font-bold">Wownar</span>
        </Link>
      </footer>
    </div>
  );
};

export default ScreenLayout;
