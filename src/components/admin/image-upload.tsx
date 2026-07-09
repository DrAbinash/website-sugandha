"use client";

import * as React from "react";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * A photo picker for the admin panel.
 * Shows the current photo, lets the doctor choose a new one from the
 * computer/phone, uploads it, and reports the new URL back to the form.
 */
export function ImageUpload({
  label,
  value,
  onChange,
  hint,
  aspect = "aspect-[4/3]",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  aspect?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setError(data.error || "Upload failed. Please try again.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-start gap-4">
        <div
          className={`relative w-40 shrink-0 overflow-hidden rounded-lg border bg-muted ${aspect}`}
        >
          {value ? (
            <img src={value} alt={label} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageIcon className="size-8" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="size-6 animate-spin text-white" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mr-2 size-4" />
            {uploading ? "Uploading…" : "Change photo"}
          </Button>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}
