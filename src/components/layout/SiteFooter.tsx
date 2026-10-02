import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { siteConfig } from "@/config/site";
import type { NavItem, SiteInfo } from "@/models/site";

interface SiteFooterProps {
  site: SiteInfo;
  navigation: NavItem[];
  registerInterestHref: string;
  year: number;
}

export function SiteFooter({ site, navigation, registerInterestHref, year }: SiteFooterProps) {
  const { src, width, height } = siteConfig.footerLogo;
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Image
            className="site-footer__logo"
            src={src}
            alt={site.name}
            width={width}
            height={height}
            sizes="97px"
          />
          <p className="site-footer__tagline">{site.tagline}</p>
          <p className="site-footer__about">{site.description}</p>
          <div className="social-links">
            {site.social.map((link) => (
              <a
                key={link.platform}
                className="social-links__item"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="site-footer__heading">Explore</h2>
          <nav className="site-footer__links" aria-label="Footer">
            {navigation.map((item) => (
              <Link key={item.key} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="site-footer__heading">Contact</h2>
          <address className="site-footer__links">
            <span>
              <span className="site-footer__contact-label">Head Office</span>
              <span className="site-footer__contact-value">
                {site.headOffice.address}, {site.headOffice.city}
              </span>
            </span>
            <span>
              <span className="site-footer__contact-label">Email</span>
              <a className="site-footer__contact-value" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </span>
            <span>
              <span className="site-footer__contact-label">Phone</span>
              <a className="site-footer__contact-value" href={site.phoneHref}>
                {site.phone}
              </a>
            </span>
          </address>
        </div>

        <div className="site-footer__cta">
          <Link className="btn btn--gold" href={registerInterestHref}>
            Register Interest →
          </Link>
        </div>
      </div>

      <div className="container site-footer__bar">
        <span>
          &copy; {year} {site.name}. All rights reserved.
        </span>
      </div>

      <div className="site-footer__wordmark" aria-hidden="true">
        ABS DEVELOPERS
      </div>
    </footer>
  );
}
