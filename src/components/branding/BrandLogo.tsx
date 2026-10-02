import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function BrandLogo() {
  const { src, width, height } = siteConfig.logo;
  return (
    <Link href="/" className="brand-logo" aria-label={`${siteConfig.name} — home`}>
      <Image src={src} alt={siteConfig.name} width={width} height={height} preload sizes="96px" />
    </Link>
  );
}
