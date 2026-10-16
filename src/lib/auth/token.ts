import { SignJWT, jwtVerify } from "jose";
import { sessionSecret } from "./config";

/** Cookie payload: just a session id. Everything else is looked up in the database on each request. */
export async function signSessionToken(sid: string, expiresAt: Date, secret = sessionSecret()): Promise<string> {
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  return new SignJWT({ sid })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secret);
}

/** Verifies signature and expiry; returns the session id, or null. Never touches the database. */
export async function verifySessionToken(token: string, secret = sessionSecret()): Promise<string | null> {
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return typeof payload.sid === "string" ? payload.sid : null;
  } catch {
    return null;
  }
}
