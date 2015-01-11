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
var processOrderHandler = require('./processOrder-handler');
var geohandler = require('./geolocation-handler');
var util = require('./util/util');

/***************************************************************/
/*  Database                                                   */
/***************************************************************/

var file = "./database/myphotoalbum.db";

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function createProcessOrder(orderID, processID, carrierHost, carrierPort, carrierEndPoint, result){

	//query para criar uma order.	
	var query = "INSERT INTO PROCESSED_ORDERS (orderID, processID, carrierHost, carrierPort, carrierEndPoint) VALUES (?, ?, ?, ?, ?)";
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);

	var processOrderID = "";
	
	//criar novo álbum
	db.serialize(function(){
		console.log("INFO: Creating process with the following information:");
		console.log("-> orderID: " + orderID);
		console.log("-> processID: " + processID);
		
		db.run(query, orderID, processID, carrierHost, carrierPort, carrierEndPoint, function(err){
			//assumindo que isto contem o ID;
			processOrderID = "{\"processOrderID\":" + this.lastID + "}";
			result(JSON.parse(processOrderID));
		});
		
		console.log("Info: Process created");		
		
		db.close();
	});

}

function getSpecificProcessOrder(orderID, result){
	//query para obter uma encomenda especifica
	var query = "SELECT * FROM PROCESSED_ORDERS WHERE orderID=" + orderID;

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	var process_json = "";

	//obter encomenda
	db.get(query, 
		function(err, row){
			if(err) return callback(err);
		},
		function(err, row){			
			if(err) return callback(err);			
			if(row !== undefined){

				var process = {
					'orderID': row.orderID,
					'processID': row.processID,
					'carrierHost': row.carrierHost,
					'carrierPort': row.carrierPort,
					'carrierEndPoint': row.carrierEndPoint
				};

				//makeProcess(JSON.parse(process_json));
				makeProcess(process);	

			} else {
				makeProcess('undefined');
			}
		}
	);

	var makeProcess = function(json){
		console.log(json);
		result(json);
	};

	//fechar instância da db.
	db.close();
}


function createOrder(userID, dealedPrinterShopID, printAlbumID, distance, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, confirmed, state, expirationDate, result){
	//query para criar uma order.	
	var query = "INSERT INTO ORDERS (userID, dealedPrinterShopID, printAlbumID, distance, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, confirmed, state, expirationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);

	var orderID = "";
	
	//criar novo álbum
	db.serialize(function(){
		console.log("INFO: Creating order with the following information:");
		console.log("-> userID: " + userID);
		console.log("-> dealedPrinterShopID: " + dealedPrinterShopID);
		console.log("-> printAlbumID: " + printAlbumID);
		console.log("-> distance: " + distance);
		console.log("-> realPrintPrice: " + realPrintPrice);
		console.log("-> realTransportPrice: " + realTransportPrice);
		console.log("-> dealedPrintPrice: " + dealedPrintPrice);
		console.log("-> dealedTransportPrice: " + dealedTransportPrice);
		console.log("-> address: " + address);
		console.log("-> confirmed: " + confirmed);
		console.log("-> state: " + state);
		console.log("-> expirationDate: " + expirationDate);
		
		db.run(query, userID, dealedPrinterShopID, printAlbumID, distance, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, confirmed, state, expirationDate, function(err){
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
					 + ",\"printAlbumID\":" + row.printAlbumID
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

function getSpecificOrder(orderID, callback){
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
					 + ",\"printAlbumID\":" + row.printAlbumID
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

				var orderByID = JSON.parse(order_json);
				returnOrder(orderByID);	

			} else {
				returnOrder('undefined');
			}
		}
	);

	var returnOrder = function(order){
		callback(order);
	};

	//fechar instância da db.
	db.close();
}


function updateOrderStatus(orderID, state){
	//query para criar uma order.	
	var query = "UPDATE ORDERS SET state = '" + state + "' WHERE orderID = " + orderID;

	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	//atualizar album
	db.serialize(function(){
		console.log("INFO: Updating orderID = " + orderID);
		
		db.run(query);
		
		console.log("Info: Order updated");		
		
		db.close();
	});

}
 
function updateOrder(orderID, printerShopID, realPrintPrice, realTransportPrice){
	//query para criar uma order.	
	var query = "UPDATE ORDERS SET dealedPrinterShopID = " + printerShopID + ", realPrintPrice = " + realPrintPrice + ", realTransportPrice = " + realTransportPrice + " WHERE orderID = " + orderID;
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	//atualizar album
	db.serialize(function(){
		console.log("INFO: Updating orderID = " + orderID);
		
		db.run(query);
		
		console.log("Info: Order updated");		
		
		db.close();
	});

}

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

	var confirmed = req.body.confirmed;

	if(confirmed == 'false'){                          // Store order only and calculate best prices

        // Input params
        var address = req.body.address;
        var printAlbumID = req.body.printAlbum;
        var printAlbumCache;
        var newOrderCache;

        // Verificar se o printAlbumID existe
		printAlbumsHandler.getSpecificPrintAlbum(printAlbumID, function(printAlbum){

			var n_photos = printAlbum.photos.length;
			printAlbumCache = printAlbum;

	        /*
	        Calculate distance
	        */
	        geohandler.calcEstimatedDistance(address, '38.7436266','-9.1602037',function(distance){
	            console.log("Distance is " + distance);


		        /*
		        Calculate dealed prices
		        */
		     	var userID = req.userID;
		        var dealedPrinterShopID = 0;
		        //var distance = 123;
		        var realPrintPrice = 0;
		        var realTransportPrice = 0;
		        var dealedPrintPrice = util.calculateAlbumPrice(n_photos);
		        var dealedTransportPrice = util.calculatePriceByDistance(distance);
		        var expirationDate = new Date().getTime();      // Adicionar timeout de 5min para a order


		        /*
		        Generate new order
		        */
		        createOrder(userID, dealedPrinterShopID, printAlbumID, distance, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, 'false', 'Em processamento', expirationDate, function(newOrder){
		            console.log(newOrder);

		            newOrderCache = newOrder;

		            // Respond to App
		            res.status(201).send(newOrder);
		            
		            // Calculate real prices and Pick best price
					printershophandler.calculateBestPrice(address, n_photos, function(bestPrice){

						console.log(bestPrice);

	                    var printerShopID = bestPrice.printerShopID;
	                    var realPrintPrice = bestPrice.realPrintPrice;
	                    var realTransportPrice = bestPrice.realTransportPrice;

	                    // Update order status
	                    updateOrder(newOrderCache.orderID, printerShopID, realPrintPrice, realTransportPrice);


					});

		        });

	        });

		});

    }

	/*
	var userID = req.userID;
	var printAlbumID = req.body.printAlbumID || 0;
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
	createOrder(userID, printAlbumID, distance, dealedPrinterShopID, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, state, expirationDate, function(result){
		res.status(201).send(result);
	});
	*/

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

	var orderID = req.orderID

	/*
	// Get updated order
	*/
	getSpecificProcessOrder(req.orderID, function(processOrder){
		console.log(processOrder);

		if(processOrder != 'undefined'){

			// Hit update link
			processOrderHandler.checkProcessOrderStatus(processOrder, function(status){

				var orderStatus = status.order_status;

				// Update order status
				updateOrderStatus(req.orderID, orderStatus);

				// Retrieve updated order
				getSpecificOrder(orderID, function(order){
					res.status(200).send(order);
				});

			});

		}else{
			res.status(404).send("Order was not processed.");
		}


	});
};

//atualizar encomenda
function handlePostOrderItem(req, res){

        // Do not forget to check fields null undefined

        var confirmed = req.body.confirmed;
        var orderID = req.orderID;
        var userID = req.userID;

        console.log(confirmed);
        console.log(orderID);
        console.log(userID);

        if(confirmed == 'true'){        // Process order

            //verificar se existe order
            getSpecificOrder(orderID, function(order){
                console.log(order);

                if(order != 'undefined'){

		        	// Cant process an order already processed
					getSpecificProcessOrder(req.orderID, function(processOrder){
						console.log(processOrder);

						if(processOrder == 'undefined'){

		                    // Get order's printer album (order.printAlbumID)
		                    printAlbumsHandler.getSpecificPrintAlbum(order.printAlbumID, function(printAlbum){

		                        // Request printershop for order
		                        printershophandler.processOrder(printAlbum, order, function(processedOrder){
		                            console.log("ID# " + processedOrder.order_id);

		                            var processID = processedOrder.order_id;
		                            var carrierHost = processedOrder.carrierHost;
		                            var carrierPort = processedOrder.carrierPort;
		                            var carrierEndPoint = processedOrder.carrierEndPoint;

		                            // Respond to App
		                            res.status(200).send(order);

		                            // Create process order
		                            createProcessOrder(order.orderID, processID, carrierHost, carrierPort, carrierEndPoint, function(out){});

		                        });

		                    });

						}else{
							res.status(409).send(order);
						}

					});

                }else{
                	res.status(404).send("Order was not found.");
                }

            });
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