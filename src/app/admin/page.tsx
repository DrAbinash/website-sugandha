"use client";

import * as React from "react";
import {
  Loader2,
  Save,
  LogOut,
  RotateCcw,
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { type EditableSiteConfig } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  TextField,
  NumberField,
  TextAreaField,
  IconPicker,
  ListItemCard,
  AddButton,
  ColorField,
  SwitchField,
} from "@/components/admin/field-helpers";

/** One-click color schemes for the whole website. */
const THEME_PRESETS = [
  { name: "Rose Gold", primary: "#b76e79", primaryDark: "#96525d", accent: "#d4a373" },
  { name: "Emerald", primary: "#047857", primaryDark: "#065f46", accent: "#c9a24b" },
  { name: "Ocean Blue", primary: "#1d6fa5", primaryDark: "#155a87", accent: "#e0b96a" },
  { name: "Royal Purple", primary: "#7c5295", primaryDark: "#63407a", accent: "#d4a373" },
  { name: "Teal", primary: "#0d9488", primaryDark: "#0f766e", accent: "#d4a373" },
  { name: "Burgundy", primary: "#8d3b4b", primaryDark: "#722f3d", accent: "#c9a24b" },
] as const;

/** The homepage sections that can be renamed / hidden from the admin panel. */
const SECTION_META: {
  key: keyof EditableSiteConfig["sections"];
  name: string;
  note?: string;
}[] = [
  { key: "stats", name: "Statistics band", note: "The numbers strip under the hero" },
  { key: "about", name: "About the doctor" },
  { key: "expertise", name: "Areas of expertise" },
  { key: "highlights", name: "Why choose us" },
  { key: "services", name: "Investigations / services" },
  { key: "facilities", name: "Facilities photo cards" },
  { key: "credentials", name: "Education & credentials" },
  { key: "location", name: "Location, map & hours" },
  { key: "contact", name: "Contact & appointment form" },
];

type AuthState = "checking" | "login" | "ready";

export default function AdminPage() {
  const [authState, setAuthState] = React.useState<AuthState>("checking");
  const [usingDefaultPassword, setUsingDefaultPassword] = React.useState(false);
  const [settings, setSettings] = React.useState<EditableSiteConfig | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const loadSettings = React.useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    if (!res.ok) {
      setAuthState("login");
      return;
    }
    const data = (await res.json()) as { ok: boolean; settings: EditableSiteConfig };
    setSettings(data.settings);
    setAuthState("ready");
  }, []);

  React.useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/login");
        const data = (await res.json()) as {
          authenticated: boolean;
          usingDefaultPassword: boolean;
        };
        setUsingDefaultPassword(data.usingDefaultPassword);
        if (data.authenticated) {
          await loadSettings();
        } else {
          setAuthState("login");
        }
      } catch {
        setAuthState("login");
      }
    })();
  }, [loadSettings]);

  /** Immutable helper: clone settings, let the caller edit the clone, store it. */
  function mutate(edit: (draft: EditableSiteConfig) => void) {
    setSettings((prev) => {
      if (!prev) return prev;
      const draft = structuredClone(prev);
      edit(draft);
      return draft;
    });
    setSaveMessage(null);
  }

  async function handleSave() {
    if (!settings || saving) return;
    setSaving(true);
    setErrorMessage(null);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMessage(data.error || "Could not save. Please try again.");
        return;
      }
      setSaveMessage("Saved! The website is updated — refresh it to see the changes.");
    } catch {
      setErrorMessage("Could not save. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (
      !window.confirm(
        "This will remove ALL your edits and return the website to its original content. Photos you uploaded stay saved but will no longer be shown. Continue?"
      )
    ) {
      return;
    }
    setErrorMessage(null);
    const res = await fetch("/api/admin/settings", { method: "DELETE" });
    if (res.ok) {
      await loadSettings();
      setSaveMessage("Website returned to original content.");
    } else {
      setErrorMessage("Could not reset. Please try again.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setSettings(null);
    setAuthState("login");
  }

  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  if (authState === "login") {
    return <LoginScreen onSuccess={loadSettings} usingDefaultPassword={usingDefaultPassword} />;
  }

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-muted/40 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-bold">Website Settings</h1>
            <p className="text-xs text-muted-foreground">
              Edit the content of {settings.doctor.name}&apos;s website
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 size-4" />
                View website
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1.5 size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {usingDefaultPassword && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              You are using the default admin password. Please set your own by adding an{" "}
              <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code> value in{" "}
              <code className="rounded bg-amber-100 px-1">docker-compose.yml</code> on the Synology.
            </p>
          </div>
        )}

        <Tabs defaultValue="doctor">
          <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="doctor">Doctor &amp; About</TabsTrigger>
            <TabsTrigger value="contact">Contact &amp; Hours</TabsTrigger>
            <TabsTrigger value="hospital">Hospital &amp; Map</TabsTrigger>
            <TabsTrigger value="services">Services &amp; Expertise</TabsTrigger>
            <TabsTrigger value="photos">Photos &amp; Facilities</TabsTrigger>
            <TabsTrigger value="more">Stats &amp; Social</TabsTrigger>
            <TabsTrigger value="design">Design &amp; Layout</TabsTrigger>
          </TabsList>

          {/* ───────────────────────── Doctor & About ───────────────────────── */}
          <TabsContent value="doctor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Doctor details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Full name (with Dr.)"
                  value={settings.doctor.name}
                  onChange={(v) => mutate((d) => (d.doctor.name = v))}
                />
                <TextField
                  label="Title"
                  value={settings.doctor.title}
                  onChange={(v) => mutate((d) => (d.doctor.title = v))}
                  hint="For example: Consultant Radiologist"
                />
                <TextField
                  label="Qualifications (separate with commas)"
                  value={settings.doctor.qualifications.join(", ")}
                  onChange={(v) =>
                    mutate(
                      (d) =>
                        (d.doctor.qualifications = v
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean))
                    )
                  }
                  hint="For example: MBBS, MD (Radiology)"
                />
                <NumberField
                  label="Years of experience"
                  value={settings.doctor.yearsOfExperience}
                  onChange={(v) => mutate((d) => (d.doctor.yearsOfExperience = v))}
                />
                <div className="sm:col-span-2">
                  <TextField
                    label="Tagline (one line under the name)"
                    value={settings.doctor.tagline}
                    onChange={(v) => mutate((d) => (d.doctor.tagline = v))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextAreaField
                    label="Short introduction (shown at the top of the website)"
                    value={settings.doctor.shortBio}
                    onChange={(v) => mutate((d) => (d.doctor.shortBio = v))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload
                    label="Doctor's photo"
                    value={settings.doctor.photo}
                    onChange={(url) => mutate((d) => (d.doctor.photo = url))}
                    hint="A clear portrait photo works best. JPG or PNG, up to 8 MB."
                    aspect="aspect-[3/4]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">About section (paragraphs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settings.doctor.longBio.map((para, i) => (
                  <ListItemCard
                    key={i}
                    title={`Paragraph ${i + 1}`}
                    onRemove={() => mutate((d) => d.doctor.longBio.splice(i, 1))}
                  >
                    <TextAreaField
                      label=""
                      rows={4}
                      value={para}
                      onChange={(v) => mutate((d) => (d.doctor.longBio[i] = v))}
                    />
                  </ListItemCard>
                ))}
                <AddButton
                  label="Add paragraph"
                  onClick={() => mutate((d) => d.doctor.longBio.push(""))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Education / degrees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settings.education.map((edu, i) => (
                  <ListItemCard
                    key={i}
                    title={edu.degree || `Degree ${i + 1}`}
                    onRemove={() => mutate((d) => d.education.splice(i, 1))}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField
                        label="Degree"
                        value={edu.degree}
                        onChange={(v) => mutate((d) => (d.education[i].degree = v))}
                      />
                      <IconPicker
                        label="Icon"
                        value={edu.icon}
                        onChange={(v) => mutate((d) => (d.education[i].icon = v))}
                      />
                    </div>
                    <TextField
                      label="Description"
                      value={edu.detail}
                      onChange={(v) => mutate((d) => (d.education[i].detail = v))}
                    />
                  </ListItemCard>
                ))}
                <AddButton
                  label="Add degree"
                  onClick={() =>
                    mutate((d) =>
                      d.education.push({ degree: "", detail: "", icon: "GraduationCap" })
                    )
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───────────────────────── Contact & Hours ───────────────────────── */}
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Phone, email &amp; WhatsApp</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Phone (as shown on website)"
                  value={settings.contact.phone}
                  onChange={(v) => mutate((d) => (d.contact.phone = v))}
                  hint="For example: +91 98765 43210"
                />
                <TextField
                  label="Phone (digits only, for the call button)"
                  value={settings.contact.phoneHref}
                  onChange={(v) => mutate((d) => (d.contact.phoneHref = v))}
                  hint="For example: +919876543210 — no spaces"
                />
                <TextField
                  label="Emergency number (as shown)"
                  value={settings.contact.emergency}
                  onChange={(v) => mutate((d) => (d.contact.emergency = v))}
                />
                <TextField
                  label="Emergency number (digits only)"
                  value={settings.contact.emergencyHref}
                  onChange={(v) => mutate((d) => (d.contact.emergencyHref = v))}
                />
                <TextField
                  label="Email"
                  value={settings.contact.email}
                  onChange={(v) => mutate((d) => (d.contact.email = v))}
                />
                <TextField
                  label="WhatsApp number (digits only)"
                  value={settings.contact.whatsapp}
                  onChange={(v) => mutate((d) => (d.contact.whatsapp = v))}
                  hint="For example: +919876543210"
                />
                <div className="sm:col-span-2">
                  <TextField
                    label="WhatsApp pre-filled message"
                    value={settings.contact.whatsappMessage}
                    onChange={(v) => mutate((d) => (d.contact.whatsappMessage = v))}
                    hint="This message appears automatically when a patient taps the WhatsApp button."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">OPD timings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settings.timings.map((t, i) => (
                  <div key={i} className="grid gap-3 sm:grid-cols-2">
                    <TextField
                      label={i === 0 ? "Day" : ""}
                      value={t.day}
                      onChange={(v) => mutate((d) => (d.timings[i].day = v))}
                    />
                    <TextField
                      label={i === 0 ? "Hours" : ""}
                      value={t.hours}
                      onChange={(v) => mutate((d) => (d.timings[i].hours = v))}
                      hint={i === 0 ? 'Write "Closed" for holidays' : undefined}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───────────────────────── Hospital & Map ───────────────────────── */}
          <TabsContent value="hospital" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hospital / centre details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Full name"
                  value={settings.hospital.name}
                  onChange={(v) => mutate((d) => (d.hospital.name = v))}
                />
                <TextField
                  label="Short name"
                  value={settings.hospital.shortName}
                  onChange={(v) => mutate((d) => (d.hospital.shortName = v))}
                />
                <div className="sm:col-span-2">
                  <TextField
                    label="Tagline"
                    value={settings.hospital.tagline}
                    onChange={(v) => mutate((d) => (d.hospital.tagline = v))}
                  />
                </div>
                <TextField
                  label="Address line 1"
                  value={settings.hospital.address.line1}
                  onChange={(v) => mutate((d) => (d.hospital.address.line1 = v))}
                />
                <TextField
                  label="Address line 2"
                  value={settings.hospital.address.line2}
                  onChange={(v) => mutate((d) => (d.hospital.address.line2 = v))}
                />
                <TextField
                  label="Address line 3 (city, state, PIN)"
                  value={settings.hospital.address.line3}
                  onChange={(v) => mutate((d) => (d.hospital.address.line3 = v))}
                />
                <TextField
                  label="Country"
                  value={settings.hospital.address.country}
                  onChange={(v) => mutate((d) => (d.hospital.address.country = v))}
                />
                <div className="sm:col-span-2">
                  <TextField
                    label="Full address in one line (used for Google search info)"
                    value={settings.hospital.address.full}
                    onChange={(v) => mutate((d) => (d.hospital.address.full = v))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Google Maps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextAreaField
                  label="Map embed link (the map shown on the website)"
                  value={settings.hospital.mapEmbedUrl}
                  onChange={(v) => mutate((d) => (d.hospital.mapEmbedUrl = v))}
                  rows={2}
                  hint='Tip: use https://www.google.com/maps?q=YOUR+PLACE+NAME&output=embed — replace spaces with +'
                />
                <TextAreaField
                  label='Map link ("Open in Google Maps" button)'
                  value={settings.hospital.mapLinkUrl}
                  onChange={(v) => mutate((d) => (d.hospital.mapLinkUrl = v))}
                  rows={2}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───────────────────── Services & Expertise ───────────────────── */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Areas of expertise (the 6 big cards)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settings.specializations.map((spec, i) => (
                  <ListItemCard
                    key={i}
                    title={spec.title || `Service ${i + 1}`}
                    onRemove={() => mutate((d) => d.specializations.splice(i, 1))}
                    onMoveUp={
                      i > 0
                        ? () =>
                            mutate((d) => {
                              const [item] = d.specializations.splice(i, 1);
                              d.specializations.splice(i - 1, 0, item);
                            })
                        : undefined
                    }
                    onMoveDown={
                      i < settings.specializations.length - 1
                        ? () =>
                            mutate((d) => {
                              const [item] = d.specializations.splice(i, 1);
                              d.specializations.splice(i + 1, 0, item);
                            })
                        : undefined
                    }
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField
                        label="Title"
                        value={spec.title}
                        onChange={(v) => mutate((d) => (d.specializations[i].title = v))}
                      />
                      <IconPicker
                        label="Icon"
                        value={spec.icon}
                        onChange={(v) => mutate((d) => (d.specializations[i].icon = v))}
                      />
                    </div>
                    <TextAreaField
                      label="Description"
                      rows={2}
                      value={spec.description}
                      onChange={(v) => mutate((d) => (d.specializations[i].description = v))}
                    />
                  </ListItemCard>
                ))}
                <AddButton
                  label="Add service"
                  onClick={() =>
                    mutate((d) =>
                      d.specializations.push({ icon: "Brain", title: "", description: "" })
                    )
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Investigations / conditions (the small tags)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TextAreaField
                  label="One per line"
                  rows={8}
                  value={settings.conditions.join("\n")}
                  onChange={(v) =>
                    mutate(
                      (d) =>
                        (d.conditions = v
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean))
                    )
                  }
                  hint="Each line becomes one tag on the website."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Why choose us (highlights)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settings.highlights.map((h, i) => (
                  <ListItemCard
                    key={i}
                    title={h.title || `Highlight ${i + 1}`}
                    onRemove={() => mutate((d) => d.highlights.splice(i, 1))}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField
                        label="Title"
                        value={h.title}
                        onChange={(v) => mutate((d) => (d.highlights[i].title = v))}
                      />
                      <IconPicker
                        label="Icon"
                        value={h.icon}
                        onChange={(v) => mutate((d) => (d.highlights[i].icon = v))}
                      />
                    </div>
                    <TextAreaField
                      label="Description"
                      rows={2}
                      value={h.description}
                      onChange={(v) => mutate((d) => (d.highlights[i].description = v))}
                    />
                  </ListItemCard>
                ))}
                <AddButton
                  label="Add highlight"
                  onClick={() =>
                    mutate((d) =>
                      d.highlights.push({ icon: "CheckCircle2", title: "", description: "" })
                    )
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───────────────────── Photos & Facilities ───────────────────── */}
          <TabsContent value="photos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top-of-page (hero) photo</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <ImageUpload
                    label="Hero photo (right side of the top section)"
                    value={settings.hero.image}
                    onChange={(url) => mutate((d) => (d.hero.image = url))}
                    hint="A tall photo (portrait) works best here. JPG or PNG, up to 8 MB."
                    aspect="aspect-[4/5]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextField
                    label="Photo description (for accessibility and Google)"
                    value={settings.hero.imageAlt}
                    onChange={(v) => mutate((d) => (d.hero.imageAlt = v))}
                  />
                </div>
                <TextField
                  label="Floating card — small title"
                  value={settings.hero.floatingCardTitle}
                  onChange={(v) => mutate((d) => (d.hero.floatingCardTitle = v))}
                  hint='e.g. "Emergency"'
                />
                <TextField
                  label="Floating card — text"
                  value={settings.hero.floatingCardText}
                  onChange={(v) => mutate((d) => (d.hero.floatingCardText = v))}
                  hint='e.g. "24×7 Cover"'
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Facility photo cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settings.facilities.map((facility, i) => (
                  <ListItemCard
                    key={i}
                    title={facility.title || `Facility ${i + 1}`}
                    onRemove={() => mutate((d) => d.facilities.splice(i, 1))}
                    onMoveUp={
                      i > 0
                        ? () =>
                            mutate((d) => {
                              const [item] = d.facilities.splice(i, 1);
                              d.facilities.splice(i - 1, 0, item);
                            })
                        : undefined
                    }
                    onMoveDown={
                      i < settings.facilities.length - 1
                        ? () =>
                            mutate((d) => {
                              const [item] = d.facilities.splice(i, 1);
                              d.facilities.splice(i + 1, 0, item);
                            })
                        : undefined
                    }
                  >
                    <ImageUpload
                      label="Photo"
                      value={facility.image}
                      onChange={(url) => mutate((d) => (d.facilities[i].image = url))}
                      hint="Landscape photos (wider than tall) look best."
                    />
                    <TextField
                      label="Title"
                      value={facility.title}
                      onChange={(v) => mutate((d) => (d.facilities[i].title = v))}
                    />
                    <TextAreaField
                      label="Description"
                      rows={2}
                      value={facility.description}
                      onChange={(v) => mutate((d) => (d.facilities[i].description = v))}
                    />
                  </ListItemCard>
                ))}
                <AddButton
                  label="Add facility card"
                  onClick={() =>
                    mutate((d) =>
                      d.facilities.push({ image: "", title: "", description: "" })
                    )
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───────────────────── Stats & Social ───────────────────── */}
          <TabsContent value="more" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Numbers / statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settings.stats.map((s, i) => (
                  <ListItemCard
                    key={i}
                    title={s.label || `Statistic ${i + 1}`}
                    onRemove={() => mutate((d) => d.stats.splice(i, 1))}
                  >
                    <div className="grid gap-3 sm:grid-cols-3">
                      <TextField
                        label="Label"
                        value={s.label}
                        onChange={(v) => mutate((d) => (d.stats[i].label = v))}
                      />
                      <NumberField
                        label="Number"
                        value={s.value}
                        onChange={(v) => mutate((d) => (d.stats[i].value = v))}
                      />
                      <TextField
                        label="Suffix"
                        value={s.suffix}
                        onChange={(v) => mutate((d) => (d.stats[i].suffix = v))}
                        hint='Usually "+"'
                      />
                    </div>
                  </ListItemCard>
                ))}
                <AddButton
                  label="Add statistic"
                  onClick={() => mutate((d) => d.stats.push({ label: "", value: 0, suffix: "+" }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Social media links</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Facebook"
                  value={settings.social.facebook}
                  onChange={(v) => mutate((d) => (d.social.facebook = v))}
                  hint="Leave empty to hide the icon"
                  placeholder="https://facebook.com/..."
                />
                <TextField
                  label="Instagram"
                  value={settings.social.instagram}
                  onChange={(v) => mutate((d) => (d.social.instagram = v))}
                  placeholder="https://instagram.com/..."
                />
                <TextField
                  label="YouTube"
                  value={settings.social.youtube}
                  onChange={(v) => mutate((d) => (d.social.youtube = v))}
                  placeholder="https://youtube.com/..."
                />
                <TextField
                  label="LinkedIn"
                  value={settings.social.linkedin}
                  onChange={(v) => mutate((d) => (d.social.linkedin = v))}
                  placeholder="https://linkedin.com/in/..."
                />
                <TextField
                  label="Twitter / X"
                  value={settings.social.twitter}
                  onChange={(v) => mutate((d) => (d.social.twitter = v))}
                  placeholder="https://x.com/..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Danger zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={handleReset}>
                  <RotateCcw className="mr-2 size-4" />
                  Reset website to original content
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Removes all edits made here and shows the original built-in content again.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ───────────────────── Design & Layout ───────────────────── */}
          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Website colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Quick color schemes</p>
                  <div className="flex flex-wrap gap-2">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          mutate((d) => {
                            d.theme.primary = preset.primary;
                            d.theme.primaryDark = preset.primaryDark;
                            d.theme.accent = preset.accent;
                          })
                        }
                        className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition-colors hover:border-brand/50 hover:bg-brand/5"
                      >
                        <span className="flex overflow-hidden rounded-full border">
                          <span className="size-4" style={{ backgroundColor: preset.primary }} />
                          <span className="size-4" style={{ backgroundColor: preset.primaryDark }} />
                          <span className="size-4" style={{ backgroundColor: preset.accent }} />
                        </span>
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <ColorField
                    label="Main color"
                    value={settings.theme.primary}
                    onChange={(v) => mutate((d) => (d.theme.primary = v))}
                    hint="Buttons, icons, section tints"
                  />
                  <ColorField
                    label="Dark shade"
                    value={settings.theme.primaryDark}
                    onChange={(v) => mutate((d) => (d.theme.primaryDark = v))}
                    hint="Hover states, small text, footer"
                  />
                  <ColorField
                    label="Gold accent"
                    value={settings.theme.accent}
                    onChange={(v) => mutate((d) => (d.theme.accent = v))}
                    hint="Highlights and footer headings"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Save and refresh the website to see the new colors applied everywhere.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Booking button</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextField
                    label="Booking link (where every Book button goes)"
                    value={settings.booking.url}
                    onChange={(v) => mutate((d) => (d.booking.url = v))}
                    hint="Full web address, e.g. https://caredeoghar.com — or #contact to scroll to the contact form instead (only works while the Contact section is switched on)."
                  />
                  {(() => {
                    const url = settings.booking.url.trim();
                    if (!url.startsWith("#")) return null;
                    const target = settings.sections as unknown as Record<
                      string,
                      { visible?: boolean } | undefined
                    >;
                    if (target[url.slice(1)]?.visible !== false) return null;
                    return (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        This link points to a section that is switched off below — every Book
                        button will do nothing. Show the section again or use a full web
                        address.
                      </p>
                    );
                  })()}
                </div>
                <TextField
                  label="Main button text"
                  value={settings.booking.label}
                  onChange={(v) => mutate((d) => (d.booking.label = v))}
                  hint='Shown in the top bar and hero, e.g. "Book Appointment"'
                />
                <TextField
                  label="Secondary button text"
                  value={settings.booking.shortLabel}
                  onChange={(v) => mutate((d) => (d.booking.shortLabel = v))}
                  hint='Used mid-page, e.g. "Book a Consultation"'
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Page sections — show, hide &amp; reword</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SECTION_META.map(({ key, name, note }) => {
                  const sec = settings.sections[key] as Record<string, string | boolean>;
                  const setField = (field: string) => (v: string) =>
                    mutate((d) => {
                      (d.sections[key] as Record<string, string | boolean>)[field] = v;
                    });
                  return (
                    <div key={key} className="rounded-lg border bg-card p-4">
                      <SwitchField
                        label={name}
                        hint={note ?? (sec.visible === false ? "Hidden from the website" : "Shown on the website")}
                        checked={sec.visible !== false}
                        onChange={(v) =>
                          mutate((d) => {
                            (d.sections[key] as Record<string, string | boolean>).visible = v;
                          })
                        }
                      />
                      {sec.visible !== false && typeof sec.badge === "string" && (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <TextField label="Small badge" value={sec.badge} onChange={setField("badge")} />
                          {typeof sec.heading === "string" && (
                            <TextField label="Heading" value={sec.heading} onChange={setField("heading")} />
                          )}
                          {typeof sec.subheading === "string" && (
                            <div className="sm:col-span-2">
                              <TextAreaField
                                label="Sub-heading"
                                rows={2}
                                value={sec.subheading}
                                onChange={setField("subheading")}
                              />
                            </div>
                          )}
                          {typeof sec.ctaTitle === "string" && (
                            <TextField label="Banner title" value={sec.ctaTitle} onChange={setField("ctaTitle")} />
                          )}
                          {typeof sec.ctaText === "string" && (
                            <TextField label="Banner text" value={sec.ctaText} onChange={setField("ctaText")} />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Menu labels</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {settings.nav.map((item, i) => (
                  <TextField
                    key={item.href}
                    label={`Menu item ${i + 1} (${item.href.replace("#", "")})`}
                    value={item.label}
                    onChange={(v) => mutate((d) => (d.nav[i].label = v))}
                  />
                ))}
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  Menu items linking to a hidden section disappear from the menu automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Footer &amp; search engines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextField
                  label="Footer credit line"
                  value={settings.footer.creditLine}
                  onChange={(v) => mutate((d) => (d.footer.creditLine = v))}
                />
                <KeywordsField
                  value={settings.seo.keywords}
                  onChange={(arr) => mutate((d) => (d.seo.keywords = arr))}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0 text-sm">
            {saveMessage && (
              <p className="flex items-center gap-1.5 text-green-700">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="truncate">{saveMessage}</span>
              </p>
            )}
            {errorMessage && (
              <p className="flex items-center gap-1.5 text-red-600">
                <AlertTriangle className="size-4 shrink-0" />
                <span className="truncate">{errorMessage}</span>
              </p>
            )}
          </div>
          <Button onClick={handleSave} disabled={saving} className="shrink-0 border-0 bg-brand-sheen text-white hover:brightness-110">
            {saving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Keywords field ───────────────────────────── */

function parseKeywords(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Keeps the text you type (including trailing commas) while storing the
 * cleaned-up list — a plain controlled field would swallow commas as you type.
 */
function KeywordsField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [raw, setRaw] = React.useState(value.join(", "));
  const [lastValue, setLastValue] = React.useState(value);
  // External change (e.g. "Reset website") — re-seed the text from the data.
  if (JSON.stringify(lastValue) !== JSON.stringify(value)) {
    setLastValue(value);
    if (JSON.stringify(parseKeywords(raw)) !== JSON.stringify(value)) {
      setRaw(value.join(", "));
    }
  }
  return (
    <TextAreaField
      label="Search keywords (separate with commas)"
      rows={3}
      value={raw}
      onChange={(v) => {
        setRaw(v);
        onChange(parseKeywords(v));
      }}
      hint="Helps Google understand what the website is about."
    />
  );
}

/* ───────────────────────────── Login screen ───────────────────────────── */

function LoginScreen({
  onSuccess,
  usingDefaultPassword,
}: {
  onSuccess: () => Promise<void>;
  usingDefaultPassword: boolean;
}) {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function handleLogin() {
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Wrong password");
        return;
      }
      await onSuccess();
    } catch {
      setError("Could not log in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand-dark">
            <Lock className="size-6" />
          </div>
          <CardTitle className="text-lg">Website Settings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the admin password to edit the website.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleLogin();
            }}
            autoFocus
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {usingDefaultPassword && (
            <p className="text-xs text-muted-foreground">
              No password has been set yet — the temporary password is written in the
              EDITING-GUIDE file on the Synology. Please set your own password soon.
            </p>
          )}
          <Button
            className="w-full border-0 bg-brand-sheen text-white hover:brightness-110"
            disabled={busy || !password}
            onClick={handleLogin}
          >
            {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
            Log in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
