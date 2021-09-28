import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
let HEADERS = require("headers.json");
let paginaErrore : string;

class Dispatcher{
    prompt : string = ">>>";
    //Ogni listener è costituito da un json del tipo {risorsa:callback} e sono suddivisi in base al metodo di chiamata
    listeners : any = {
        "GET" : {},
        "POST" : {},
        "DELETE" : {},
        "PUT" : {},
        "PATCH" : {}
    };
    constructor(){

    }
    addListener(metodo : string, risorsa : string, callback : any){
        metodo = metodo.toUpperCase();
        if(this.listeners[metodo] != undefined){
            this.listeners[metodo][risorsa] = callback;
        }
        else{
            throw new Error("metodo non valido");
        }
        /*if(metodo in this.listeners){
            stessa cosa di sopra
        }*/
    }
}
