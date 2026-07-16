"use client";

import * as React from "react";
import { Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getIcon } from "@/components/icon-map";

let fieldId = 0;
function useFieldId() {
  const [id] = React.useState(() => `adm-field-${++fieldId}`);
  return id;
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  type?: string;
}) {
  const id = useFieldId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  const id = useFieldId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  hint,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
}) {
  const id = useFieldId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Icons the doctor can choose for services / highlights / education. */
const ICON_CHOICES = [
  "Brain",
  "Activity",
  "HeartPulse",
  "Baby",
  "Stethoscope",
  "Microscope",
  "Clock",
  "ShieldAlert",
  "HandHeart",
  "Users",
  "GraduationCap",
  "Award",
  "Scissors",
  "CheckCircle2",
  "Star",
  "Calendar",
  "Ambulance",
];

function IconPreview({ name }: { name: string }) {
  return React.createElement(getIcon(name), { className: "size-5" });
}

export function IconPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useFieldId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-md border bg-muted text-brand-dark">
          <IconPreview name={value} />
        </span>
        <select
          id={id}
          value={ICON_CHOICES.includes(value) ? value : ICON_CHOICES[0]}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm"
        >
          {ICON_CHOICES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/** A card wrapping one item of an editable list, with remove / reorder. */
export function ListItemCard({
  title,
  onRemove,
  onMoveUp,
  onMoveDown,
  children,
}: {
  title: string;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <Button type="button" variant="ghost" size="icon" className="size-7" onClick={onMoveUp} title="Move up">
              <ChevronUp className="size-4" />
            </Button>
          )}
          {onMoveDown && (
            <Button type="button" variant="ghost" size="icon" className="size-7" onClick={onMoveDown} title="Move down">
              <ChevronDown className="size-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onRemove}
            title="Remove"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

/** A color swatch picker + hex text input, for theme colors. */
const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function ColorField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const id = useFieldId();
  const invalid = value.trim() !== "" && !HEX_COLOR.test(value.trim());
  const pickerValue = /^#[0-9a-fA-F]{6}$/.test(value.trim()) ? value.trim() : "#b76e79";
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} — pick color`}
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-input bg-background p-1"
        />
        <Input
          id={id}
          value={value}
          placeholder="#b76e79"
          aria-invalid={invalid}
          onChange={(e) => {
            const t = e.target.value.trim();
            // Be forgiving: add the missing "#" when someone types "b76e79".
            onChange(/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(t) ? `#${t}` : e.target.value);
          }}
          className="font-mono"
        />
      </div>
      {invalid && (
        <p className="text-xs text-red-600">
          Enter a color like #b76e79 — other values are ignored and the website keeps its
          previous color.
        </p>
      )}
      {hint && !invalid && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** An on/off switch with a label, e.g. for showing/hiding a section. */
export function SwitchField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  const id = useFieldId();
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <Plus className="mr-2 size-4" />
      {label}
    </Button>
  );
}
