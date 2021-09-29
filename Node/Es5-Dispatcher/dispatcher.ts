import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";

let HEADERS = require("./headers.json");
let paginaErrore : string;

class Dispatcher{
    prompt : string = ">>> ";
    //Ogni listener è costituito da un json del tipo {risorsa:callback} e sono suddivisi in base al metodo di chiamata
    listeners : any = {
        "GET" : {},
        "POST" : {},
        "DELETE" : {},
        "PUT" : {},
        "PATCH" : {}
    };

    constructor(){
        init();
    }
    addListener(metodo : string, risorsa : string, callback : any){
        metodo = metodo.toUpperCase();
        if(this.listeners[metodo] != undefined){
            this.listeners[metodo][risorsa] = callback;
        }
        else{
            throw new Error("Metodo non valido");
        }
        /*if(metodo in this.listeners){
            stessa cosa di sopra
        }*/
    }  

    dispatch(req,res){
        let metodo = req.method;
        let url = _url.parse(req.url, true); //parsing della url ricevuta, sempre true così parsifica sempre anche i parametri

        let risorsa = url.pathname;
        let parametri = url.query;

        console.log(`${this.prompt} ${metodo} : ${risorsa} ${JSON.stringify(parametri)}`);

        if(risorsa.startsWith("/api/")){
            if(risorsa in this.listeners[metodo]){
                let _callback = this.listeners[metodo][risorsa];
                _callback(req,res);    //lancio la callback
            }
            else{
                res.writeHead(404, HEADERS.text);
                res.write("Servizio non trovato");  //il client si aspetta un json, in caso di errore al posto del json gli passiamo una stringa e non paginaErrore
                res.end();
            }
        }
        else{
            staticListener(req,res,risorsa);
        }
    }
}

function staticListener(req,res,risorsa){
    if(risorsa == "/"){
        risorsa = "/index.html";   
    }
    let fileName = "./static" + risorsa;
    _fs.readFile(fileName, function(err, data){
        if(!err){
            let header ={"Content-Type" : _mime.getType(fileName)} ;
            res.writeHead(200, header);
            res.write(data);
            res.end();
        }
        else{
            console.log(`     ${err.code}: ${err.message}`);
            // il browser si aspetta una pagina
            res.writeHead(404, HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    });
}

function init(){
    _fs.readFile("./static/error.html", function(err,data){
        if(!err){
            paginaErrore = data.toString();
        }
        else{
            paginaErrore = "<h1> Pagina non trovata </h1>";
        }
    })
}
module.exports = new Dispatcher();
