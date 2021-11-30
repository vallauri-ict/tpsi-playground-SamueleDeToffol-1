import express from "express";
import * as _http from "http";

let port: number = 1337;
let app = express();

let server = _http.createServer(app);

server.listen(port, () => {
  console.log("Server in ascolto sulla porta " + port);
});

//elenco delle routes(listener)

app.use("*", (req, res, next) => {
  console.log(" -----> " + req.method + " : " + req.originalUrl);
  next();
});

app.get("*", (req, res, next) => {
  res.send("This is the response");
});
