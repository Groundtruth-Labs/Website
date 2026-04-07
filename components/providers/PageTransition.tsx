"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // initial={false} on AnimatePresence suppresses the wrapper's enter animation
    // on first render without propagating to descendant motion elements — so hero,
    // services, and other section animations still fire normally on mount.
    <AnimatePresence initial={false} mode="sync">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4, scale: 0.995 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
