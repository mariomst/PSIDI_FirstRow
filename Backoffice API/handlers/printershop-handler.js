
const PRINTERHOP_1 = 100;
const PRINTERHOP_2 = 200;
const PRINTERHOP_3 = 300;

var ps1_interface = require('./interfaces/ps1interface');
//var ps2_interface = require('./interfaces/ps2interface');
//var ps3_interface = require('./interfaces/ps3interface');

function calculateBestPrice(order, printAlbum, callback){

	var bestPrice = {
		'printerShopID': 0,
		'realPrintPrice': 0,
		'realTransportPrice': 0
	};


	// Verificar este algoritmo, ha melhor maneira?
	

	// Calculate price for printershop 1
	ps1_interface.getPrices(function(res){
	    console.log("Preço: " + res.individualPrice);
	    console.log("Km: " + res.kmPrice);

	    var price_per_photo = res.individualPrice;
	    var price_per_km = res.kmPrice;

		// Calculate price for printershop 2
		ps2_interface.getPrices(function(res){
		    console.log("Preço: " + res.individualPrice);
		    console.log("Km: " + res.kmPrice);

		    var price_per_photo = res.individualPrice;
		    var price_per_km = res.kmPrice;

			// Calculate price for printershop 3
			ps3_interface.getPrices(function(res){
			    console.log("Preço: " + res.individualPrice);
			    console.log("Km: " + res.kmPrice);

			    var price_per_photo = res.individualPrice;
			    var price_per_km = res.kmPrice;

			    
			});
		    
		});

	});

}

function processOrder(printAlbum, order, response){

	var printerShopID = order.dealedPrinterShopID;
	var ps_interface = null;
	

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
		error("undefined");
	}


	// Handlers
	error = function(err){
		response(err);
	};

	completed = function(res){
		response(res);
	};

}

exports.calculateBestPrice = calculateBestPrice;
exports.processOrder = processOrder;