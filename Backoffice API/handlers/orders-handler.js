/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Node module to handle orders resource              		   */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

/***************************************************************/
/*  Necessary Modules                                          */
/***************************************************************/

var sqlite3 = require('sqlite3').verbose();
var printershophandler = require('./printershop-handler');
var printAlbumsHandler = require('./printAlbums-handler');
var geohandler = require('./geolocation-handler');
var util = require('./util/util');

/***************************************************************/
/*  Database                                                   */
/***************************************************************/

var file = "./database/myphotoalbum.db";

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function createOrder(userID, distance, dealedPrinterShopID, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, state, expirationDate, result){
	//query para criar uma order.	
	var query = "INSERT INTO ORDERS (userID, dealedPrinterShopID, distance, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, confirmed, state, expirationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);

	var orderID = "";
	
	//criar novo álbum
	db.serialize(function(){
		console.log("INFO: Creating order with the following information:");
		console.log("-> userID: " + userID);
		console.log("-> dealedPrinterShopID: " + dealedPrinterShopID);
		console.log("-> distance: " + distance);
		console.log("-> realPrintPrice: " + realPrintPrice);
		console.log("-> realTransportPrice: " + realTransportPrice);
		console.log("-> dealedPrintPrice: " + dealedPrintPrice);
		console.log("-> dealedTransportPrice: " + dealedTransportPrice);
		console.log("-> address: " + address);
		console.log("-> confirmed: false");
		console.log("-> state: " + state);
		console.log("-> expirationDate: " + expirationDate);
		
		db.run(query, userID, dealedPrinterShopID, distance, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, 'false', state, expirationDate, function(err){
			//assumindo que isto contem o ID;
			orderID = "{\"orderID\":" + this.lastID + "}";
			result(JSON.parse(orderID));
		});
		
		console.log("Info: Order created");		
		
		db.close();
	});
}

function getAllUserOrders(userID, result){
	//query para obter todas as encomendas de um utilizador
	var query = "SELECT * FROM ORDERS WHERE userID=" + userID;

	var orders_json = "[";

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	console.log("\nINFO: Getting all orders of the user with id " + userID + "."); 	

	db.each(query, 
		function(err, row){
			if(err) return callback(err);
		},
		function(err, row){
			if(err) return callback(err);
			if(row !== undefined){
				//criar string json para cada encomenda 
				var order_json = "{\"orderID\":" + row.orderID
					 + ",\"userID\":" + row.userID
					 + ",\"distance\":" + row.distance
					 + ",\"dealedPrinterShopID\":" + row.dealedPrinterShopID
					 + ",\"realPrintPrice\":" + row.realPrintPrice
					 + ",\"realTransportPrice\":" + row.realTransportPrice
					 + ",\"dealedPrintPrice\":" + row.dealedPrintPrice
					 + ",\"dealedTransportPrice\":" + row.dealedTransportPrice
					 + ",\"address\":\"" + row.address + "\""
					 + ",\"confirmed\":\"" + row.confirmed + "\""
					 + ",\"state\":\"" + row.state + "\""
					 + ",\"expirationDate\":\"" + row.expirationDate + "\"}";

				handler(order_json);		
			}
		},
		function(err, row){
				completed();
		}		
	);	

	var first = true;
	
	var handler = function(json){		
		if(!first){
			orders_json += ",";
		} else {
			first = false;
		}
		orders_json += json;
	};

	var completed = function(){
		orders_json += "]";
		result(JSON.parse(orders_json));
	};

	//fechar instância da db.
	db.close();
} 

function getSpecificOrder(orderID, result){
	//query para obter uma encomenda especifica
	var query = "SELECT * FROM ORDERS WHERE orderID=" + orderID;

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	var order_json = "";

	//obter encomenda
	db.get(query, 
		function(err, row){
			if(err) return callback(err);
		},
		function(err, row){			
			//if(err) return callback(err);			
			if(row !== undefined){
				var order_json = "{\"orderID\":" + row.orderID
					 + ",\"userID\":" + row.userID
					 + ",\"distance\":" + row.distance
					 + ",\"dealedPrinterShopID\":" + row.dealedPrinterShopID
					 + ",\"realPrintPrice\":" + row.realPrintPrice
					 + ",\"realTransportPrice\":" + row.realTransportPrice
					 + ",\"dealedPrintPrice\":" + row.dealedPrintPrice
					 + ",\"dealedTransportPrice\":" + row.dealedTransportPrice
					 + ",\"address\":\"" + row.address + "\""
					 + ",\"confirmed\":\"" + row.confirmed + "\""
					 + ",\"state\":\"" + row.state + "\""
					 + ",\"expirationDate\":\"" + row.expirationDate + "\"}";
	
				completed(JSON.parse(order_json));			
			} else {
				completed({});
			}
		}
	);

	var completed = function(json){
		result(json);
	};

	//fechar instância da db.
	db.close();
}
 
function updateOrder(){}

function deleteOrder(){}

/***************************************************************/
/*  Handler Functions                                          */
/***************************************************************/

//obter todos as encomendas
function handleGetOrders(req, res){
	getAllUserOrders(req.userID, function(result){
		res.status(200).send(result);
	});
};

//criar nova encomenda
function handlePostOrders(req, res){
	var userID = req.userID;
	var distance = req.body.distance || 0;
	var dealedPrinterShopID = req.body.dealedPrinterShopID || 0;
	var realPrintPrice = req.body.realPrintPrice || 0;
	var realTransportPrice = req.body.realTransportPrice || 0;
	var dealedPrintPrice = req.body.dealedPrintPrice || 0;
	var dealedTransportPrice = req.body.dealedTransportPrice || 0;
	var address = req.body.address || "Unknow";
	var state = req.body.state || "Lost in Space";
	var expirationDate = req.body.expirationDate || "01-01-2999";

	//create new order
	createOrder(userID, distance, dealedPrinterShopID, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, state, expirationDate, function(result){
		res.status(201).send(result);
	});

};

//não interessa
function handlePutOrders(req, res){
	res.status(405).send("Not allowed.");
};

//não interessa
function handleDeleteOrders(req, res){
	res.status(405).send("Not allowed.");
};

//obter ordem especifica
function handleGetOrderItem(req, res){
	getSpecificOrder(req.orderID, function(result){
		res.status(200).send(result);
	});
};

//atualizar encomenda
function handlePostOrderItem(req, res){

        // Do not forget to check fields null undefined

        var confirmed = req.body.confirmed;

        if(confirmed == 'true'){        // Process order

            var orderID = req.orderID;
            var userID = req.userID;

            //verificar se existe order
            getSpecificOrder(orderID, userID, function(order){

                // Mockup
                //order = ordershandler.newOrder('1', '1', '100', '100', '0', '0', '0', '0', 'Porto', 'false', 'estado', '');
                console.log("Address: " + order.address);

                if(order != 'undefined'){
                    // Get order's printer album (order.printAlbumID)
                    printAlbumsHandler.getSpecificPrintAlbum(1, function(printAlbum){

                        printAlbum = {
                            'userID': 1,
                            'theme': 'pissas',
                            'message': 'mensagem',
                            'photos': [
                                {
                                    'id': 1,
                                    'albumid': 1,
                                    'photo': 'abcde',
                                    'date': '12345'
                                }
                            ]
                        };

                        // Request printershop for order
                        printershophandler.processOrder(printAlbum, order, function(processedOrder){
                            console.log("Chegou ao backoffice");

                            console.log("ID# " + processedOrder.order_id);

                            // Update order status

                            // Respond to App
                            res.status(200).send(processedOrder);
                        });


                    });

                }else{

                }
            });


        }else{                          // Store order only and calculate best prices


            // Input params
            var address = req.body.address;
            var printAlbumID = req.body.printAlbum;


            // Verificar se o printAlbumID existe


            /*
            Calculate distance
            geohandler.calcEstimatedDistance(address, '38.7436266','-9.1602037',function(distance){
                console.log("Distance is " + distance);
            });
            */


            /*
            Calculate dealed prices
            */
          	var printAlbum = {
                'userID': 1,
                'theme': 'pissas',
                'message': 'mensagem',
                'photos': [
                    {
                        'id': 1,
                        'albumid': 1,
                        'photo': 'abcde',
                        'date': '12345'
                    }
                ]
            };

            var n_photos = printAlbum.photos.length;
            var dist = 155;


            /*
            Generate new order
            */
         	var userID = req.userID;
            var dealedPrinterShopID = 0;
            var distance = 123;
            var realPrintPrice = 0;
            var realTransportPrice = 0;
            var dealedPrintPrice = util.calculateAlbumPrice(n_photos);
            var dealedTransportPrice = util.calculatePriceByDistance(dist);
            var expirationDate = new Date().getTime();      // Adicionar timeout de 5min para a order

            /*
            createOrder(userID, dealedPrinterShopID, distance, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, 'false', expirationDate, function(newOrder){

                console.log(newOrder);

                // Respond to App
                //res.status(405).send("Not allowed.");
                
                // Calculate real prices
                // Pick best price
                // Store order

            });
			*/

            var response = {

            };

        }
};

//não interessa
function handlePutOrderItem(req, res){
	res.status(405).send("Not allowed.");
};

//eliminar encomenda
function handleDeleteOrderItem(req, res){
	res.status(404).send("Not implemented yet.");
};

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.handleGetOrders = handleGetOrders;
exports.handlePostOrders = handlePostOrders;
exports.handlePutOrders = handlePutOrders;
exports.handleDeleteOrders = handleDeleteOrders;

exports.handleGetOrderItem = handleGetOrderItem;
exports.handlePostOrderItem = handlePostOrderItem;
exports.handlePutOrderItem = handlePutOrderItem;
exports.handleDeleteOrderItem = handleDeleteOrderItem;

/*exports.createOrder = createOrder;
exports.getAllUserOrders = getAllUserOrders;
exports.getOrdersByUserID = getOrdersByUserID;
exports.getSpecificOrder = getSpecificOrder;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;*/