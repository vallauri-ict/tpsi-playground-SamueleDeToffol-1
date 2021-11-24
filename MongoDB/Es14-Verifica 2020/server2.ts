import * as http from "http";
import * as mongodb from "mongodb";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";

const PORT: number = 1337;
const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

//2
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("Vallauri")
      .aggregate([
        {
          $project: {
            mediaItaliano: { $avg: "$italiano" },
            mediaInformatica: { $avg: "informatica" },
            mediaSistemi: { $avg: "sistemi" },
            mediaMatematica: { $avg: "matematica" },
            classe: 1,
          },
        },
        {
          $project: {
            mediaStudente: {
              $avg: [
                "$mediaItaliano",
                "$mediaInformatica",
                "$mediaSistemi",
                "$mediaMatematica",
              ],
            },
            classe: 1,
          },
        },
        {
          $group: {
            _id: "$classe",
            mediaClasse: { $avg: "$mediaStudente" },
          },
        },
        {
          $sort: {
            mediaClasse: -1,
          },
        },
        {
          $project: {
            mediaOrdinata: { $round: ["$mediaClasse", 2] },
          },
        },
      ])
      .toArray()
      .then((data) => {
        console.log("Query 2", data);
      })
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//3
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("Vallauri").updateMany(
      { $and: [{ genere: "f" }, { classe: "4A" }] },
      { $push: { informatica: 7 as never } },
      (err, data) => {
        if (!err) {
          console.log("Query 3", data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//4
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("Vallauri").deleteMany(
      { sistemi: { $in: [3] } },
      (err, data) => {
        if (!err) {
          console.log("Query 4", data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


//2
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("Vallauri")
      .aggregate([
        {
          
        }
      ])
      .toArray()
      .then((data) => {
        console.log("Query 2", data);
      })
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});