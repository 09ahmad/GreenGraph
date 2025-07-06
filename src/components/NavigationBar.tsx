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
    <nav className="w-full flex items-center justify-between px-8 py-4 font-mono bg-transparent">
      <span className="text-2xl font-extrabold tracking-wide font-mono bg-gradient-to-r from-green-400 via-green-600 to-emerald-500 bg-clip-text text-transparent flex items-center gap-2">
        GreenGraph
      </span>
      <div className="flex-1 flex justify-center">
        <div className="flex gap-6 font-mono text-base tracking-normal">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-200 px-1 ${isActive ? "text-green-300" : "text-white/80 hover:text-green-200"}`}
                style={{ fontFamily: 'JetBrains Mono, Fira Mono, Menlo, monospace' }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div style={{ width: "120px" }} />
    </nav>
  );
} 