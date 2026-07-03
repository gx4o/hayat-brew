/**
 * Lightweight line icons — the quiet counterpart to the illustration
 * library. Consistent 24px grid, 1.8 stroke, rounded caps.
 */
import type { SVGProps } from "react";

function Icon({
  children,
  ...props
}: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconBean(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M17.8 6.2c2.7 2.7 2.4 7.4-.7 10.5s-7.8 3.4-10.5.7-2.4-7.4.7-10.5S15.1 3.5 17.8 6.2Z" />
      <path d="M16.5 7.5c-1.8 1.2-2.2 2.6-1.6 4.4.6 1.9.1 3.4-1.9 4.9" />
    </Icon>
  );
}

export function IconDrop(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 3.5s6 6.2 6 10.3c0 3.4-2.7 6-6 6s-6-2.6-6-6C6 9.7 12 3.5 12 3.5Z" />
      <path d="M9.5 13.8c0 1.6 1 2.8 2.5 3.1" opacity="0.6" />
    </Icon>
  );
}

export function IconIce(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="3.5" />
      <path d="M9 9.2 12 12l3-2.8M12 12v4.5" opacity="0.7" />
    </Icon>
  );
}

export function IconThermometer(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M10 4.5a2 2 0 1 1 4 0v8.6a4.5 4.5 0 1 1-4 0V4.5Z" />
      <circle cx="12" cy="16.8" r="1.6" fill="currentColor" stroke="none" />
      <path d="M12 15V8" />
    </Icon>
  );
}

export function IconCup(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M5.5 8h11l-1.2 9.2c-.1 1-1 1.8-2 1.8H8.7c-1 0-1.9-.8-2-1.8L5.5 8Z" />
      <path d="M16.5 9.5h1.6a2.4 2.4 0 0 1 0 4.8h-2.2" />
      <path d="M8.5 5.5c0-.8.6-1 .6-1.7M11.8 5.5c0-.8.6-1 .6-1.7" opacity="0.55" />
    </Icon>
  );
}

export function IconMug(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4.5 5.5h11v12a2.5 2.5 0 0 1-2.5 2.5H7a2.5 2.5 0 0 1-2.5-2.5v-12Z" />
      <path d="M15.5 8h1.8a2.7 2.7 0 0 1 0 5.4h-1.8" />
      <path d="M4.5 9.5h11" opacity="0.4" />
    </Icon>
  );
}

export function IconIcedGlass(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M6 4.5h12l-1.4 14.1c-.1 1-1 1.9-2 1.9H9.4c-1 0-1.9-.9-2-1.9L6 4.5Z" />
      <path d="M6.6 10.5h10.8" opacity="0.4" />
      <rect x="8.6" y="12.2" width="3" height="3" rx="0.9" opacity="0.75" />
      <rect x="12.6" y="14" width="2.6" height="2.6" rx="0.8" opacity="0.75" />
      <path d="M14.5 4.5 16.8 2" />
    </Icon>
  );
}

export function IconTimer(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="13.5" r="7" />
      <path d="M12 10v3.8l2.5 1.6M10 3h4M12 3v2" />
    </Icon>
  );
}

export function IconSteam(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8.5 4c-1.2 1.6 1.2 2.6 0 4.2M12 3c-1.2 1.6 1.2 2.6 0 4.2M15.5 4c-1.2 1.6 1.2 2.6 0 4.2" />
      <path d="M5.5 11.5h13v3.7A5.8 5.8 0 0 1 12.7 21h-1.4a5.8 5.8 0 0 1-5.8-5.8v-3.7Z" />
    </Icon>
  );
}
