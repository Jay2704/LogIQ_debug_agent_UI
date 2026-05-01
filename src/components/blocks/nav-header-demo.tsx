import { NavHeader, NavTab } from "@/components/ui/nav-header";

const DEMO_TABS: NavTab[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Dashboard", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Contact", href: "#contact" },
];

export function NavHeaderDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <NavHeader tabs={DEMO_TABS} />
    </div>
  );
}

export default NavHeaderDemo;
