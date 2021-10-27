import * as _http from "http";
import HEADERS from "./headers.json";
import {Dispatcher} from "./dispatcher";
import * as _mongodb from "mongodb";
const mongoClient = _mongodb.MongoClient;

const dispatcher : Dispatcher= new Dispatcher();
const port : number = 1337;
const server = _http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("Server in ascolto sulla porta " + port);


mongoClient.connect("mongodb://127.0.0.1:27017", (err,client)=>{
    if(!err){
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        collection.find().toArray((err,data)=>{
            if(!err){
                console.log(data);
            }
            else{
                console.log("Errore esecuzione query" + err.message);
            }
            client.close();
        });
    }
    else{
        console.log("Errore di connessione al database");
    }
})

