
var http = require('http');


function checkProcessOrderStatus(processOrder, callback){

	var server = processOrder.carrierHost;
	var port = processOrder.carrierPort;
    var endpoint = processOrder.carrierEndPoint;

    // Set request options
    var options = {
        host: server,
        port: port,
        path: endpoint,
        method: 'GET',
    };

    console.log("Connecting " + server + ':' + port + endpoint);

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

    req.end();
}

exports.checkProcessOrderStatus = checkProcessOrderStatus;