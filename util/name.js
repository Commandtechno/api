const [{}, {}, _dir] = process.argv;
if (!_dir) return console.log("No directory specified");

const fs = require("fs");
const { basename, extname, resolve } = require("path");

const dir = resolve(__dirname, "..", _dir);
const files = fs.readdirSync(dir).sort((a, b) => {
  const aName = parseInt(basename(a, extname(a)));
  if (!aName) return 1;

  const bName = basename(b, extname(b));
  if (!bName) return;

  if (aName > bName) return 1;
  if (aName < bName) return -1;
  return 0;
});

files.forEach((file, index) => {
  const ext = extname(file);
  const from = resolve(dir, file);
  const to = resolve(dir, index + ext);
  if (from === to) return;

  fs.renameSync(from, to);
  console.log("Renamed " + from + " to " + to);
});

console.log("Finished");