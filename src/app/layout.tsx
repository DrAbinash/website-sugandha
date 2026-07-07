import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site.config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carediagnostics.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteConfig.doctor.name}, ${siteConfig.doctor.qualifications.slice(0, 3).join(", ")} — ${siteConfig.doctor.title} | ${siteConfig.hospital.shortName}`,
  description: siteConfig.doctor.shortBio,
  keywords: ["Radiologist Deoghar", "Dr Sugandha Priyadarshini", "Radiology Jharkhand", "3T MRI Deoghar", "Women's imaging Deoghar", "CT scan Deoghar", "Care Diagnostics Deoghar"],
  authors: [{ name: siteConfig.doctor.name }],
  creator: siteConfig.hospital.name,
  publisher: siteConfig.hospital.name,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: `${siteConfig.doctor.name} — ${siteConfig.doctor.title}`,
    description: siteConfig.doctor.shortBio,
    siteName: siteConfig.hospital.name,
    type: "website",
    locale: "en_IN",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.doctor.name} — ${siteConfig.doctor.title}`,
    description: siteConfig.doctor.shortBio,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: siteConfig.theme.primary,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Physician",
        name: siteConfig.doctor.name,
        medicalSpecialty: "Neurosurgery",
        jobTitle: siteConfig.doctor.title,
        worksFor: { "@type": "MedicalClinic", name: siteConfig.hospital.name },
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.hospital.address.full,
          addressLocality: "Deoghar",
          addressRegion: "Jharkhand",
          postalCode: "814112",
          addressCountry: "IN",
        },
        telephone: siteConfig.contact.phone,
      },
      {
        "@type": "MedicalClinic",
        name: siteConfig.hospital.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.hospital.address.full,
          addressLocality: "Deoghar",
          addressRegion: "Jharkhand",
          postalCode: "814112",
          addressCountry: "IN",
        },
        telephone: siteConfig.contact.phone,
      },
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
