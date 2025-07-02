const { log } = require("console");
const http = require("http");
const event = require("events");
const eventEmitter = new event();
const fs = require("fs");
const path = require("path");

eventEmitter.on("fetch", (callback) => {
  fetch(`https://jsonplaceholder.typicode.com/comments`)
    .then((res) => res.json())
    .then((data) => callback(data));
});

const server = http.createServer((req, res) => {
  if (req.url == "/post") {
    eventEmitter.emit("fetch", (data) => {
      const targetpath = path.join(__dirname, "path.json");
      fs.writeFile(targetpath, JSON.stringify(data), (err) => {
        if (err) {
          return log("error from write file", err);
        }
      });
      fs.readFile(targetpath, "utf8", (err, data) => {
        res.end(data);
      });
    });
  }
});

server.listen(4000, () => {
  console.log(`this is my server: host: http://localhost:4000`);
});
