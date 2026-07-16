"use client";

import { motion } from "framer-motion";

import { useSiteConfig } from "@/components/site-config-context";
import { getIcon } from "@/components/icon-map";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Expertise() {
  const siteConfig = useSiteConfig();
  const section = siteConfig.sections.expertise;
  if (section.visible === false) return null;
  return (
    <section
      id="expertise"
      className="bg-brand/5 py-16 sm:py-20 lg:py-24"
      aria-labelledby="expertise-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-brand/10 text-brand-deep">
            {section.badge}
          </Badge>
          <h2
            id="expertise-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {section.heading}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            {section.subheading}
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
                <Card className="group h-full border-brand/15 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand-deep/5">
                  <CardContent className="flex h-full flex-col gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand-dark transition-colors group-hover:bg-brand-sheen group-hover:text-white">
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
