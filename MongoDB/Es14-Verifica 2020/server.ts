import * as _http from "http";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

let dispatcher: Dispatcher = new Dispatcher();
let port: number = 1337;
let server = _http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
});
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

//registrazione dei servizi
dispatcher.addListener("POST", "/api/servizio1", function (req, res) {
  let dataStart = new Date(req["BODY"].dataStart);
  let dataEnd = new Date(req["BODY"].dataEnd);
  //1
  mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (!err) {
      let db = client.db(DB_NAME);
      db.collection("Vallauri")
        .find({
          $and: [{ $gte: { dob: dataStart } }, { $lte: { dob: dataEnd } }],
        })
        .project({ nome: 1, classe: 1 })
        .toArray()
        .then((data) => {
          console.log("Query 1", data);
          res.writeHead(200, HEADERS.json);
          res.write(JSON.stringify({ ris: "ok" }));
          res.end();
        })
        .catch((err) => {
          console.log("Errore esecuzione query: " + err.message);
        })
        .finally(() => {
          client.close();
        });
    } else {
      console.log("Errore connessione al db: " + err.message);
    }
  });

});
