import * as _http from "http";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
import * as _mongodb from "mongodb";
const mongoClient = _mongodb.MongoClient;

const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";


const dispatcher: Dispatcher = new Dispatcher();
const port: number = 1337;
/*const server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
})*/

//server.listen(port);
console.log("Server in ascolto sulla porta " + port);

//Modello di accesso al database
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        collection.find().toArray((err, data) => {
            if (!err) {
                console.log("FIND",data);
            }
            else {
                console.log("Errore esecuzione query" + err.message);
            }
            client.close();
        });
    }
    else {
        console.log("Errore di connessione al database");
    }
})

//Inserimento di un nuovo record
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        let student = { "nome": "Samuele", "cognome": "De Toffol", "indirizzo": "Informatica", "sezione": "B", "lavoratore" : false, "hobbies" : ["nuoto", "karate"], "residenza" : {"citta" : "Genola", "provincia" : "Cuneo", "CAP" : "12045"}};
        collection.insertOne(student, (err,data)=>{
            if (!err) {
                console.log("INSERT",data);
            }
            else {
                console.log("Errore esecuzione query" + err.message);
            }
            client.close();
        });
    }
    else {
        console.log("Errore di connessione al database");
    }
})
/*UPDATE*/
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        collection.updateOne({"nome":"Paolo"},{$set:{"residenza":"Fossano"}}, (err, data) => {
            if (!err) {
                console.log("UPDATEONE",data);
            }
            else {
                console.log("Errore esecuzione query" + err.message);
            }
            client.close();
        });
    }
    else {
        console.log("Errore di connessione al database");
    }
})

/*DELETE MANY*/

mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        collection.deleteMany({"residenza":"Fossano"}, (err, data) => {
            if (!err) {
                console.log("DELETE",data);
            }
            else {
                console.log("Errore esecuzione query" + err.message);
            }
            client.close();
        });
    }
    else {
        console.log("Errore di connessione al database");
    }
})