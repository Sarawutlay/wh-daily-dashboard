import React from "react";

type IconProps = { className?: string };

export const IconWarehouse: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M4 20 24 6l20 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 18v22h32V18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 40V26h12v14" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <path d="M13 30h4v6h-4zM31 30h4v6h-4z" fill="currentColor" />
  </svg>
);

export const IconPeople: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="17" cy="15" r="6" stroke="currentColor" strokeWidth="3" />
    <circle cx="33" cy="17" r="5" stroke="currentColor" strokeWidth="3" />
    <path d="M6 40c0-8 5-13 11-13s11 5 11 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M26 40c0-6.5 3.8-11 8-11s10 4 10 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconTruckBig: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="14" width="22" height="18" rx="1.5" stroke="currentColor" strokeWidth="3" />
    <path d="M26 20h9l7 7v5h-16z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="14" cy="34" r="4" stroke="currentColor" strokeWidth="3" />
    <circle cx="35" cy="34" r="4" stroke="currentColor" strokeWidth="3" />
  </svg>
);

export const IconTruckSmall: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M4 16h20v16H4z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <path d="M24 22h9l8 6v4h-17z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="13" cy="34" r="4" stroke="currentColor" strokeWidth="3" />
    <circle cx="34" cy="34" r="4" stroke="currentColor" strokeWidth="3" />
  </svg>
);

export const IconFactory: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M6 42V22l10 7v-7l10 7v-7l10 7v13z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <path d="M32 22V10h4v6l4-4v10" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <path d="M6 42h32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconBox: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M24 6 42 15v18L24 42 6 33V15z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <path d="M6 15l18 9 18-9M24 24v18" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const IconClock: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" />
    <path d="M24 14v10l7 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCalendar: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="6" y="10" width="36" height="32" rx="3" stroke="currentColor" strokeWidth="3" />
    <path d="M6 19h36M15 6v8M33 6v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconTarget: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="3" />
    <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="3" />
    <circle cx="24" cy="24" r="3" fill="currentColor" />
  </svg>
);

export const IconClipboard: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="10" y="8" width="28" height="34" rx="2" stroke="currentColor" strokeWidth="3" />
    <rect x="17" y="5" width="14" height="7" rx="1.5" stroke="currentColor" strokeWidth="3" />
    <path d="M16 22h16M16 29h16M16 36h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconPlus: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const IconTrash: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0 1 12a1 1 0 001 1h6a1 1 0 001-1l1-12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconDownload: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 3v12m0 0 5-5m-5 5-5-5M4 19h16"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconSpinner: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
