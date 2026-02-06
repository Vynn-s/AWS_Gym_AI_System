# Copilot Task Brief — QR Gym Attendance (Frontend Only)

Build a minimal Next.js (App Router) + Tailwind frontend for a QR-based gym attendance system.
No auth, no backend logic yet. Use mock data and placeholder functions.

## Pages (App Router)
1) /app/checkin/page.tsx
- Centered card layout
- Gym name header (placeholder)
- Input: label "Member ID", text input
- Button: "Check In"
- On submit:
  - Validate Member ID not empty
  - Call a placeholder async function (mock supabase insert)
  - Show loading state while submitting
  - Show success message "Check-in recorded successfully"
  - Show error message if empty input OR mock insert fails
- No real DB integration yet; leave TODOs for Supabase insert later.

2) /app/admin/page.tsx
- Clean dashboard layout
- Stats cards grid:
  - Total Check-ins (Today)
  - Total Check-ins (This Week)
  - Peak Hour (placeholder)
  - Busiest Day (placeholder)
- Attendance Summary section:
  - Simple table/list: date | number of check-ins (mock static data)
- AI Insights section (UI only):
  - Title: "AI-Generated Insights"
  - Placeholder paragraph
  - Button: "Generate Insights" disabled with text "Coming soon"
  - No AI logic; leave TODOs for later.

## Components (reusable)
- /src/components/ui/Button.tsx
- /src/components/ui/Input.tsx
- /src/components/StatCard.tsx

## Styling
- Tailwind only
- Modern, minimal, neutral palette (gray/slate/zinc)
- Rounded cards, subtle shadows
- Mobile-first responsive

## Constraints
- Keep code beginner-friendly
- No over-engineering
- Use client-side logic only where needed
