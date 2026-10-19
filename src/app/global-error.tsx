"use client";

import "./globals.css";

/**
 * Last resort: the root layout itself failed. This replaces the whole document,
 * so it carries its own html/body and the site's colour tokens (no header, fonts
 * or scripts, which may be what broke).
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body>
        <div data-direction="a" className="flex min-h-screen items-center justify-center bg-surface px-6 text-ink">
          <main className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cta">Federal Ministry of Transportation</p>
            <h1 className="mt-3 text-3xl font-semibold">The website is temporarily unavailable</h1>
            <p className="mt-4 text-lg text-ink-muted">
              Something went wrong on our side. Please try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => retry()}
              className="mt-8 rounded-control bg-cta px-5 py-2.5 text-sm font-semibold text-cta-ink hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
            >
              Try again
            </button>
            {error.digest && <p className="mt-8 text-sm text-ink-muted">Reference: {error.digest}</p>}
          </main>
        </div>
      </body>
    </html>
  );
}
