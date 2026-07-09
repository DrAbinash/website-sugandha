"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { useSiteConfig } from "@/components/site-config-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function Facilities() {
  const siteConfig = useSiteConfig();
  return (
    <section
      id="facilities"
      className="bg-background py-16 sm:py-20 lg:py-24"
      aria-labelledby="facilities-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-800">
            Our Facilities
          </Badge>
          <h2
            id="facilities-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Modern Infrastructure for Accurate Diagnosis
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            A fully equipped diagnostic imaging centre with advanced MRI, CT,
            ultrasound, and digital X-ray facilities for comprehensive care.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.facilities.map((facility, i) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
            >
              <Card className="group h-full overflow-hidden border-emerald-100 p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/10">
                <div className="relative aspect-[4/3] overflow-hidden bg-emerald-100">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <CardContent className="py-4">
                  <h3 className="text-base font-semibold text-foreground">
                    {facility.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
