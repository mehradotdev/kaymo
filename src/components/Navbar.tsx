import { Authenticated } from "convex/react";
import { SignOutButton } from "~/components/SignOutButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
      <Link href="/" className="text-xl font-semibold text-primary">
        Kaymo - a Schedule Caster
      </Link>
      <div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </div>
    </header>
  );
}
