function score(rolls) {
  const frameScores = [];
  let rollIndex = 0;

  const invalid = (message) => {
    throw new Error(message);
  };

  function isNumericString(s) {
    return typeof s === "string" && /^-?\d+$/.test(s.trim());
  }

  function numericTokenOutOfRange(token, min, max) {
    if (typeof token === "number") {
      return Number.isFinite(token) && Number.isInteger(token) && (token < min || token > max);
    }
    if (typeof token === "string" && isNumericString(token)) {
      const n = Number(token.trim());
      return n < min || n > max;
    }
    return false;
  }

  function numericPinsFromToken(token) {
    if (token === undefined) return { pins: null, invalid: false };
    if (typeof token === "number") {
      if (!Number.isFinite(token)) return { pins: null, invalid: true };
      if (!Number.isInteger(token)) return { pins: null, invalid: true };
      if (token < 0 || token > 9) return { pins: null, invalid: true };
      return { pins: token, invalid: false };
    }
    if (typeof token === "string" && isNumericString(token)) {
      const n = Number(token.trim());
      if (n < 0 || n > 9) return { pins: null, invalid: true };
      return { pins: n, invalid: false };
    }
    return { pins: null, invalid: true };
  }

  function pinsForRoll(i) {
    const r = rolls[i];
    if (r === undefined) return { pins: null, missing: true, invalid: false };

    if (r === "X") return { pins: 10, missing: false, invalid: false };

    if (r === "/") {
      const prevToken = rolls[i - 1];
      const prevPins = numericPinsFromToken(prevToken);
      if (i - 1 < 0) return { pins: null, missing: false, invalid: true };
      if (prevPins.invalid) return { pins: null, missing: false, invalid: true };
      return { pins: 10 - prevPins.pins, missing: false, invalid: false };
    }

    const n = numericPinsFromToken(r);
    if (n.invalid) return { pins: null, missing: false, invalid: true };
    return { pins: n.pins, missing: false, invalid: false };
  }

  for (let frame = 0; frame < 10 && rollIndex < rolls.length; frame++) {
    const first = rolls[rollIndex];
    const isFinalFrame = frame === 9;

    if (first === "/") {
      invalid("invalid: spare cannot be the first roll of a frame");
    }

    if (first === "X") {
      const b1 = pinsForRoll(rollIndex + 1);
      const b2 = pinsForRoll(rollIndex + 2);
      if (b1.missing || b2.missing) {
        frameScores.push(null);
      } else if (b1.invalid || b2.invalid) {
        invalid("invalid: encountered invalid roll token");
      } else {
        frameScores.push(10 + b1.pins + b2.pins);
      }
      rollIndex += isFinalFrame ? 3 : 1;
      continue;
    }
    const p1 = numericPinsFromToken(first);
    if (p1.invalid) {
      if (numericTokenOutOfRange(first, 0, 9)) {
        invalid("invalid: pins must be between 0 and 9");
      }
      invalid("invalid: encountered invalid roll token");
    }

    const second = rolls[rollIndex + 1];
    if (second === undefined) {
      frameScores.push(null);
      break;
    }

    if (second === "X") {
      invalid("invalid: strike cannot be the second roll of a frame");
    }

    if (second === "/") {
      const b = pinsForRoll(rollIndex + 2);

      if (p1.invalid || b.invalid) {
        invalid("invalid: spare requires valid rolls");
      }

      if (b.missing) {
        frameScores.push(null);
      } else {
        frameScores.push(10 + b.pins);
      }

      rollIndex += isFinalFrame ? 3 : 2;
      continue;
    }

    const p2 = numericPinsFromToken(second);
    if (p1.invalid || p2.invalid || p1.pins + p2.pins > 10) {
      invalid("invalid: pins must be between 0 and 9 and sum to <= 10");
    }

    frameScores.push(p1.pins + p2.pins);
    rollIndex += 2;
  }

  if (frameScores.length === 10 && rollIndex < rolls.length) {
    invalid("invalid: too many rolls");
  }

  return frameScores;
}

module.exports = { score };
