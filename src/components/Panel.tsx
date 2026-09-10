import React from "react";

type Accent = "ink" | "dock" | "moss" | "rust" | "amber" | "clay";

const accentBg: Record<Accent, string> = {
  ink: "bg-ink",
  dock: "bg-dock-600",
  moss: "bg-moss",
  rust: "bg-rust",
  amber: "bg-amber",
  clay: "bg-clay",
};

interface PanelProps {
  title: string;
  subtitle?: string;
  accent?: Accent;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  accent = "dock",
  right,
  children,
  className = "",
  bodyClassName = "",
}) => {
  return (
    <section className={`flex flex-col rounded-xl bg-white shadow-panel overflow-hidden ${className}`}>
      <header
        className={`hatch flex items-center justify-between gap-3 px-4 py-2.5 text-white ${accentBg[accent]}`}
      >
        <div className="flex min-w-0 flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-2">
          <h2 className="font-display font-semibold tracking-tight text-[15px]">{title}</h2>
          {subtitle && <span className="text-xs text-white/70">{subtitle}</span>}
        </div>
        {right && <div className="shrink-0 text-xs font-num font-medium text-white/90">{right}</div>}
      </header>
      <div className={`flex-1 p-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
};

interface StatProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  tone?: "ink" | "moss" | "clay" | "dock" | "rust" | "amber";
  size?: "md" | "lg";
}

const toneText: Record<NonNullable<StatProps["tone"]>, string> = {
  ink: "text-ink",
  moss: "text-moss",
  clay: "text-clay",
  dock: "text-dock-500",
  rust: "text-rust",
  amber: "text-amber",
};

export const Stat: React.FC<StatProps> = ({ label, value, unit, tone = "ink", size = "md" }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dock-100 bg-paper/60 px-3 py-2.5 text-center">
    <span className="text-[11px] font-medium text-dock-600/80">{label}</span>
    <span
      className={`font-num font-bold leading-tight ${toneText[tone]} ${
        size === "lg" ? "text-3xl" : "text-2xl"
      }`}
    >
      {value}
    </span>
    {unit && <span className="text-[11px] text-dock-500">{unit}</span>}
  </div>
);
