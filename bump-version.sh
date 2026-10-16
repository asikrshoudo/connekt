#!/usr/bin/env bash
set -euo pipefail
new=$(node -e '
const fs = require("fs");
const j = JSON.parse(fs.readFileSync("app.json", "utf8"));
let [a, b, c] = j.expo.version.split(".").map(Number);
if (c >= 9) { a += 1; b = 0; c = 1; } else { c += 1; }
j.expo.version = a + "." + b + "." + c;
j.expo.android.versionCode = (j.expo.android.versionCode || 0) + 1;
fs.writeFileSync("app.json", JSON.stringify(j, null, 2) + "\n");
console.log(j.expo.version);
')
git add app.json
git commit -m "Bump version to v$new"
git push
echo "Pushed v$new"
