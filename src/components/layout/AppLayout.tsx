import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { QuickNav } from "./QuickNav";
import { cn } from "@/lib/utils";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const pageTransition = { duration: 0.35, ease: "easeOut" as const };

export function AppLayout() {
  const { pathname } = useLocation();
  const hideSidebarOnDashboard = pathname === "/";

  return (
    <div
      className={cn(
        "min-h-screen",
        !hideSidebarOnDashboard && "md:pl-[240px]"
      )}
    >
      {!hideSidebarOnDashboard ? <Sidebar /> : null}
      <div className="flex min-h-screen flex-col">
        <Topbar />
        <QuickNav />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={pageTransition}
            className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
