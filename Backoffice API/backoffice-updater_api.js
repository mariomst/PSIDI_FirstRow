
var http = require('http');
var ordershandler = require('./handlers/orders-handler');
var processOrderHandler = require('./handlers/processOrder-handler');

const timeout = 5000;

function init(){
    console.log("UPDATER service started...");
    setTimeout(checkAllOrders, timeout);
}


function checkAllOrders(){
	console.log("\n\n* * * * * * * * * *\n\n");

	var today = new Date();

    ordershandler.getAllOrders(function(result){

        var order;

        for( i=0; i<result.length; i++){
            order = result[i];

            var orderExpirationDate = new Date(parseInt(order.expirationDate));
            console.log(orderExpirationDate.toString());

            if(orderExpirationDate >= today){
	            console.log("UPDATER -> Processing order " + order.orderID);

				ordershandler.getSpecificProcessOrder(order.orderID, function(processOrder){

					if(processOrder != 'undefined'){

						// Hit update link
						processOrderHandler.checkProcessOrderStatus(processOrder, function(state){

							var orderState = state.order_status;

							if(orderState != order.state){

								// Update order status
								ordershandler.updateOrderStatus(order.orderID, orderState);
								console.log("UPDATER -> Updated order " + order.orderID + " state -> " + orderState);

							}

						});

					}

				});

            }

        }

    });

    init();
}


// START
init();
