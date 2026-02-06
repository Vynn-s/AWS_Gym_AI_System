"use client";

import React from "react";

/** Props accepted by the StatCard component. */
interface StatCardProps {
  /** Heading label for the stat (e.g. "Total Members"). */
  title: string;
  /** Primary value to display (e.g. 128 or "98%"). */
  value: string | number;
  /** Optional secondary text shown below the value. */
  subtitle?: string;
  /** Optional icon or element rendered beside the title. */
  icon?: React.ReactNode;
}

/**
 * A simple stat card with a title, large value, and optional subtitle/icon.
 * Rounded corners, subtle border & shadow, neutral zinc palette.
 */
export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-sm shadow-zinc-900/30 transition-colors duration-150 hover:border-zinc-600">
      {/* Header row */}
      <div className="flex items-center gap-2">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
      </div>

      {/* Value */}
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
        {value}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
      )}
    </div>
  );
}
