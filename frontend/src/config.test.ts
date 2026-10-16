import { describe, expect, it } from "vitest";

import { config } from "./config";

describe("frontend configuration", () => {
  it("uses a safe local API origin by default", () => {
    expect(config.apiUrl).toMatch(/^http:\/\/(localhost|127\.0\.0\.1):/);
  });
});
