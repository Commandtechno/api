const [{}, {}, _dir, _path] = process.argv;
if (!_dir) return console.log("No directory specified");
if (!_path) return console.log("No path specified");

const fs = require("fs");
const http = require("http");
const https = require("https");
const mime = require("mime-types");
const { extname, basename, resolve } = require("path");

const dir = resolve(__dirname, "..", _dir);
const path = resolve(__dirname, "..", _path);

const urls = JSON.parse(fs.readFileSync(path));
const files = fs
  .readdirSync(dir)
  .map(file => basename(file, extname(file)))
  .filter(file => parseInt(file));

let index = Math.max(...files);
if (!isFinite(index)) index = 0;

function download() {
  const url = urls.shift();
  if (!url) return console.log("Finished");

  let { get } = url.startsWith("https") ? https : http;
  get(url, res => {
    if (res.statusCode !== 200) {
      console.log("Responded with " + res.statusCode + ": " + url);
      download();
      return;
    }

    const ext = mime.extension(res.headers["content-type"]);
    if (!ext) {
      console.log("No extension found: " + url);
      download();
      return;
    }

    const file = resolve(dir, index + "." + ext);
    res.pipe(fs.createWriteStream(file));
    res.on("end", () => {
      console.log("Downloaded " + url + " to " + file);
      index++;
      download();
    });
  });
}

download();