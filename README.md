# Bowling

## Run the score function (from the terminal)

The CLI runs the scorer with a single JSON array argument.

### Examples

Score frames where the 10th-frame bonuses are present:
```bash
npm run score -- '[4, 5, "X", 8, 1]'
```
Output:
```json
[9,19,9]
```

Wrap the JSON array in quotes so your shell doesn’t split it:
```bash
npm run score -- '[1, "X", 2]'
```

### Token format

Roll tokens:
- `0`–`9` (numbers) for pin counts
- `"X"` for a strike
- `"/"` for a spare (the second roll of a frame)

### Output + errors

`score(rolls)` returns an array of frame results for the frames that can be “started” with the provided tokens:
- `null` means the frame can’t be fully calculated yet (missing needed rolls for bonuses)
- invalid input throws an error (the CLI prints the error message)

If there are extra roll tokens beyond what’s allowed for 10 frames, the error message is:
- `invalid: too many rolls`

## Run tests

```bash
npm test
```

Tests are Jest-based and located in `src/score.test.js` and `src/parseInput.test.js`.

