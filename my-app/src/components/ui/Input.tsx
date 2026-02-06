"use client";

import React from "react";

/** Props accepted by the Input component. */
interface InputProps {
  /** Text label shown above the input. */
  label?: string;
  /** Controlled value of the input. */
  value: string;
  /** Called whenever the user types. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Placeholder text inside the input. */
  placeholder?: string;
  /** Error message displayed below the input in red. */
  error?: string;
  /** HTML name attribute for form submission. */
  name?: string;
  /** Extra Tailwind classes to merge on the wrapper. */
  className?: string;
}

/**
 * A reusable, beginner-friendly Input built with Tailwind CSS.
 * Rounded corners, subtle border, focus ring, with optional label & error text.
 */
export default function Input({
  label,
  value,
  onChange,
  placeholder = "",
  error,
  name,
  className = "",
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-zinc-300"
        >
          {label}
        </label>
      )}

      {/* Input field */}
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full rounded-lg border px-4 py-2.5 text-sm
          bg-zinc-900 text-zinc-100 placeholder-zinc-500
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900
          ${error ? "border-red-500" : "border-zinc-700"}
        `.trim()}
      />

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
