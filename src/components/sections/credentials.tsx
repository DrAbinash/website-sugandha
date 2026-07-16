"use client";

import { motion } from "framer-motion";

import { useSiteConfig } from "@/components/site-config-context";
import { getIcon } from "@/components/icon-map";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function Credentials() {
  const siteConfig = useSiteConfig();
  const section = siteConfig.sections.credentials;
  if (section.visible === false) return null;
  return (
    <section
      id="credentials"
      className="bg-brand/5 py-16 sm:py-20 lg:py-24"
      aria-labelledby="credentials-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-brand/10 text-brand-deep">
            {section.badge}
          </Badge>
          <h2
            id="credentials-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {section.heading}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            {section.subheading}
          </p>
        </div>

        <div className="relative mt-12">
          {/* Vertical line */}
          <div
            className="absolute left-5 top-0 h-full w-px bg-brand/25 sm:left-1/2 sm:-translate-x-1/2"
            aria-hidden="true"
          />

          <ol className="space-y-6">
            {siteConfig.education.map((edu, i) => {
              const Icon = getIcon(edu.icon);
              const isLeft = i % 2 === 0;
              return (
                <motion.li
                  key={edu.degree}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative pl-14 sm:grid sm:grid-cols-2 sm:gap-8 sm:pl-0"
                >
                  {/* Dot + icon */}
                  <div
                    className="absolute left-0 top-1 flex size-10 items-center justify-center rounded-full border-4 border-white bg-brand-sheen text-white shadow-md sm:left-1/2 sm:-translate-x-1/2"
                    aria-hidden="true"
                  >
                    <Icon className="size-4" />
                  </div>

                  <div
                    className={
                      isLeft
                        ? "sm:col-start-1 sm:text-right sm:pr-8"
                        : "sm:col-start-2 sm:pl-8"
                    }
                  >
                    <Card className="border-brand/15 bg-white">
                      <CardContent className="py-4">
                        <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
                          {edu.degree}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {edu.detail}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
