"use client";

import React from "react";

/** Props accepted by the Button component. */
interface ButtonProps {
  /** Content displayed inside the button. */
  children: React.ReactNode;
  /** Click handler. */
  onClick?: () => void;
  /** HTML button type attribute. */
  type?: "button" | "submit" | "reset";
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Shows a "Loading…" label and disables the button. */
  isLoading?: boolean;
  /** Extra Tailwind classes to merge. */
  className?: string;
}

/**
 * A reusable, beginner-friendly Button built with Tailwind CSS.
 * Rounded corners, subtle shadow, neutral zinc/slate palette.
 */
export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  className = "",
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        rounded-lg px-5 py-2.5 text-sm font-medium
        bg-zinc-800 text-zinc-100
        shadow-sm shadow-zinc-900/20
        transition-colors duration-150
        hover:bg-zinc-700
        focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `.trim()}
    >
      {isLoading ? "Loading\u2026" : children}
    </button>
  );
}
