const { score } = require("./score");

describe("score", () => {
  it("throws a helpful error for invalid roll value", () => {
    const input = [4, 5, "not a valid roll value"];
    expect(() => score(input)).toThrow("invalid: encountered invalid roll token");
  });

  it("handles an even number of rolls (only numbers)", () => {
    const input = [4, 5, 8, 1];
    const expected = [9, 9];

    expect(score(input)).toEqual(expected);
  });

  it("handles an odd number of rolls (only numbers)", () => {
    const input = [4, 5, 8, 1, 2];
    const expected = [9, 9, null];

    expect(score(input)).toEqual(expected);
  });

  it("throws a helpful error for invalid spare placement", () => {
    const input = [4, 5, "/"];
    expect(() => score(input)).toThrow("invalid: spare cannot be the first roll of a frame");
  });

  it("throws when a numeric roll is 10 (pins must be between 0 and 9)", () => {
    const input = [4, 5, 10];
    expect(() => score(input)).toThrow("invalid: pins must be between 0 and 9");
  });

  it("throws when the second roll of a normal frame is 10", () => {
    const input = [4, 5, 8, 10];
    expect(() => score(input)).toThrow("invalid: pins must be between 0 and 9 and sum to <= 10");
  });

  it("handles spares with 2 rolls after", () => {
    const input = [4, 5, 2, "/", 8, 1];
    const expected = [9, 18, 9];

    expect(score(input)).toEqual(expected);
  });

  it("handles spares with 1 roll after", () => {
    const input = [4, 5, 2, "/", 8];
    const expected = [9, 18, null];

    expect(score(input)).toEqual(expected);
  });

  it("handles strikes with 2 rolls after", () => {
    const input = [4, 5, "X", 8, 1];
    const expected = [9, 19, 9];

    expect(score(input)).toEqual(expected);
  });

  it("handles strikes with 1 roll after", () => {
    const input = [4, 5, "X", 8];
    const expected = [9, null, null];

    expect(score(input)).toEqual(expected);
  });

  it("handles 2 strikes in a row with no rolls after", () => {
    const input = [4, 5, "X", "X"];
    const expected = [9, null, null];

    expect(score(input)).toEqual(expected);
  });

  it("handles 2 strikes in a row with 1 roll after", () => {
    const input = [4, 5, "X", "X", "1"];
    const expected = [9, 21, null, null];

    expect(score(input)).toEqual(expected);
  });

  it("handles 2 strikes in a row with 2 rolls after", () => {
    const input = [4, 5, "X", "X", "1", "2"];
    const expected = [9, 21, 13, 3];

    expect(score(input)).toEqual(expected);
  });

  it("handles 3 strikes in a row with no rolls after", () => {
    const input = [4, 5, "X", "X", "X"];
    const expected = [9, 30, null, null];

    expect(score(input)).toEqual(expected);
  });

  it("handles 3 strikes in a row with 1 roll after", () => {
    const input = [4, 5, "X", "X", "X", "1"];
    const expected = [9, 30, 21, null, null];

    expect(score(input)).toEqual(expected);
  });

  it("handles 3 strikes in a row with 2 rolls after", () => {
    const input = [4, 5, "X", "X", "X", "1", "2"];
    const expected = [9, 30, 21, 13, 3];

    expect(score(input)).toEqual(expected);
  });

  it("scores a strike in the final (10th) frame when bonus rolls are present", () => {
    // Frames 1-9 are open frames of 0 + 0.
    // 10th frame is a strike, followed by two bonus rolls (0, 0).
    const input = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "X", 0, 0];
    const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 10];

    expect(score(input)).toEqual(expected);
  });

  it("scores a spare in the final (10th) frame when bonus roll is present", () => {
    // Frames 1-9 are open frames of 0 + 0.
    // 10th frame is a spare (6 + /), followed by one bonus roll (0).
    const input = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, "/", 0];
    const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 10];

    expect(score(input)).toEqual(expected);
  });

  it("throws if there are extra roll tokens beyond the allowed 10 frames", () => {
    // 9 open frames (18 rolls) + 10th strike needs 2 bonus rolls => 21 rolls total.
    // Add one extra roll token => should be invalid.
    const input = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "X", 0, 0, 0];
    expect(() => score(input)).toThrow("invalid: too many rolls");
  });

  it("throws if there are extra roll tokens beyond the allowed 10 frames for a 10th spare", () => {
    // 9 open frames (18 rolls) + 10th spare needs 1 bonus roll => 21 rolls total.
    // Add one extra roll token => should be invalid.
    const input = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, "/", 0, 0];
    expect(() => score(input)).toThrow("invalid: too many rolls");
  });
});

