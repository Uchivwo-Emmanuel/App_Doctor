import { describe, expect, it } from "vitest";

import { assertSafePublicTarget } from "../src/services/target-safety.js";

describe("target safety", () => {
  it.each(["http://example.com", "https://localhost", "https://127.0.0.1", "https://169.254.169.254"]) (
    "rejects %s before browser navigation",
    async (target) => {
      await expect(assertSafePublicTarget(target)).rejects.toThrow("not eligible");
    },
  );
});
