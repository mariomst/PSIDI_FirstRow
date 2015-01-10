
const server_port = 5000;
const server_root = "localhost";

const lat = 38.7436266;
const lng = -9.1602037;

var http = require('http');
var querystring = require('querystring');


function processOrder(processOrder, callback){

    var endpoint = '/printershop1';

    var data = querystring.stringify(processOrder);
    console.log("Sending " + data + " ...");

    // Set request options
    var options = {
        host: server_root,
        port: server_port,
        path: endpoint,
        method: 'POST',
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': Buffer.byteLength(data)
        }
    };

    console.log("Connecting " + server_root + endpoint);

    var req = http.request(options, function(response){
        
        var str = '';

        response.on('data', function(chunk){
            str += chunk;
        });

        response.on('end', function(){
            var resposta = JSON.parse(str);
            complete(resposta);

        });

    });

    complete = function(res){
        callback(res);
    }

    req.write(data);
    req.end();
}

function getPrices(result){

    var endpoint = '/printershop1';

    // Set request options
    var options = {
        host: server_root,
        port: server_port,
        path: endpoint,
        method: 'GET'
    };

    console.log("Connecting " + server_root + endpoint);

    var req = http.request(options, function(response){
        
        var str = '';

        response.on('data', function(chunk){
            str += chunk;
        });

        response.on('end', function(){
            var res = JSON.parse(str);

            completed(res);

        });

    });

    completed = function(point){
        result(point);
    }

    req.end();
}

exports.getPrices = getPrices;
exports.processOrder = processOrder;