"use client";

import { motion } from "framer-motion";

import { siteConfig } from "@/config/site.config";
import { getIcon } from "@/components/icon-map";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Highlights() {
  return (
    <section
      id="highlights"
      className="bg-background py-16 sm:py-20 lg:py-24"
      aria-labelledby="highlights-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-800">
            Why Choose Us
          </Badge>
          <h2
            id="highlights-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Care That Puts Patients First
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Every decision is guided by safety, precision, and the patient&apos;s
            long-term wellbeing.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.highlights.map((h, i) => {
            const Icon = getIcon(h.icon);
            return (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Card className="h-full border-emerald-100 bg-gradient-to-b from-white to-emerald-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/5">
                  <CardContent className="flex h-full flex-col gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-emerald-700 text-white shadow-md shadow-emerald-700/20">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {h.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {h.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
