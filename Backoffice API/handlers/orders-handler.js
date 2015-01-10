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

/***************************************************************/
/*  Database                                                   */
/***************************************************************/

var file = "./database/myphotoalbum.db";

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function newOrder(orderID, userID, distance, dealedPrinterShopID, realPrintPrice, realTransportPrice, dealedPrintPrice, dealedTransportPrice, address, confirmed, state, expirationDate){
	var order = {
		'orderID': orderID,
		'userID': userID,
		'distance': distance,
		'dealedPrinterShopID': dealedPrinterShopID,
		'realPrintPrice': realPrintPrice,
		'realTransportPrice': realTransportPrice,
		'dealedPrintPrice': dealedPrintPrice,
		'dealedTransportPrice': dealedTransportPrice,
		'address': address,
		'confirmed': confirmed,
		'state': state,
		'expirationDate': expirationDate
	};
	return order;
}

function createOrder(){}

function getAllOrders(){}

function getOrdersByUserID(){}

function getSpecificOrder(orderID, userID, result){

	//query para obter PrintAlbum especifico
	var query = "SELECT * FROM ORDERS WHERE orderID=" + orderID + " AND userID=" + userID;

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	db.get(query, 
		function(err, row){
			if(err) return callback(err);
		}
		,function(err, row){
			
			if(err) return callback(err);
			
			if(row !== undefined){

				console.log("encontrou");
				var order = newOrder(row.orderID, row.userID, row.distance, row.dealedPrinterShopID, row.realPrintPrice, row.realTransportPrice, row.dealedPrintPrice, row.dealedTransportPrice, row.address, row.confirmed, row.state, row.expirationDate);
				completed(order);
			
			} else {
				completed('undefined');
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
/*  Module Exports		                                       */
/***************************************************************/

exports.newOrder = newOrder;
exports.createOrder = createOrder;
exports.getAllOrders = getAllOrders;
exports.getOrdersByUserID = getOrdersByUserID
exports.getSpecificOrder = getSpecificOrder;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;