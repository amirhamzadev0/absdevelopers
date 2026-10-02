"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/** Mobile menu state: closes on route change, Escape and desktop resize; locks page scroll while open. */
export function useNavigation(desktopQuery = "(min-width: 992px)") {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);

  // Close when the route changes (adjusting state during render, not in an effect).
  if (open && openedOn !== pathname) setOpen(false);

  const toggle = useCallback(() => {
    setOpenedOn(pathname);
    setOpen((value) => !value);
  }, [pathname]);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia(desktopQuery);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onMedia = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    media.addEventListener("change", onMedia);
    document.body.classList.add("is-menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onMedia);
      document.body.classList.remove("is-menu-open");
    };
  }, [open, desktopQuery]);

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  return { open, toggle, close, isActive };
}
