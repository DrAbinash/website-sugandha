"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MessageCircle,
  Ambulance,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const { toast } = useToast();
  const [status, setStatus] = React.useState<Status>("idle");

  const contactCards = [
    {
      icon: Ambulance,
      title: "Emergency",
      value: siteConfig.contact.emergency,
      href: `tel:${siteConfig.contact.emergencyHref}`,
      note: "24x7 — Emergency imaging",
      accent: "text-red-600 bg-red-50",
    },
    {
      icon: Phone,
      title: "Phone / OPD",
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phoneHref}`,
      note: "Mon–Sat, OPD hours",
      accent: "text-emerald-700 bg-emerald-100",
    },
    {
      icon: Mail,
      title: "Email",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      note: "We reply within 24 hours",
      accent: "text-emerald-700 bg-emerald-100",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: siteConfig.contact.phone,
      href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`,
      note: "Quick queries welcome",
      accent: "text-emerald-700 bg-emerald-100",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.phone || !payload.message) {
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in your name, phone number, and message.",
      });
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      setStatus("success");
      toast({
        title: "Message sent",
        description:
          "Thank you for reaching out. Our team will contact you shortly.",
      });
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Could not send message",
        description:
          "Something went wrong. Please call or WhatsApp us directly.",
      });
    } finally {
      if (status !== "success") {
        setTimeout(() => setStatus("idle"), 2500);
      }
    }
  }

  return (
    <section
      id="contact"
      className="bg-emerald-50/40 py-16 sm:py-20 lg:py-24"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-800">
            Get in Touch
          </Badge>
          <h2
            id="contact-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Book an Appointment
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Send us a message and our team will get back to you to schedule your
            consultation with Dr. Sugandha Priyadarshini.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Contact cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 sm:grid-cols-2 lg:col-span-2"
          >
            {contactCards.map((c) => (
              <Card key={c.title} className="border-emerald-100">
                <CardContent className="flex flex-col gap-2 py-4">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl ${c.accent}`}
                  >
                    <c.icon className="size-5" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.title}
                  </p>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                    className="text-sm font-semibold text-foreground hover:text-emerald-700 hover:underline"
                  >
                    {c.value}
                  </a>
                  <p className="text-xs text-muted-foreground">{c.note}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="border-emerald-100 shadow-sm">
              <CardContent>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" placeholder="Your name" autoComplete="name" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 ..."
                      autoComplete="tel"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="e.g. Spine consultation"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Briefly describe your symptoms or what you'd like to discuss with Dr. Sugandha Priyadarshini."
                      rows={5}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button
                      type="submit"
                      disabled={status === "submitting" || status === "success"}
                      className="w-full bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-70 sm:w-auto"
                    >
                      {status === "submitting" && (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending...
                        </>
                      )}
                      {status === "success" && (
                        <>
                          <CheckCircle2 className="size-4" />
                          Message Sent
                        </>
                      )}
                      {(status === "idle" || status === "error") && (
                        <>
                          <Send className="size-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      By submitting this form you agree to be contacted by our
                      team. Your information is kept confidential.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
