"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Transactions", href: "/transactions" },
  { name: "Categories", href: "/categories" },
  { name: "Analytics", href: "/analytics" },
];

export function NavigationBar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border card-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-smooth">
              <span className="text-lg font-bold text-primary-foreground">GG</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:inline">
              GreenGraph
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-smooth ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-smooth ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.name.split(" ")[0]}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
 