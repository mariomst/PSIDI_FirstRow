/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Geolocation-handler                                        */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/



/***************************************************************/
/* Global variables                                            */
/***************************************************************/


const geo_server = "maps.googleapis.com";
var uri_template = "/maps/api/geocode/json?address=ADDR&sensor=true_or_false";
var http = require('http');



/***************************************************************/
/* Functions                                                   */
/***************************************************************/
function newPoint(latitude, longitude){

    var point = {
        'lat': latitude,
        'lng': longitude
    };

    return point;
}

function getCoordinates(address, result){
   
   var path_str = uri_template.replace("ADDR", address);

    // Set request options
    var options = {
        host: geo_server,
        path: path_str,
        method: 'GET'
    };

    var req = http.request(options, function(response){
        
        var str = '';

        response.on('error', function(err){
            console.log(err);
        });

        response.on('data', function(chunk){
            str += chunk;
        });

        response.on('end', function(){
            var res = JSON.parse(str);
            
            var lat = res.results[0].geometry.location.lat;
            var lng = res.results[0].geometry.location.lng;
            
            var point = newPoint(lat, lng);

            completed(point);

        });

    });

    completed = function(point){
        result(point);
    }

    req.end();
}


function distance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return Math.round(d);
}
function deg2rad(deg) {
  return deg * (Math.PI/180)
}  


function calcEstimatedDistance(address, lat2, lng2, callback){

    console.log("geolocation: trying to retrieve address="+ address);

    getCoordinates(address, function(point){

        var lat1 = point.lat;
        var lng1 = point.lng;

        var dist = distance(lat1, lng1, lat2, lng2);
        completo(dist);
    });

    completo = function(dist){
        callback(dist);
    };

}


/*
getCoordinates("Porto", function(point){

    console.log("New lat: " + point.lat);
    console.log("New lng: " + point.lng);

});
*/                                                                    


exports.calcEstimatedDistance = calcEstimatedDistance
exports.getCoordinates = getCoordinates;
exports.distance = distance;