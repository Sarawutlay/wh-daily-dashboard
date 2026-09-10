import React from "react";
import { IconPlus, IconTrash } from "./Icons";

export const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className = "",
}) => (
  <label className={`flex flex-col gap-1 ${className}`}>
    <span className="text-[12px] font-medium text-dock-600">{label}</span>
    {children}
  </label>
);

const baseInput =
  "w-full rounded-md border border-dock-200 bg-white px-2.5 py-1.5 text-sm text-ink outline-none transition focus:border-dock-500 focus:ring-2 focus:ring-dock-500/20";

export const NumberInput: React.FC<{
  value: number;
  onChange: (v: number) => void;
  min?: number;
  placeholder?: string;
}> = ({ value, onChange, min = 0, placeholder }) => (
  <input
    type="number"
    className={baseInput + " font-num"}
    value={Number.isFinite(value) ? value : 0}
    min={min}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
  />
);

export const TextInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    className={baseInput}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

export const SectionTitle: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="mb-2 flex items-baseline justify-between">
    <h3 className="text-[13px] font-bold text-dock-700">{children}</h3>
    {hint && <span className="text-[11px] text-dock-400">{hint}</span>}
  </div>
);

export const RowActions: React.FC<{ onAdd: () => void; addLabel: string }> = ({ onAdd, addLabel }) => (
  <button
    type="button"
    onClick={onAdd}
    className="mt-2 inline-flex items-center gap-1 rounded-md border border-dashed border-dock-300 px-2.5 py-1.5 text-[12px] font-medium text-dock-600 transition hover:border-dock-500 hover:bg-dock-50"
  >
    <IconPlus className="h-3.5 w-3.5" />
    {addLabel}
  </button>
);

export const RemoveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="shrink-0 rounded-md p-1.5 text-clay/60 transition hover:bg-clay/10 hover:text-clay"
    aria-label="ลบ"
  >
    <IconTrash className="h-4 w-4" />
  </button>
);
