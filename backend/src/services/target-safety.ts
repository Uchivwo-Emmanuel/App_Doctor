import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

const blockedHostnames = new Set(["localhost", "metadata.google.internal"]);

function isBlockedIp(value: string) {
  if (value === "::1" || value === "0.0.0.0" || value.startsWith("fe80:") || value.startsWith("fc") || value.startsWith("fd")) return true;
  if (isIP(value) !== 4) return false;
  const [a, b] = value.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

export async function assertSafePublicTarget(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || blockedHostnames.has(url.hostname.toLowerCase())) {
    throw new Error("This target is not eligible for a public health scan");
  }
  if (isBlockedIp(url.hostname)) throw new Error("This target is not eligible for a public health scan");
  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((address) => isBlockedIp(address.address))) {
    throw new Error("This target is not eligible for a public health scan");
  }
  return url.toString();
}
