const { spawnSync } = require("node:child_process");

if (!process.env.REDIS_URL) throw new Error("REDIS_URL is required");
const url = new URL(process.env.REDIS_URL);
if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") throw new Error("Local Redis must bind to localhost");

const existing = spawnSync("docker", ["inspect", "--format", "{{.State.Running}}", "app-doctor-redis"], { encoding: "utf8" });
if (existing.status === 0) {
  if (existing.stdout.trim() === "true") {
    console.info("App Doctor Redis is already running on 127.0.0.1:6379");
    process.exit(0);
  }
  const start = spawnSync("docker", ["start", "app-doctor-redis"], { stdio: "inherit" });
  process.exit(start.status ?? 1);
}

const result = spawnSync("docker", [
  "run", "-d", "--name", "app-doctor-redis", "--restart", "unless-stopped", "-p", "127.0.0.1:6379:6379",
  "redis:7.4-alpine", "redis-server", "--appendonly", "yes", "--maxmemory", "256mb", "--maxmemory-policy", "noeviction", "--requirepass", decodeURIComponent(url.password),
], { stdio: "inherit" });
process.exit(result.status ?? 1);
