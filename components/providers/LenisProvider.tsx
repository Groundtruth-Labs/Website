"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** Routes that use their own inner-scroll layout — skip Lenis */
const SKIP_LENIS = ["/admin", "/dashboard"];

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Don't hijack scroll on layouts that manage their own overflow
    if (SKIP_LENIS.some((prefix) => pathname.startsWith(prefix))) return;

    const lenis = new Lenis({
      lerp: 0.09,       // proportional easing — settles ~0.6s regardless of distance
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
