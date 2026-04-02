"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const PAGES_WITH_SIDEBAR = ["/dashboard", "/auditor", "/pitcher", "/kanban"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = PAGES_WITH_SIDEBAR.some((p) => pathname.startsWith(p));

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-[72px] sm:ml-[260px] transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
