"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Ambulance,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
} from "lucide-react";

import { siteConfig } from "@/config/site.config";

function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" fill="white" />
      <path
        d="M18 13c-3.2 0-5.5 2.4-5.5 5.3 0 1 .3 1.9.8 2.7-1.6.9-2.6 2.5-2.6 4.4 0 2.7 2.1 4.9 4.8 5 .2 2.4 2.3 4.4 4.8 4.4 1.7 0 3.2-.9 4-2.2.8 1.3 2.3 2.2 4 2.2 2.5 0 4.6-2 4.8-4.4 2.7-.1 4.8-2.3 4.8-5 0-1.9-1-3.5-2.6-4.4.5-.8.8-1.7.8-2.7 0-2.9-2.3-5.3-5.5-5.3-1.8 0-3.4.8-4.4 2.1-1-1.3-2.6-2.1-4.4-2.1h-1.2c-1.8 0-3.4.8-4.4 2.1-.6-.8-1.5-1.4-2.4-1.8"
        fill="oklch(0.51 0.13 162)"
        opacity="0.95"
      />
      <path
        d="M24 16.5v15M17 22h14M19 27.5h10"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Footer() {
  const socialLinks = [
    { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
    { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
    { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
    { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="mt-auto bg-emerald-800 text-emerald-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <BrandLogo className="size-9" />
              <div className="leading-tight">
                <p className="text-sm font-bold">{siteConfig.doctor.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-emerald-200">
                  {siteConfig.doctor.title}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/80">
              {siteConfig.hospital.tagline}
            </p>
            <p className="mt-3 text-xs text-emerald-100/70">
              {siteConfig.hospital.name}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-emerald-100/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Specializations */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Specializations
            </p>
            <ul className="mt-4 space-y-2">
              {siteConfig.specializations.map((s) => (
                <li key={s.title}>
                  <Link
                    href="#expertise"
                    className="text-sm text-emerald-100/80 transition-colors hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-200" />
                <span className="text-emerald-100/80">
                  {siteConfig.hospital.address.full}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-emerald-200" />
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  className="text-emerald-100/80 transition-colors hover:text-white"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Ambulance className="mt-0.5 size-4 shrink-0 text-red-200" />
                <a
                  href={`tel:${siteConfig.contact.emergencyHref}`}
                  className="text-emerald-100/80 transition-colors hover:text-white"
                >
                  {siteConfig.contact.emergency} (24×7)
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-emerald-200" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all text-emerald-100/80 transition-colors hover:text-white"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex size-8 items-center justify-center rounded-full bg-emerald-700/60 text-emerald-100 transition-colors hover:bg-emerald-600 hover:text-white"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-emerald-700/60 pt-6 text-xs text-emerald-100/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.hospital.name}. All rights
            reserved.
          </p>
          <p>
            Designed for {siteConfig.doctor.name}, {siteConfig.doctor.title}
          </p>
        </div>
      </div>
    </footer>
  );
}
