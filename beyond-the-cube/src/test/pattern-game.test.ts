import { describe, it, expect } from "vitest";
import { pickPattern } from "@/components/portfolio/PatternGame";

describe("pickPattern", () => {
  it("lights exactly the requested number of distinct tiles on the 3x3 grid", () => {
    const p = pickPattern(5);
    expect(p.size).toBe(5);
    for (const [i, c] of p) {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(9);
      expect(c).toBeLessThan(6);
    }
  });
});
