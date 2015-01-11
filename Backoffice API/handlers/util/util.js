
const PHOTO_PRICE = 1;
const KM_PRICE = 0.26;

//var usersHandler = require('sha1');

function newPublicKey(key){
	//return Sha1.hash(key);
}

function calculateAlbumPrice(n_photos){
	return n_photos * PHOTO_PRICE;
}

function calculatePriceByDistance(km){
    return ( (km * KM_PRICE) / 1000.0);
}



exports.newPublicKey = newPublicKey;
exports.calculatePriceByDistance = calculatePriceByDistance;
exports.calculateAlbumPrice = calculateAlbumPrice;