"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function About() {
  return (
    <section
      id="about"
      className="bg-background py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-3 -z-10 rounded-3xl bg-emerald-100" />
            <div className="overflow-hidden rounded-3xl border-4 border-white bg-emerald-50 shadow-xl">
              <img
                src={siteConfig.doctor.photo}
                alt={`${siteConfig.doctor.name}, ${siteConfig.doctor.title}`}
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 rounded-2xl border border-border bg-background p-4 shadow-lg sm:-right-5">
              <div className="text-2xl font-extrabold text-emerald-700">
                {siteConfig.doctor.yearsOfExperience}+
              </div>
              <p className="text-xs text-muted-foreground">
                Years Experience
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-800">
              About the Doctor
            </Badge>
            <h2
              id="about-heading"
              className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              {siteConfig.doctor.name}
            </h2>
            <p className="mt-2 text-lg font-semibold text-emerald-800">
              {siteConfig.doctor.title}
            </p>

            <div className="mt-5 space-y-4 text-muted-foreground">
              {siteConfig.doctor.longBio.map((para, i) => (
                <p key={i} className="text-pretty leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <Card className="mt-6 border-emerald-100 bg-emerald-50/50">
              <CardContent className="py-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Qualifications &amp; Training
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {siteConfig.doctor.qualifications.map((q) => (
                    <li
                      key={q}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                <a href="#contact">
                  Book a Consultation
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${siteConfig.contact.phoneHref}`}>
                  <Phone className="size-4" />
                  {siteConfig.contact.phone}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
