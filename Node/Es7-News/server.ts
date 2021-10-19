import * as http from "http";
import * as fs from "fs";
import HEADERS from "./headers.json";
import NEWS from "./notizie.json";

const dispatcher = require("./dispatcher.ts");

const PORT: number = 1337;

let server = http.createServer((req, res) => {
  dispatcher.dispatch(req, res);
});
server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);

//  registrazione dei servizi
dispatcher.addListener("GET", "/api/elenco", (req, res) => {
  res.writeHead(200, HEADERS.json);
  res.end(JSON.stringify(NEWS));
});

dispatcher.addListener("POST", "/api/dettagli", (req, res) => {
  let news = req["BODY"].news;
  let visualizzazioni;
  let dettagliNotizia: string;
  console.log(`./news/${news.file}`);
  fs.readFile(`./news/${news.file}`, (error, data) => {
    dettagliNotizia = data.toString();
    visualizzazioni = NEWS.find(
      (aus) => aus.titolo === news.titolo
    ).visualizzazioni += 1;
    fs.writeFile("./notizie.json", JSON.stringify(NEWS), () => {});
    res.writeHead(200, HEADERS.json);
    res.end(
      JSON.stringify({
        details: dettagliNotizia,
        visualizzazioni: visualizzazioni,
      })
    );
  });
});
