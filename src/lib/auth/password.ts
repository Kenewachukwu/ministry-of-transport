import "server-only";
import { hash, verify } from "@node-rs/argon2";
import { PASSWORD_MAX, PASSWORD_MIN } from "./config";

// argon2id, ~19 MiB / 2 passes: the OWASP-recommended minimum, and light enough
// for a serverless function. The PHC string records the parameters, so they can
// be raised later and passwords re-hashed on next login.
const OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export function hashPassword(password: string): Promise<string> {
  return hash(password, OPTIONS);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

let dummyHash: Promise<string> | undefined;

/**
 * Verifies against a throwaway hash so that "no such user" takes as long as
 * "wrong password" — the response time must not reveal which emails exist.
 */
export async function burnPasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword("not-a-real-password-just-for-timing");
  await verifyPassword(await dummyHash, password);
}

export function passwordProblem(password: string): string | null {
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (password.length > PASSWORD_MAX) return `Use at most ${PASSWORD_MAX} characters.`;
  return null;
}
