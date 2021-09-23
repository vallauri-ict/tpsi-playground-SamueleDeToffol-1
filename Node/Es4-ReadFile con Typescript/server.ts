"use strict"

import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
const HEADERS = require("./headers.json")

const PORT: number = 1337;
let paginaErrore: string;

var server = _http.createServer(function (req, res) {
    let metodo = req.method;
    let url = _url.parse(req.url, true); //parsing della url ricevuta, sempre true così parsifica sempre anche i parametri

    let risorsa = url.pathname;
    let parametri = url.query;

    console.log(`Richiesta: ${metodo}-${risorsa}, param: ${JSON.stringify(parametri)}`);

    if (risorsa == "/") {
        risorsa = "/index.html";
    }
    if (!risorsa.startsWith("/api/")) {
        risorsa = "./static" + risorsa;
        _fs.readFile(risorsa, function (error, data) {
            if (!error) {
                //se gettype non funziona usare lookup
                let header = { "Content-Type": _mime.getType(risorsa) };
                res.writeHead(200, header);
                res.write(data);
                res.end();
            }
            else {
                //alert(error);
                res.writeHead(404, HEADERS.html);
                res.write(paginaErrore);
                res.end();
            }
        });
    }
    else if (risorsa === "/api/servizio1") {
        //Gestione servizio1
        let json = { "ris": "ok" };
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify(json));
        res.end();
    }
    else {
        res.writeHead(404, HEADERS.text)
        res.write("Servizio non trovato");
        res.end();
    }
});

server.listen(PORT, function () {
    _fs.readFile("./static/error.html", function (error, data) {
        if (!error) {
            paginaErrore = data.toString();
        }
        else {
            paginaErrore = "Pagina non trovata";
        }
    });

    console.log("Server avviato correttamente sulla porta " + PORT)
});
