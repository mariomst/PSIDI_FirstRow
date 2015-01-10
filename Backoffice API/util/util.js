
//var usersHandler = require('sha1');

function newPublicKey(key){
	//return Sha1.hash(key);
}

function calculatePriceByDistance(km){
    return ( (km * 0.26) / 1000.0);
}

exports.newPublicKey = newPublicKey;
exports.calculatePriceByDistance = calculatePriceByDistance;