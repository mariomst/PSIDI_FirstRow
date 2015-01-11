/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Carrier1 API                                               */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

/***************************************************************/
/*  Necessary Modules                                          */
/***************************************************************/

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

app.use(bodyParser.json());
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

const STATE_1 = "Em processo";
const STATE_2 = "Em transporte";
const STATE_3 = "Entregue";

const port = 6000;
const server = 'localhost'
const server_root = "http://" + server + ":" + port;
const TIMESPAN = 15000;

var orders = [];

/***************************************************************/
/*                                                             */
/*    URL:    /carrier1                                        */
/*                                                             */
/*    GET    Retorna o preço por foto                          */
/*    POST   Enviar álbum para impressão                       */
/*															   */
/*	  Estado: Não testado       							   */
/***************************************************************/



/***************************************************************/
/*  PARÂMETROS                                                 */
/***************************************************************/
app.param('orderID', function(req, res, next, orderID){
    req.orderID = orderID;
    return next()
})




/***************************************************************/
/*  FUNÇÕES                                                    */
/***************************************************************/
function setOrder(order_id, status){

    var order = getOrder(order_id);

    if(order != null){
        order.order_status = status;
        order.timestamp = new Date();
    }else{
        orders.push({
            'order_id': order_id,
            'order_status': status,
            'timestamp': new Date()
        });
    }
}

function getOrder(order_id){
    for(var i=0; i<orders.length; i++)
        if(orders[i].order_id == order_id)
            return orders[i];
    return null;
}






/***************************************************************/
/*  API                                                        */
/***************************************************************/
app.route("/carrier1/:orderID")
    .get(function(req, res){

        var order = getOrder(req.orderID);

        if(order == null)
            res.status(404).send("Order ID# " + req.orderID + " was not found.");
        else
            res.status(200).send(order);

    })
;

// retornar a link para o printershop para verificar o estado desta encomenda
app.route("/carrier1")
    .get(function(req,res){
        res.status(405).send("Not allowed.");
    })
    .post(function(req,res){

        var order_id = req.body.order_id;
        //var status_link = req.body.status_link;

        // Test if order is already processed
        var test_order = getOrder(order_id);
        if(test_order == null){


            // Make response
            var response = {
                'order_id': order_id,
                'check_status': server_root + '/carrier1/' + order_id,
                'carrierHost': server,
                'carrierPort': port,
                'carrierEndPoint': '/carrier1/' + order_id,
                'error': 'false'
            };
            res.status(200).send(response);


            // Store order
            setOrder(order_id, STATE_1);
            console.log("Order #" + order_id + " is being processed...");


            // In TIMESPAN seconds, change order status to "em transporte"
            setTimeout(function(){
                setOrder(order_id, STATE_2);
                console.log("Order #" + order_id + " is being delivered...");

                setTimeout(function(){
                    setOrder(order_id, STATE_3);
                    console.log("Order #" + order_id + " was successfully delivered!");
                }, TIMESPAN);

            }, TIMESPAN);


        }else{

            // Make response
            var response = {
                'error': 'true',
                'check_status': server_root + '/carrier1/' + test_order.order_id,
                'message': 'The order already exists on our system.'
            };
            res.status(406).send(response);
        }

    })
    .put(function(req,res){
        res.status(405).send("Not allowed.");
    })
    .delete(function(req,res){
        res.status(405).send("Not allowed.");
    });

	
/***************************************************************/
/*  Starting...                                                */
/***************************************************************/

app.listen(port, function(){
    console.log("Carrier1 has started listening on port " + port);
});
