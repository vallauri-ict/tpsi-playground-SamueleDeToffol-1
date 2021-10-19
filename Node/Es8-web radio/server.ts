import * as http from "http";
import * as fs from "fs";
import HEADERS from "./headers.json";
import RADIOS from "./radios.json";
import STATES from "./states.json";

const dispatcher = require("./dispatcher.ts");

const PORT: number = 1337;

let init = () => {
  STATES.map((region) => {
    let aus = RADIOS.filter((radio) => radio.state == region.value);
    region.stationcount = aus.length.toString();
  });
  // fs.writeFile("./states.json", JSON.stringify(STATES), () =>
  //   console.log("finish")
  // );
};

let server = http.createServer((req, res) => {
  dispatcher.dispatch(req, res);
});
init();
server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);

//  registrazione dei servizi
dispatcher.addListener("GET", "/api/elenco", (req, res) => {
  res.writeHead(200, HEADERS.json);
  res.end(JSON.stringify(STATES));
});

dispatcher.addListener("POST", "/api/radio", (req, res) => {
  let region = req["BODY"].region;
  let radios;
  if (region === "tutti") {
    radios = RADIOS;
  } else radios = RADIOS.filter((radio) => radio.state == region);
  res.writeHead(200, HEADERS.json);
  res.end(JSON.stringify(radios));
});

dispatcher.addListener("POST", "/api/updateLike", (req, res) => {
  let id = req["BODY"].radioId;
  console.log(id);
  let aus;
  for (let radio of RADIOS) {
    if (radio.id === id) {
      radio.votes = (parseInt(radio.votes) + 1).toString();
      aus = radio.votes;
      break;
    }
  }
  fs.writeFile("./radios.json", JSON.stringify(RADIOS), () => {});
  res.writeHead(200, HEADERS.json);
  console.log(aus);
  res.end(JSON.stringify(aus));
});
