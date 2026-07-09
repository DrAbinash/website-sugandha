"use client";

import * as React from "react";
import { siteConfig as defaultConfig, type SiteConfig } from "@/config/site.config";

/**
 * Makes the live site configuration (defaults merged with anything the
 * doctor saved in the /admin panel) available to every section component.
 *
 * If no provider is present (should not happen), the built-in defaults
 * from site.config.ts are used, so the site can never render empty.
 */

type LiveSiteConfig = SiteConfig;

const SiteConfigContext = React.createContext<LiveSiteConfig>(defaultConfig);

export function SiteConfigProvider({
  value,
  children,
}: {
  value: LiveSiteConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): LiveSiteConfig {
  return React.useContext(SiteConfigContext);
}
