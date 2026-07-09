"use client";

import * as React from "react";
import { Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
        <span className="inline-flex size-9 items-center justify-center rounded-md border bg-muted text-emerald-700">
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

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <Plus className="mr-2 size-4" />
      {label}
    </Button>
  );
}
