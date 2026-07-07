"use client";

import { motion } from "framer-motion";

import { siteConfig } from "@/config/site.config";
import { getIcon } from "@/components/icon-map";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Expertise() {
  return (
    <section
      id="expertise"
      className="bg-emerald-50/40 py-16 sm:py-20 lg:py-24"
      aria-labelledby="expertise-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-800">
            Areas of Expertise
          </Badge>
          <h2
            id="expertise-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Specialized Neurosurgical Care
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Comprehensive expertise across brain, spine, and neurotrauma —
            delivered with precision and compassion.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.specializations.map((spec, i) => {
            const Icon = getIcon(spec.icon);
            return (
              <motion.div
                key={spec.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              >
                <Card className="group h-full border-emerald-100 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5">
                  <CardContent className="flex h-full flex-col gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {spec.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {spec.description}
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
