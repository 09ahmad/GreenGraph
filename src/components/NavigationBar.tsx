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
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 font-mono bg-transparent">
      <span className="text-xl sm:text-2xl font-extrabold tracking-wide font-mono bg-gradient-to-r from-green-400 via-green-600 to-emerald-500 bg-clip-text text-transparent flex items-center gap-2 mb-2 sm:mb-0">
        GreenGraph
      </span>
      <div className="flex-1 flex justify-center w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 font-mono text-base sm:text-base tracking-normal w-full sm:w-auto items-center">
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
      <div className="hidden sm:block" style={{ width: "120px" }} />
    </nav>
  );
} 