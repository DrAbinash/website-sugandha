"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, Ambulance, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function Location() {
  const contactCards = [
    {
      icon: MapPin,
      title: "Visit Us",
      lines: [
        siteConfig.hospital.address.line1,
        siteConfig.hospital.address.line2,
        siteConfig.hospital.address.line3,
      ],
      href: siteConfig.hospital.mapLinkUrl,
      cta: "Open in Google Maps",
    },
    {
      icon: Phone,
      title: "Call / OPD",
      lines: [siteConfig.contact.phone, "Mon–Sat, OPD hours"],
      href: `tel:${siteConfig.contact.phoneHref}`,
      cta: "Call now",
    },
    {
      icon: Ambulance,
      title: "Emergency 24×7",
      lines: [siteConfig.contact.emergency, "Head & spine injury"],
      href: `tel:${siteConfig.contact.emergencyHref}`,
      cta: "Call emergency",
    },
  ];

  return (
    <section
      id="location"
      className="bg-background py-16 sm:py-20 lg:py-24"
      aria-labelledby="location-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-800">
            Location &amp; Hours
          </Badge>
          <h2
            id="location-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Find Us in Deoghar
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Conveniently located in Castairs Town, Deoghar — serving the people
            of Jharkhand with round-the-clock neurotrauma care.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-emerald-100 shadow-sm"
          >
            <iframe
              title="Map showing the location of Hope NeuroTrauma Hospital, Deoghar"
              src={siteConfig.hospital.mapEmbedUrl}
              className="h-72 w-full sm:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </motion.div>

          {/* Contact cards + timings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {contactCards.map((c) => (
                <Card key={c.title} className="border-emerald-100">
                  <CardContent className="flex flex-col gap-2 py-4">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <c.icon className="size-4" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {c.title}
                    </p>
                    <div className="space-y-0.5">
                      {c.lines.map((line) => (
                        <p
                          key={line}
                          className="text-xs leading-snug text-muted-foreground"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      {c.cta}
                      <ArrowUpRight className="size-3" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-emerald-100">
              <CardContent className="py-4">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="size-4 text-emerald-700" />
                  <p className="text-sm font-semibold text-foreground">
                    OPD Timings
                  </p>
                </div>
                <ul className="divide-y divide-border/60 text-sm">
                  {siteConfig.timings.map((t) => (
                    <li
                      key={t.day}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-muted-foreground">{t.day}</span>
                      <span
                        className={
                          t.hours.toLowerCase().includes("closed")
                            ? "font-medium text-red-600"
                            : "font-medium text-foreground"
                        }
                      >
                        {t.hours}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                  >
                    <Mail className="size-3.5" />
                    {siteConfig.contact.email}
                  </a>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                  >
                    <MessageCircle className="size-3.5" />
                    WhatsApp Us
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
