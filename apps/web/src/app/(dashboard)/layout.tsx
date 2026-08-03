"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookie } from "@/app/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Clear the HTTP-only cookie using our server action
    await clearAuthCookie();
    router.push("/login");
  };

  const navItems = [
    { name: "Discovery", icon: "explore", href: "/discovery" },
    { name: "Intelligence", icon: "psychology", href: "/intelligence" },
    { name: "Prospects", icon: "groups", href: "/prospects" },
    { name: "Settings", icon: "settings", href: "/settings" },
  ];

  return (
    <>
      {/* Sidebar Navigation */}
      <aside className="w-[240px] flex-shrink-0 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col z-40 hidden md:flex">
        {/* Brand Header */}
        <div className="h-16 px-gutter flex items-center gap-3">
          <Image src="/logo.png" alt="LeadForge AI Logo" width={32} height={32} className="object-contain" />
          <span className="font-display text-[20px] font-extrabold tracking-tight text-white">LeadForge AI</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="px-4 pb-2">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Main Menu</span>
          </div>
          
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded group transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary border-l-2 border-primary" 
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <span className={`font-body-md ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-gutter mt-auto">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                <span className="font-label-sm text-on-surface-variant">Credits</span>
              </div>
              <span className="font-label-sm text-white">4,208</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary w-2/3 h-full shadow-[0_0_8px_rgba(129,140,248,0.5)]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-background">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-margin-desktop border-b border-outline-variant/10 bg-surface/50 backdrop-blur-xl z-30 shrink-0">
          <div className="flex items-center gap-gutter">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-label-sm text-outline">
              <span className="hover:text-primary cursor-pointer transition-colors uppercase tracking-wider">Home</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold uppercase tracking-wider">Dashboard</span>
            </nav>
            
            {/* Global Search Input */}
            <div className="relative hidden lg:block ml-8">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-outline text-md">search</span>
              </div>
              <input 
                className="bg-surface-container-low border border-outline-variant/20 text-body-md py-2 pl-10 pr-4 rounded-lg w-80 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white" 
                placeholder="Search prospects..." 
                type="text" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value.trim();
                    if (val) {
                      router.push(`/discovery?search=${encodeURIComponent(val)}`);
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-gutter">
            <button className="relative p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
            </button>
            <div className="h-8 w-px bg-outline-variant/10"></div>
            <div className="flex items-center gap-3 group cursor-pointer" onClick={handleLogout}>
              <div className="flex flex-col items-end">
                <span className="font-label-sm text-label-sm text-white">Admin User</span>
                <span className="text-xs text-outline group-hover:text-primary transition-colors">Logout</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/20 overflow-hidden">
                <span className="material-symbols-outlined text-outline">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </main>
    </>
  );
}
