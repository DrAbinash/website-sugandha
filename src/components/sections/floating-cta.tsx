"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

import { useSiteConfig } from "@/components/site-config-context";

export function FloatingCta() {
  const siteConfig = useSiteConfig();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waHref = `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 lg:hidden"
          aria-label="Quick contact actions"
        >
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/20 transition-transform hover:scale-105"
          >
            <MessageCircle className="size-5" />
          </a>
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            aria-label="Call clinic"
            className="flex size-12 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 transition-transform hover:scale-105"
          >
            <Phone className="size-5" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
