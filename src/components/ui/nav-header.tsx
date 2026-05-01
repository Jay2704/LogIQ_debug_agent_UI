import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface NavTab {
  label: string;
  href: string;
}

interface PositionState {
  left: number;
  width: number;
  opacity: number;
}

interface NavHeaderProps {
  tabs: NavTab[];
  className?: string;
}

interface TabProps {
  label: string;
  href: string;
  tabKey: string;
  isActive: boolean;
  setPosition: (pos: PositionState) => void;
  onActivate: (key: string) => void;
}

function Tab({ label, href, tabKey, isActive, setPosition, onActivate }: TabProps) {
  const ref = useRef<HTMLLIElement>(null);
  const isAnchor = href.startsWith("#");

  const handleMouseEnter = () => {
    if (!ref.current) return;
    const { width } = ref.current.getBoundingClientRect();
    setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
    onActivate(tabKey);
  };

  const linkClass = cn(
    "block px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-150 md:px-5 md:py-2.5 md:text-sm",
    isActive ? "text-surface-975" : "text-slate-400"
  );

  return (
    <li ref={ref} onMouseEnter={handleMouseEnter} className="relative z-10 cursor-pointer">
      {isAnchor ? (
        <a href={href} className={linkClass}>
          {label}
        </a>
      ) : (
        <Link to={href} className={linkClass}>
          {label}
        </Link>
      )}
    </li>
  );
}

function Cursor({ position }: { position: PositionState }) {
  return (
    <motion.li
      animate={{ left: position.left, width: position.width, opacity: position.opacity }}
      aria-hidden
      className="pointer-events-none absolute z-0 h-7 rounded-full bg-cyber md:h-10"
    />
  );
}

export function NavHeader({ tabs, className }: NavHeaderProps) {
  const [position, setPosition] = useState<PositionState>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleMouseLeave = () => {
    setPosition((pv) => ({ ...pv, opacity: 0 }));
    setActiveKey(null);
  };

  return (
    <ul
      className={cn(
        "relative flex w-fit list-none items-center rounded-full border border-cyber/[0.2] bg-surface-975 p-1",
        className
      )}
      onMouseLeave={handleMouseLeave}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.href}
          tabKey={tab.href}
          label={tab.label}
          href={tab.href}
          isActive={activeKey === tab.href}
          setPosition={setPosition}
          onActivate={setActiveKey}
        />
      ))}
      <Cursor position={position} />
    </ul>
  );
}

export default NavHeader;
