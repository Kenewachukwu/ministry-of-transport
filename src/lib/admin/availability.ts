import { sessionSecret } from "@/lib/auth/config";
import { contentSource } from "@/lib/env";

export interface Availability {
  available: boolean;
  reason?: string;
}

/**
 * The admin only runs when there is somewhere to store content AND a key to sign
 * sessions with. Otherwise /admin explains what is missing rather than failing.
 */
export function adminAvailability(): Availability {
  if (contentSource() === "static") {
    return { available: false, reason: "No database is connected yet. Set DATABASE_URL (see .env.example) and redeploy." };
  }
  if (!sessionSecret()) {
    return { available: false, reason: "SESSION_SECRET is not set (it must be at least 32 characters)." };
  }
  return { available: true };
}
