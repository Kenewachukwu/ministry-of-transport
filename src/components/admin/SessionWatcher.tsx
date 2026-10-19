"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { sessionNotice } from "@/lib/admin/session-notice";

const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

/**
 * Tells the person their sign-in is about to end (or has), with the one thing
 * that saves their work: sign in again in a NEW tab, then come back to this one
 * and press Save. The page itself is left alone, so nothing typed is lost.
 */
export function SessionWatcher({ expiresAt }: { expiresAt: string }) {
  // Starts as null so the server and first client render agree (the banner only exists after mount).
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0);
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  if (now === null) return null;
  const expiresMs = Date.parse(expiresAt);
  const notice = sessionNotice(now, expiresMs);
  if (notice.level === "ok") return null;

  const ended = notice.level === "ended";
  return (
    <div
      role={ended ? "alert" : "status"}
      className={`sticky top-2 z-30 mb-6 flex items-start gap-3 rounded-control border px-4 py-3 text-sm shadow-card ${
        ended ? "border-red-300 bg-red-50 text-red-900" : "border-amber-300 bg-amber-50 text-amber-900"
      }`}
    >
      <Clock size={16} aria-hidden className="mt-0.5 shrink-0" />
      <p>
        {ended ? (
          <>
            <strong>Your session has ended.</strong> What you have typed is still on this page.{" "}
          </>
        ) : (
          <>
            <strong>
              Your session ends in about {notice.minutes} minute{notice.minutes === 1 ? "" : "s"}
            </strong>{" "}
            (at {timeFormat.format(new Date(expiresMs))}). Save your work now.{" "}
          </>
        )}
        <a href="/admin/login" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
          Sign in again in a new tab
        </a>
        , then come back here and press Save.
      </p>
    </div>
  );
}
