
const PRINTERHOP_1 = 100;
const PRINTERHOP_2 = 200;
const PRINTERHOP_3 = 300;

var geohandler = require('./geolocation-handler');

var ps1_interface = require('./interfaces/ps1interface');
var ps2_interface = require('./interfaces/ps2interface');
//var ps3_interface = require('./interfaces/ps3interface');


function calculateBestPrice(point, n_photos, callback){

	var bestPrice = {
		'printerShopID': 0,
		'realPrintPrice': 0,
		'realTransportPrice': 0
	};

    respond = function(res){
    	callback(res);
    };


	// Calculate price for printershop 1
	ps1_interface.getPrices(function(res){
	    console.log("Preço: " + res.individualPrice);
	    console.log("Km: " + res.kmPrice);

	    var price_per_photo = res.individualPrice;
	    var price_per_km = res.kmPrice;

	    bestPrice.printerShopID = PRINTERHOP_1;
	    bestPrice.realPrintPrice = price_per_photo * n_photos;
	    bestPrice.realTransportPrice = geohandler.distance(point.lat, point.lng, ps1_interface.lat, ps1_interface.lng) * price_per_km;

	    respond(bestPrice);

		// Calculate price for printershop 2
		ps2_interface.getPrices(n_photos, n_kms, function(res){
		    console.log("Custo: " + res.cost);

		    var cost = res.cost;

		    // TESTAR SE O CUSTO É INFERIOR AO QUE JÁ EXISTE
		    //if()

	    /*
			// Calculate price for printershop 3
			ps3_interface.getPrices(function(res){
			    console.log("Preço: " + res.individualPrice);
			    console.log("Km: " + res.kmPrice);

			    var price_per_photo = res.individualPrice;
			    var price_per_km = res.kmPrice;

			    
			});
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