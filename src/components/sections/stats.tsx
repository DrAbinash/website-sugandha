"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";

import { useSiteConfig } from "@/components/site-config-context";

function Counter({
  value,
  suffix,
}: {
  value: number;
  suffix?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplay(Math.round(latest).toLocaleString("en-IN"));
      },
    });
    return () => controls.stop();
  }, [inView, value, motionValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export function Stats() {
  const siteConfig = useSiteConfig();
  return (
    <section
      aria-label="Practice statistics"
      className="relative overflow-hidden bg-emerald-700 text-emerald-50"
    >
      <div
        className="absolute inset-0 bg-grid opacity-20"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {siteConfig.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-emerald-100/80 sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
