import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { QuickNav } from "./QuickNav";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { pathname } = useLocation();
  const hideSidebarOnDashboard = pathname === "/";

  return (
    <div
      className={cn(
        "min-h-screen",
        !hideSidebarOnDashboard && "md:pl-[260px]"
      )}
    >
      {!hideSidebarOnDashboard ? <Sidebar /> : null}
      <div className="flex min-h-screen flex-col">
        <Topbar />
        <QuickNav />
        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
