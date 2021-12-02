import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING =
  "mongodb+srv://admin:admin@cluster0.8rbom.mongodb.net/5B?retryWrites=true&w=majority";
const DB_NAME = "5B";

let port: number = 1337;
let app = express();

let server = http.createServer(app);

server.listen(port, () => {
  console.log("Server in ascolto sulla porta " + port);
  init();
});

let paginaErrore = "";
function init() {
  fs.readFile("./static/error.html", (err, data) => {
    if (!err) {
      paginaErrore = data.toString();
    } else {
      paginaErrore = "<h2>Risorsa non trovata</h2>";
    }
  });
}

/*********************************************************/
/********* elenco delle routes di tipo middleware ********/
/*********************************************************/

// 1 log
app.use("/", (req, res, next) => {
  console.log(" -----> " + req.method + " : " + req.originalUrl);
  next();
});

// 2 static route, se non trova la risorsa fa in automatico next
app.use("/", express.static("./static"));

// 3 route di lettura dei parametri post
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));

// 4 log parametri
app.use("/", (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    console.log("   Parametri get: ", req.query);
  }
  if (Object.keys(req.body).length > 0) {
    console.log("   Parametri body: ", req.body);
  }
  next();
});

/************************************************************/
/********* elenco delle routes di risposta al client ********/
/************************************************************/

app.use("/", (req, res, next) => {
  mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (err) {
      res.status(503).send("Db connection error");
    } else {
      console.log("Connection made");
      req["client"] = client;
      next();
    }
  });
});

// 5 richiesta get
app.get("/api/risorsa1", (req, res, next) => {
  let nome = req.query.name;
  if (nome) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection("unicorns");
    collection
      .find({ name: nome })
      .toArray()
      .then((data) => res.send(data))
      .catch((err) => res.status(503).send("Errore nella sintassi della query"))
      .finally(() => req["client"].close());
  } else {
    res.status(400).send("Parametro mancante: unicornName");
    req["client"].close();
  }
});

// 6 richiesta patch
app.patch("/api/risorsa1", (req, res, next) => {
  let nome = req.body.nome;
  let incVampires = req.body.vampires;
  if (nome && incVampires) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection("unicorns");
    collection
      .updateOne({ name: nome }, { $inc: { vampires: incVampires } })
      .then((data) => res.send(data))
      .catch((err) => res.status(503).send("Errore nella sintassi della query"))
      .finally(() => req["client"].close());
  } else {
    res.status(400).send("Numero parametri insufficiente");
    req["client"].close();
  }
});

// 7 Query 1
app.get("/api/risorsa3/:gender/:hair", (req, res, next) => {
  let genere = req.params.gender;
  let pelo = req.params.hair;
  //  if non serve dato che entra nella route solo in caso trovi i parametri
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection("unicorns");
  collection
    .find({ $and: [{ gender: genere }, { hair: pelo }] })
    .toArray()
    .then((data) => res.send(data))
    .catch((err) => res.status(503).send("Errore nella sintassi della query"))
    .finally(() => req["client"].close());
});

/**************************************************************************************/
/********* Default route(risorsa non trovata) e route di gestione degli errori ********/
/**************************************************************************************/

app.use("/", (req, res, next) => {
  res.status(404);
  if (req.originalUrl.startsWith("/api/")) {
    res.send("Risorsa non trovata");
  } else {
    res.send(paginaErrore);
  }
});
