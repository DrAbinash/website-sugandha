"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Phone, Calendar, Ambulance, ChevronRight } from "lucide-react";

import { useSiteConfig } from "@/components/site-config-context";
import { useVisibleNav } from "@/lib/visible-nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-9", className)}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" fill="var(--brand)" />
      <path
        d="M18 13c-3.2 0-5.5 2.4-5.5 5.3 0 1 .3 1.9.8 2.7-1.6.9-2.6 2.5-2.6 4.4 0 2.7 2.1 4.9 4.8 5 .2 2.4 2.3 4.4 4.8 4.4 1.7 0 3.2-.9 4-2.2.8 1.3 2.3 2.2 4 2.2 2.5 0 4.6-2 4.8-4.4 2.7-.1 4.8-2.3 4.8-5 0-1.9-1-3.5-2.6-4.4.5-.8.8-1.7.8-2.7 0-2.9-2.3-5.3-5.5-5.3-1.8 0-3.4.8-4.4 2.1-1-1.3-2.6-2.1-4.4-2.1h-1.2c-1.8 0-3.4.8-4.4 2.1-.6-.8-1.5-1.4-2.4-1.8"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M24 16.5v15M17 22h14M19 27.5h10"
        stroke="var(--brand)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar() {
  const siteConfig = useSiteConfig();
  const nav = useVisibleNav();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bookingExternal = siteConfig.booking.url.startsWith("http");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border/60"
          : "bg-background/70 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#home"
          className="flex items-center gap-2.5 group"
          aria-label={`${siteConfig.doctor.name} — home`}
        >
          <span className="transition-transform group-hover:scale-105">
            <BrandLogo />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">
              {siteConfig.doctor.name}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-dark sm:text-xs">
              {siteConfig.doctor.title}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-brand/10 hover:text-brand-deep"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href={`tel:${siteConfig.contact.emergencyHref}`}>
              <Ambulance className="size-4 text-red-600" />
              <span>Emergency</span>
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="border-0 bg-brand-sheen text-white shadow-md shadow-brand/25 hover:brightness-110"
          >
            <a
              href={siteConfig.booking.url}
              target={bookingExternal ? "_blank" : undefined}
              rel={bookingExternal ? "noreferrer" : undefined}
            >
              <Calendar className="size-4" />
              <span>{siteConfig.booking.label}</span>
            </a>
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="icon" variant="outline" aria-label="Call emergency">
            <a href={`tel:${siteConfig.contact.emergencyHref}`}>
              <Phone className="size-4 text-red-600" />
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex items-center gap-2.5 border-b px-5 pb-4 pt-1">
                <BrandLogo />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-foreground">
                    {siteConfig.doctor.name}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-brand-dark">
                    {siteConfig.doctor.title}
                  </span>
                </div>
              </div>
              <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Mobile navigation">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-brand/10 hover:text-brand-deep"
                      >
                        {item.label}
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </Link>
                    </SheetClose>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                <Button asChild variant="outline">
                  <a href={`tel:${siteConfig.contact.emergencyHref}`}>
                    <Ambulance className="size-4 text-red-600" />
                    Emergency: {siteConfig.contact.emergency}
                  </a>
                </Button>
                <SheetClose asChild>
                  <Button
                    asChild
                    className="border-0 bg-brand-sheen text-white shadow-md shadow-brand/25 hover:brightness-110"
                  >
                    <a
                      href={siteConfig.booking.url}
                      target={bookingExternal ? "_blank" : undefined}
                      rel={bookingExternal ? "noreferrer" : undefined}
                    >
                      <Calendar className="size-4" />
                      {siteConfig.booking.label}
                    </a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
