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

function createOrder(){}

function getAllOrders(){}

function getOrdersByUserID(){}

function getSpecificOrder(){}
 
function updateOrder(){}

function deleteOrder(){}

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.createOrder = createOrder;
exports.getAllOrders = getAllOrders;
exports.getOrdersByUserID = getOrdersByUserID
exports.getSpecificOrder = getSpecificOrder;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;