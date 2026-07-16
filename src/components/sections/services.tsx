"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { useSiteConfig } from "@/components/site-config-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function Services() {
  const siteConfig = useSiteConfig();
  const section = siteConfig.sections.services;
  if (section.visible === false) return null;
  const bookingExternal = siteConfig.booking.url.startsWith("http");
  return (
    <section
      id="services"
      className="bg-brand/5 py-16 sm:py-20 lg:py-24"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-brand/10 text-brand-deep">
            {section.badge}
          </Badge>
          <h2
            id="services-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {section.heading}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            {section.subheading}
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.conditions.map((condition, i) => (
            <motion.div
              key={condition}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: (i % 6) * 0.05 }}
            >
              <Card className="h-full border-brand/15 bg-white transition-colors hover:border-brand/40">
                <CardContent className="flex items-center gap-3 py-3.5">
                  <CheckCircle2 className="size-5 shrink-0 text-brand" />
                  <span className="text-sm font-medium text-foreground">
                    {condition}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <Card className="border-0 bg-brand-sheen text-white shadow-lg shadow-brand/25">
            <CardContent className="flex flex-col items-center gap-3 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-base font-semibold">{section.ctaTitle}</p>
                <p className="text-sm text-white/90">{section.ctaText}</p>
              </div>
              <a
                href={siteConfig.booking.url}
                target={bookingExternal ? "_blank" : undefined}
                rel={bookingExternal ? "noreferrer" : undefined}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-brand-deep transition-colors hover:bg-white/90"
              >
                {siteConfig.booking.shortLabel}
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
