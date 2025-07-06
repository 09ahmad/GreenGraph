"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Transactions", href: "/transactions" },
  { name: "Categories", href: "/categories" },
  { name: "Analytics", href: "/analytics" },
];

export function NavigationBar() {
  const pathname = usePathname();
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-black font-mono">
      {/* Left: Website Name */}
      <span className="text-xl font-bold tracking-wide font-mono" style={{ color: '#14532d' }}>GreenGraph</span>
      {/* Center: Navigation Links */}
      <div className="flex-1 flex justify-center">
        <div className="flex gap-4 font-mono">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm px-1 transition-colors duration-150 ${isActive ? "underline underline-offset-8 font-bold text-white" : "opacity-80 hover:opacity-100 text-white"}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      {/* Right: Empty for now (for future use) */}
      <div style={{ width: "120px" }} />
    </nav>
  );
} 