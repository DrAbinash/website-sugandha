"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function Services() {
  return (
    <section
      id="services"
      className="bg-emerald-50/40 py-16 sm:py-20 lg:py-24"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-800">
            Conditions Treated
          </Badge>
          <h2
            id="services-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Comprehensive Neurosurgical Services
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            From complex brain tumours to chronic back pain — expert diagnosis
            and surgical care for the full spectrum of neurosurgical conditions.
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
              <Card className="h-full border-emerald-100 transition-colors hover:border-emerald-300">
                <CardContent className="flex items-center gap-3 py-3.5">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
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
          <Card className="border-emerald-200 bg-emerald-700 text-emerald-50">
            <CardContent className="flex flex-col items-center gap-3 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-base font-semibold">
                  Not sure if your condition needs a neurosurgeon?
                </p>
                <p className="text-sm text-emerald-100/90">
                  Get an honest, no-pressure consultation from Dr. Abinash Kumar.
                </p>
              </div>
              <a
                href="#contact"
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
              >
                Book a Consultation
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
