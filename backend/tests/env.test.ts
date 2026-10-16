import { describe, expect, it } from "vitest";

import { env, parseEnvironment } from "../src/config/env.js";

describe("environment", () => {
  it("uses safe localhost defaults for the backend foundation", () => {
    expect(env.PORT).toBeTypeOf("number");
    expect(env.APP_URL).toMatch(/^http:\/\/localhost/);
  });

  it("reports only an invalid field name when a value is malformed", () => {
    expect(() => parseEnvironment({ PORT: "not-a-port" })).toThrow("PORT");
    expect(() => parseEnvironment({ PORT: "not-a-port" })).not.toThrow("not-a-port");
  });

  it("refuses local demo access outside development", () => {
    expect(() =>
      parseEnvironment({
        NODE_ENV: "production",
        LOCAL_DEMO_ACCESS_ENABLED: "true",
        LOCAL_DEMO_EMAIL: "demo@example.com",
        LOCAL_DEMO_SESSION_SECRET: "a-secure-local-demo-secret-with-32-chars",
      }),
    ).toThrow("LOCAL_DEMO_ACCESS_ENABLED");
  });

  it("requires an email and long secret when local demo access is enabled", () => {
    expect(() => parseEnvironment({ LOCAL_DEMO_ACCESS_ENABLED: "true" })).toThrow("LOCAL_DEMO_EMAIL");
  });
});
