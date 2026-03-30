import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { QuickNav } from "./QuickNav";

export function AppLayout() {
  return (
    <div className="min-h-screen md:pl-[260px]">
      <Sidebar />
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
