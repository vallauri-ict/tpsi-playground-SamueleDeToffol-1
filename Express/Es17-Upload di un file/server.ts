//#region import
import * as http from "http";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import express from "express";
import * as mongodb from "mongodb";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import ENVIRONMENT from "./environment.json";
import cloudinary from "cloudinary";
//#endregion
cloudinary.v2.config({
  cloud_name: ENVIRONMENT.CLOUDINARY.CLOUD_NAME,
  api_key: ENVIRONMENT.CLOUDINARY.API_KEY,
  api_secret: ENVIRONMENT.CLOUDINARY.API_SECRET,
});
//#region mongoDB
const mongoClient = mongodb.MongoClient;
// const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";
//#endregion

const PORT: number = parseInt(process.env.PORT) || 1337;
const app = express();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta: ${PORT}`);
  init();
});

let paginaErrore = "";
function init() {
  fs.readFile("./static/error.html", (err, data) => {
    if (!err) paginaErrore = data.toString();
    else paginaErrore = "<h2>Risorsa non trovata</h2>";
  });
}

/*  ******************************************
    //  elenco delle routes middleware
    ****************************************** */

//  1. Log
app.use("/", (req, res, next) => {
  console.log("---> ", req.method + ": " + req.originalUrl);
  next();
});

//  2. Static route
app.use("/", express.static("./static")); //  next fa in automatico

//  3. Route lettura paramentri post con impostazione del limite per le immagini in base 64
app.use("/", bodyParser.json({"limit":"10mb"}));
app.use("/", bodyParser.urlencoded({ extended: true , "limit":"10mb"}));

//  4. Log dei parametri
app.use("/", (req, res, next) => {
  if (Object.keys(req.query).length > 0) console.log("GET --->", req.query);
  if (Object.keys(req.body).length > 0) console.log("BODY --->", req.body);
  next();
});

//  5. Connessione al DB
app.use("/", (req, res, next) => {
  mongoClient.connect(process.env.MONGODB_URI || ENVIRONMENT.CONNECTION_STRING, (err, client) => {
    if (err) res.status(503).send("DB connection error");
    else {
      req["client"] = client;
      next();
    }
  });
});

//  6. Middleware cors
const whitelist = [
  "http://localhost:4200",
  "http://localhost:1337",
  "https://detoffolsamuele-crudserver.herokuapp.com",
  "http://detoffolsamuele-crudserver.herokuapp.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    } else return callback(null, true);
  },
  credentials: true,
};
app.use("/", cors(corsOptions) as any);

// 7. File Upload
app.use(
  fileUpload({
    limits: { "fileSize": (10 * 1024 * 1024) }
  })
);

/*  ******************************************
    elenco delle routes di risposta al client
    ****************************************** */

//  middleware di intercettazione dei parametri
let currentCollection: string = "";
let id: string = "";

app.use("/api/:collection/:id?", (req, res, next) => {
  currentCollection = req.params.collection;
  id = req.params.id;
  next();
});

//  listener specifici

app.get("/api/images", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection("images");
  collection
    .find()
    .toArray()
    .then((data) => res.send(data))
    .catch((err) => res.status(503).send("QUERY: Syntax error"))
    .finally(() => req["client"].close());
});

app.post("/api/uploadBinary", (req, res, next) => {
  if (!req.files || Object.keys(req.files).length == 0 || !req.body.username)
    res.status(400).send("No files were uploaded");
  else {
    let file = req.files.img as UploadedFile;
    file.mv("./static/img/" + file["name"], function (err) {
      if (err) res.status(500).json(err.message);
      else {
        let db = req["client"].db(DB_NAME) as mongodb.Db;
        let user = { username: req.body.username, img: file.name };
        let collection = db.collection("images");
        collection
          .insertOne(user)
          .then((data) => res.send(data))
          .catch((err) => res.status(503).send("QUERY: Syntax error"))
          .finally(() => req["client"].close());
      }
    });
  }
});

app.get("/api/uploadBase64", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection("images");
  collection
    .insertOne(req.body)
    .then((data) => res.send(data))
    .catch((err) => res.status(503).send("QUERY: Syntax error"))
    .finally(() => req["client"].close());
});

app.post("/api/cloudinaryBinario", (req, res, next) => {
  
});

/*  ******************************************
  default route e route di gestione degli errori
    ****************************************** */

app.use("/", (req,res,next)=>{
  res.status(404);
  res.send("Risorsa non trovata");
})

app.use("/", (err, req, res, next) => {
  console.log("**** ERRORE SERVER ***** " + err); //  da correggere
});
