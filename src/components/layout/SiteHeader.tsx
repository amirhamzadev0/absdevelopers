"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { useNavigation } from "@/hooks/useNavigation";
import type { NavItem } from "@/models/site";

interface SiteHeaderProps {
  navigation: NavItem[];
  registerInterestHref: string;
}

/** Floating pill header: nav pill · logo pill · Contact button (design: ABS-Header). */
export function SiteHeader({ navigation, registerInterestHref }: SiteHeaderProps) {
  const { open, toggle, close, isActive } = useNavigation();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <nav className="site-nav" aria-label="Main">
          {navigation.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`site-nav__link${isActive(item.href) ? " is-active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={toggle}
        >
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
        </button>

        <BrandLogo />

        <Link href={registerInterestHref} className="btn btn--dark site-header__cta">
          Contact
        </Link>
      </div>

      <div id="mobile-menu" className={`mobile-menu${open ? " is-open" : ""}`} hidden={!open}>
        <nav className="mobile-menu__list" aria-label="Mobile">
          {navigation.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={close}
              className={`mobile-menu__link${isActive(item.href) ? " is-active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
