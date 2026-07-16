import { db } from "@/lib/db";
import { siteConfig, type SiteConfig } from "@/config/site.config";

// A deeply-editable (non-readonly) version of the site config.
type DeepWritable<T> = { -readonly [K in keyof T]: DeepWritable<T[K]> };
export type EditableSiteConfig = DeepWritable<SiteConfig>;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Deep-merge `override` on top of `base`.
 * - Objects merge key by key (so new fields added to the defaults later
 *   still appear even if the doctor saved settings before they existed).
 * - Arrays and primitives from the override replace the default entirely.
 */
export function mergeConfig<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(base as Record<string, unknown>)) {
      if (key in override) {
        out[key] = mergeConfig(
          (base as Record<string, unknown>)[key],
          override[key]
        );
      }
    }
    return out as T;
  }
  return override as T;
}

/**
 * The theme snapshot the pre-rose-gold admin panel silently saved along with
 * every edit (it had no color controls, so this exact triple can only mean
 * "never customised"). Dropping it lets old installs pick up new defaults.
 */
const LEGACY_DEFAULT_THEME = { primary: "#a34355", primaryDark: "#853a49", accent: "#c9a24b" };

/** Load saved overrides from the database (or null if none saved yet). */
export async function loadSavedSettings(): Promise<Record<string, unknown> | null> {
  try {
    const row = await db.siteSetting.findUnique({ where: { id: "site" } });
    if (!row) return null;
    const parsed: unknown = JSON.parse(row.json);
    if (!isPlainObject(parsed)) return null;
    const theme = parsed.theme;
    if (
      isPlainObject(theme) &&
      theme.primary === LEGACY_DEFAULT_THEME.primary &&
      theme.primaryDark === LEGACY_DEFAULT_THEME.primaryDark &&
      theme.accent === LEGACY_DEFAULT_THEME.accent
    ) {
      delete parsed.theme;
    }
    return parsed;
  } catch (error) {
    console.error("[site-settings] failed to load saved settings", error);
    return null;
  }
}

/** The live site config: defaults merged with whatever the admin saved. */
export async function getSiteSettings(): Promise<EditableSiteConfig> {
  const saved = await loadSavedSettings();
  const merged = mergeConfig(siteConfig, saved);
  // Structured clone strips the `as const` readonly-ness for client use.
  return JSON.parse(JSON.stringify(merged)) as EditableSiteConfig;
}

/** Save a full settings object from the admin panel. */
export async function saveSiteSettings(settings: Record<string, unknown>): Promise<void> {
  const json = JSON.stringify(settings);
  await db.siteSetting.upsert({
    where: { id: "site" },
    create: { id: "site", json },
    update: { json },
  });
}

/** Delete saved overrides so the site returns to the built-in defaults. */
export async function resetSiteSettings(): Promise<void> {
  await db.siteSetting.deleteMany({ where: { id: "site" } });
}
