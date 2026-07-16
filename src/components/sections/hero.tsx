"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Ambulance, ShieldCheck, Star } from "lucide-react";

import { useSiteConfig } from "@/components/site-config-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const siteConfig = useSiteConfig();
  const bookingExternal = siteConfig.booking.url.startsWith("http");
  const lastStat = siteConfig.stats[siteConfig.stats.length - 1];

  const trustItems = [
    { icon: ShieldCheck, label: siteConfig.doctor.qualifications.slice(-1)[0] ?? "MD Radiology" },
    { icon: Star, label: `${siteConfig.doctor.yearsOfExperience}+ Years Experience` },
    { icon: ShieldCheck, label: "3T MRI Specialist" },
  ];
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-radial-brand"
      aria-labelledby="hero-heading"
    >
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div
        className="absolute -top-24 -right-24 size-72 rounded-full bg-brand/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-24 size-80 rounded-full bg-gold/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8 lg:py-24">
        {/* Left: text */}
        <div className="order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 gap-1.5 bg-brand/10 text-brand-deep"
            >
              <span className="size-1.5 rounded-full bg-brand" />
              {siteConfig.hospital.shortName}
            </Badge>
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="text-gradient-brand">{siteConfig.doctor.name}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-lg font-semibold text-brand-dark sm:text-xl"
          >
            {siteConfig.doctor.title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {siteConfig.doctor.qualifications.map((q) => (
              <Badge
                key={q}
                variant="outline"
                className="border-brand/25 bg-white/70 text-brand-deep"
              >
                {q}
              </Badge>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            {siteConfig.doctor.tagline}. {siteConfig.doctor.shortBio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="border-0 bg-brand-sheen text-white shadow-lg shadow-brand/30 hover:brightness-110"
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
            <Button asChild size="lg" variant="outline" className="border-brand/30 hover:bg-brand/5">
              <a href="#expertise">
                Explore Expertise
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {trustItems.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-deep/90 sm:text-sm"
              >
                <t.icon className="size-4 text-brand" />
                {t.label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: hero image with floating cards */}
        <div className="relative order-1 md:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto max-w-md md:max-w-none"
          >
            <div className="relative overflow-hidden rounded-3xl border border-brand/15 bg-white shadow-2xl shadow-brand-deep/15">
              <img
                src={siteConfig.hero.image}
                alt={siteConfig.hero.imageAlt}
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] md:aspect-[4/5]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/40 via-transparent to-transparent" />
            </div>

            {/* Floating stat card top-left */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -left-4 top-6 hidden rounded-2xl border border-border/60 bg-background/95 p-4 shadow-xl backdrop-blur-sm sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand-dark">
                  <Ambulance className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {siteConfig.hero.floatingCardTitle}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {siteConfig.hero.floatingCardText}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating stat card bottom-right */}
            {lastStat && (
              <motion.div
                initial={{ opacity: 0, x: 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -right-4 bottom-6 hidden rounded-2xl border border-border/60 bg-background/95 p-4 shadow-xl backdrop-blur-sm sm:block"
              >
                <p className="text-2xl font-extrabold text-brand-dark">
                  {lastStat.value.toLocaleString("en-IN")}
                  <span className="text-base align-top">{lastStat.suffix}</span>
                </p>
                <p className="text-xs text-muted-foreground">{lastStat.label}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
