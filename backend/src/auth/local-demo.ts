import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "../config/env.js";
import { LOCAL_DEMO_USER_ID } from "./constants.js";

const COOKIE_NAME = "app_doctor_local_demo";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

type LocalDemoSession = { userId: string; expiresAt: number };

function getSessionSecret() {
  return env.LOCAL_DEMO_SESSION_SECRET ?? env.BETTER_AUTH_SECRET;
}

function assertEnabled() {
  if (!env.LOCAL_DEMO_ACCESS_ENABLED || env.NODE_ENV !== "development" || !getSessionSecret()) {
    throw new Error("Local demo access is unavailable");
  }
}

function sign(value: string) {
  assertEnabled();
  const secret = getSessionSecret();
  if (!secret) throw new Error("Local demo access is unavailable");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function parseCookies(header: string | undefined) {
  return new Map(
    (header ?? "")
      .split(";")
      .map((part) => part.trim().split(/=(.*)/s, 2))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, value]),
  );
}

export function createLocalDemoSessionCookie() {
  assertEnabled();
  const session: LocalDemoSession = { userId: LOCAL_DEMO_USER_ID, expiresAt: Date.now() + SESSION_DURATION_MS };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${COOKIE_NAME}=${payload}.${sign(payload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_MS / 1000}`;
}

export function clearLocalDemoSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getLocalDemoUserId(cookieHeader: string | undefined) {
  if (!env.LOCAL_DEMO_ACCESS_ENABLED || env.NODE_ENV !== "development" || !getSessionSecret()) {
    return null;
  }

  const value = parseCookies(cookieHeader).get(COOKIE_NAME);
  if (!value) return null;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as LocalDemoSession;
    return session.userId === LOCAL_DEMO_USER_ID && session.expiresAt > Date.now() ? session.userId : null;
  } catch {
    return null;
  }
}

export function localDemoAccessIsEnabled() {
  return env.LOCAL_DEMO_ACCESS_ENABLED && env.NODE_ENV === "development" && Boolean(getSessionSecret());
}
