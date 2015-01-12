/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Printershop3 API                                           */
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

const PRICE_PER_PHOTO = 0.54;
const PRICE_PER_KM = 7.41;

const carrier_port = 6002;
const carrier_host = 'localhost';
const port = 5002;
const server_root = "http://localhost:" + port;


/***************************************************************/
/*                                                             */
/*    URL:    /printershop3                                    */
/*                                                             */
/*    GET    Retorna o preço por foto                          */
/*    POST   Enviar álbum para impressão                       */
/*															   */
/*	  Estado: Não testado       							   */
/***************************************************************/

app.route("/printershop3/checkPrices")
    .get(function(req,res){
        res.status(405).send("Not allowed.");
    })
    .post(function(req,res){

        var n_photos = req.body.n_photos;
        var n_kms = req.body.n_kms;

        var totalCost = {
            'cost': calculatePrice(n_photos, n_kms),
            'photosCost': calculatePhotosPrice(n_photos),
            'transportCost': calculateTransportPrice(n_kms)
        };

        res.status(200).send(totalCost);

    })
    .put(function(req,res){
        res.status(405).send("Not allowed.");
    })
    .delete(function(req,res){
        res.status(405).send("Not allowed.");
    });

app.route("/printershop3")
    .get(function(req,res){
        res.status(405).send("Not allowed.");        
    })
    .post(function(req,res){

        var theme = req.body.theme;
        var title = req.body.title;
        var message = req.body.message;
        var n_photos = req.body.n_photos;

        console.log("Recebido: " + theme);

        // Store this order and generate new ID
        var orderID = Math.floor(Math.random()*99999) + 1;

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


function calculatePhotosPrice(n_photos){
    return n_photos * PRICE_PER_PHOTO;
}

function calculateTransportPrice(n_kms){
    return ((n_kms * PRICE_PER_KM) / 1000);
}

function calculatePrice(n_photos, n_kms){
    var photosPrice =  calculatePhotosPrice(n_photos);
    var kmPrice = calculateTransportPrice(n_kms);
    var totalPrice = photosPrice + kmPrice;

    return totalPrice;
}

function orderCarrier(orderID, callback){

    var endpoint = '/carrier3';

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
    console.log("Printershop3 has started listening on port " + port);
});
