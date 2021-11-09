const [{}, {}, _dir] = process.argv;
if (!_dir) return console.log("No directory specified");

const fs = require("fs");
const { resolve } = require("path");

const dir = resolve(__dirname, "..", _dir);
const files = fs.readdirSync(dir);

const unique = [];
files.forEach(file => {
  const data = fs.readFileSync(resolve(dir, file));
  for (const { _file, _data } of unique) {
    if (_data.equals(data)) {
      console.log("Deleting " + file + " since it is equal to " + _file);
      fs.unlinkSync(resolve(dir, file));
      return;
    }
  }

  unique.push({ _file: file, _data: data });
});

console.log("Finished");