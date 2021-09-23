
const _http = require("http");
const _url = require("url");

const HEADERS = require("./headers.json")

const _colors=require("colors");

const port = 1337;    //porta storica nodejs

let server=_http.createServer(function (req, res) {  //crea un web server e restituisce un puntatore ma non lo avvia
    /* Prima prova
    
    res.writeHead(200, HEADERS.text);
    res.write("Richiesta eseguita correttamente");
    res.end();

    console.log("Ok");*/
    //LETTURA DI METODO RISORSA E PARAMETRI
    let metodo = req.method;
    let url = _url.parse(req.url,true); //parsing della url ricevuta, sempre true così parsifica sempre anche i parametri

    let risorsa= url.pathname;
    let parametri=url.query;
    let dominio=req.headers.host;

    res.writeHead(200,HEADERS.html);
    res.write("<h1> Informazioni relative alla Richiesta ricevuta</h1>")
    res.write("<br>")
    res.write(`<p><b>Risorsa richiesta:</b> ${JSON.stringify(risorsa)}</p>`);
    res.write(`<p><b>Metodo:</b> ${JSON.stringify(metodo)}</p>`);
    res.write(`<p><b>Parametri:</b> ${JSON.stringify(parametri)}</p>`);
    res.write(`<p><b>Dominio:</b> ${JSON.stringify(dominio)}</p>`);
    res.write(`<p>Grazie per la richiesta</p>`);
    res.end();

    console.log("Richiesta ricevuta: "+req.url.yellow);
});

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port);
console.log("server in ascolto sulla porta " + port);
