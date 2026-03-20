const { score } = require("./score");

function usage() {
  console.error("Expected Format:");
  console.error('  npm run score -- \'[4, 5, "X", 8, 1]\'');
}

const rawArgs = process.argv.slice(2);
if (rawArgs.length !== 1) {
  usage();
  process.exit(1);
}

let values;
try {
  const parsed = JSON.parse(rawArgs[0]);
  if (!Array.isArray(parsed)) {
    console.error('Expected a JSON array like \'[1, "X", 2]\'' );
    process.exit(1);
  }
  values = parsed;
} catch (err) {
  console.error("Could not parse JSON array input.");
  console.error(String(err));
  process.exit(1);
}

try {
  const result = score(values);
  console.log(JSON.stringify(result));
} catch (err) {
  const message = err && typeof err.message === "string" ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
