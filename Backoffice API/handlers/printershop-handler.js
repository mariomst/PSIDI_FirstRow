
const PRINTERHOP_1 = 100;
const PRINTERHOP_2 = 200;
const PRINTERHOP_3 = 300;

var geohandler = require('./geolocation-handler');

var ps1_interface = require('./interfaces/ps1interface');
var ps2_interface = require('./interfaces/ps2interface');
var ps3_interface = require('./interfaces/ps3interface');


function calculateBestPrice(point, n_photos, callback){

	var bestPrice = {
		'printerShopID': 0,
		'realPrintPrice': 0,
		'realTransportPrice': 0
	};

    respond = function(res){
    	callback(res);
    };


    // Distances
    var ps1_dist = geohandler.distance(point.lat, point.lng, ps1_interface.lat, ps1_interface.lng);
    var ps2_dist = geohandler.distance(point.lat, point.lng, ps2_interface.lat, ps2_interface.lng);
    var ps3_dist = geohandler.distance(point.lat, point.lng, ps3_interface.lat, ps3_interface.lng);


	// Calculate price for printershop 1
	ps1_interface.getPrices(function(res){
	    console.log("Preço: " + res.individualPrice);
	    console.log("Km: " + res.kmPrice);

	    var price_per_photo = res.individualPrice;
	    var price_per_km = res.kmPrice;

	    bestPrice.printerShopID = PRINTERHOP_1;
	    bestPrice.realPrintPrice = price_per_photo * n_photos;
	    bestPrice.realTransportPrice = ps1_dist * price_per_km;


		// Calculate price for printershop 2
		ps2_interface.getPrices(n_photos, ps2_dist, function(res2){
		    console.log("Custo: " + res2.cost);

		    var cost2 = res2.cost;
		    var photosCost2 = res2.photosCost;
		    var transportCost2 = res2.transportCost;

		    if(cost2 < (bestPrice.realPrintPrice + bestPrice.realTransportPrice)){
		    	console.log("Best price: PS2");

		    	bestPrice.printerShopID = PRINTERHOP_2;
		    	bestPrice.realPrintPrice = photosCost2;
		    	bestPrice.realTransportPrice = transportCost2;

		    }
		    

			// Calculate price for printershop 3
			ps3_interface.getPrices(n_photos, ps3_dist, function(res3){
			    console.log("Custo: " + res3.cost);

			    var cost3 = res3.cost;
			    var photosCost3 = res3.photosCost;
			    var transportCost3 = res3.transportCost;

			    if(cost3 < (bestPrice.realPrintPrice + bestPrice.realTransportPrice)){
			    	console.log("Best price: PS3");

			    	bestPrice.printerShopID = PRINTERHOP_3;
			    	bestPrice.realPrintPrice = photosCost3;
			    	bestPrice.realTransportPrice = transportCost3;

			    }

			    // Callback bestPrice
				respond(bestPrice);
			    
			});
	    /*
	    */
		    
		});

	});

}

function processOrder(printAlbum, order, response){

	var printerShopID = order.dealedPrinterShopID;
	var ps_interface = null;
	
	console.log(printAlbum);

	// Create a process order
	var processOrder = {
		'address': order.address,
		'theme': printAlbum.theme,
		'title': printAlbum.title,
		'message': printAlbum.message,
		'n_photos': printAlbum.photos.length
	};


	// Choose dealed printershop
	if(printerShopID == PRINTERHOP_1){
		ps_interface = ps1_interface;
	}
	else if(printerShopID == PRINTERHOP_2){
		ps_interface = ps2_interface;
	}
	else if(printerShopID == PRINTERHOP_3){
		ps_interface = ps3_interface;
	}


	// Make request
	if(ps_interface != null){
		ps_interface.processOrder(processOrder, function(res){

			console.log("PS: Recebido!");
			console.log(JSON.stringify(res));

			completed(res);

		});
	}else{
		//erro("undefined");
	}


	// Handlers
	erro = function(err){
		response(err);
	};

	completed = function(res){
		response(res);
	};

}

exports.calculateBestPrice = calculateBestPrice;
exports.processOrder = processOrder;