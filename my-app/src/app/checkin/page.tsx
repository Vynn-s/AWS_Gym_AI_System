"use client";

import React, { useRef, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// TODO: Add QR scanner integration (e.g. html5-qrcode) to auto-fill memberId
// TODO: Add client-side rate limiting to prevent duplicate rapid submissions

/**
 * POST to /api/checkin with the member ID.
 * Expects JSON response: { ok: true } on success, or { ok: false, error: "..." } on failure.
 */
async function submitCheckIn(memberId: string): Promise<{ ok: boolean; error?: string; memberName?: string }> {
  const res = await fetch("/api/checkin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    return { ok: false, error: data.error ?? "Check-in failed. Please try again." };
  }

  return { ok: true, memberName: data.memberName ?? undefined };
}

export default function CheckInPage() {
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ref used to re-focus the input after a successful check-in
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckIn = async () => {
    // Reset messages
    setError("");
    setSuccess("");

    // Validate
    if (!memberId.trim()) {
      setError("Member ID is required.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await submitCheckIn(memberId);

      if (result.ok) {
        const name = result.memberName;
        setSuccess(name ? `Welcome, ${name}! Check-in recorded ✅` : "Check-in recorded successfully ✅");
        setMemberId(""); // clear input after success

        // Re-focus input so staff can scan the next member immediately
        inputRef.current?.focus();
      } else {
        setError(result.error ?? "Check-in failed.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg shadow-zinc-950/40">
        {/* Gym name placeholder */}
        {/* TODO: Replace with dynamic gym name from Supabase */}
        <h1 className="text-center text-2xl font-bold tracking-tight text-zinc-100">
          GymFlow AI
        </h1>
        <p className="mt-1 text-center text-sm text-zinc-500">
          QR Check-In Station
        </p>

        {/* Divider */}
        <hr className="my-6 border-zinc-800" />

        {/* Member ID input — auto-focused on page load */}
        <div
          ref={(el) => {
            // Grab the <input> inside the wrapper so we can re-focus after submit
            if (el) inputRef.current = el.querySelector("input");
          }}
        >
          <Input
            label="Member ID"
            name="memberId"
            value={memberId}
            onChange={(e) => {
              setMemberId(e.target.value);
              // Clear messages when user starts typing again
              if (error) setError("");
              if (success) setSuccess("");
            }}
            placeholder="e.g. M-0001"
            error={error}
            autoFocus
          />
        </div>

        {/* Check In button — disabled when input is empty or loading */}
        <Button
          onClick={handleCheckIn}
          isLoading={isLoading}
          disabled={!memberId.trim()}
          className="mt-5 w-full"
        >
          Check In
        </Button>

        {/* Success alert */}
        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-400">
            <span className="shrink-0 text-base">&#9989;</span>
            <p>{success}</p>
          </div>
        )}

        {/* Form-level error alert (shown for non-validation errors) */}
        {error && !memberId && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            <span className="shrink-0 text-base">&#10060;</span>
            <p>{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
