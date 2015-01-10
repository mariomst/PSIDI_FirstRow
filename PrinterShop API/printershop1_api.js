/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Printershop1 API                                           */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

/***************************************************************/
/*  Necessary Modules                                          */
/***************************************************************/

var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var http = require('http');
var querystring = require('querystring');

var app = express();

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Requested-With, Accept");
    if ('OPTIONS' == req.method){
        return res.sendStatus(200);
    }
    next();
});


/***************************************************************/
/* Global variables                                            */
/***************************************************************/

const PRICE_PER_PHOTO = 1;
const PRICE_PER_KM = 10;

const carrier_port = 6000;
const carrier_host = 'localhost';
const port = 5000;
const server_root = "http://localhost:" + port;


/***************************************************************/
/*                                                             */
/*    URL:    /printershop1                                    */
/*                                                             */
/*    GET    Retorna o preço por foto                          */
/*    POST   Enviar álbum para impressão                       */
/*															   */
/*	  Estado: Não testado       							   */
/***************************************************************/
app.route("/printershop1")
    .get(function(req,res){

        var response = {
            'individualPrice': PRICE_PER_PHOTO,
            'kmPrice': PRICE_PER_KM
        };

        res.status(200).send(response);
        
    })
    .post(function(req,res){

        var theme = req.body.theme;
        var title = req.body.title;
        var message = req.body.message;
        var n_photos = req.body.n_photos;

        console.log("Recebido: " + theme);

        // Store this order and generate new ID
        var orderID = 1;

        // Prepare order on carrier
        orderCarrier(orderID, function(carrier_res){
            console.log("PS: Responded");
            res.status(200).send(carrier_res);
        });



    })
    .put(function(req,res){
        res.status(405).send("Not allowed.");
    })
    .delete(function(req,res){
        res.status(405).send("Not allowed.");
    });


function orderCarrier(orderID, callback){

    var endpoint = '/carrier1';

    var request = {
        'order_id': orderID
    };

    var data = querystring.stringify(request);
    console.log("Sending " + data + " ...");

    // Set request options
    var options = {
        host: carrier_host,
        port: carrier_port,
        path: endpoint,
        method: 'POST',
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': Buffer.byteLength(data)
        }
    };

    console.log("Connecting " + carrier_host + ":" + carrier_port + endpoint);

    var req = http.request(options, function(response){
        
        var str = '';

        response.on('data', function(chunk){
            str += chunk;
        });

        response.on('end', function(){
            var resposta = JSON.parse(str);

            complete(resposta);

        });

    });

    complete = function(res){
        callback(res);
    };

    req.write(data);
    req.end();
}
	
/***************************************************************/
/*  Starting...                                                */
/***************************************************************/

app.listen(port, function(){
    console.log("Printershop1 has started listening on port " + port);
});
