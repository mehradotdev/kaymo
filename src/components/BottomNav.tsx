'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const currentPath = usePathname();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/scheduled", label: "Scheduled", icon: "📅" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentPath === item.path
                ? "text-primary font-semibold"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
