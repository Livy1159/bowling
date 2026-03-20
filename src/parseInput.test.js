const { spawnSync } = require("node:child_process");
const path = require("node:path");

describe("parseInput", () => {
  const entryPath = path.join(__dirname, "parseInput.js");

  it("fails when there are no arguments", () => {
    const result = spawnSync(process.execPath, [entryPath], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Expected Format:");
  });

  it("fails when input is not a single array argument", () => {
    const result = spawnSync(process.execPath, [entryPath, "4", "5", "X", "8", "1"], {
      encoding: "utf8",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Expected Format:");
    expect(result.stderr).toContain('npm run score -- \'[4, 5, "X", 8, 1]\'');
  });

  it("fails when input is invalid JSON", () => {
    const result = spawnSync(process.execPath, [entryPath, '[4, 5, "X"'], {
      encoding: "utf8",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Could not parse JSON array input.");
  });

  it("fails when JSON parses but is not an array", () => {
    const result = spawnSync(process.execPath, [entryPath, "123"], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Expected a JSON array like");
  });

  it("prints frame scores when given a valid JSON array", () => {
    const input = '[4, 5, "X", 8, 1]';
    const result = spawnSync(process.execPath, [entryPath, input], { encoding: "utf8" });

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('[9,19,9]');
  });

  it("prints the scoring error when the roll tokens are invalid", () => {
    const input = '[4, 5, "%"]';
    const result = spawnSync(process.execPath, [entryPath, input], { encoding: "utf8" });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("invalid: encountered invalid roll token");
  });
});

