/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Node module to handle print albums resource                */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

/***************************************************************/
/*  Necessary Modules                                          */
/***************************************************************/

var sqlite3 = require('sqlite3').verbose();
var photosHandler = require('./photos-handler');
var http = require('http');

/***************************************************************/
/*  Database                                                   */
/***************************************************************/

var file = "./database/myphotoalbum.db";

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function createPrintAlbum(userID, theme, title, photos, result){
	//query para inserção de um novo PrintAlbum.
	var query = "INSERT INTO PRINTALBUMS (userID, theme, title, message) VALUES (?,?,?,?)";

	//adquirir citação.
	var citation = "";
	
	getCitation(function(res){
		citation = res;
	});	

	//abrir instância da db.
	var db = new sqlite3.Database(file);	

	//criar novo PrintAlbum.
	setTimeout(function(){
		db.serialize(function(){
			console.log("INFO: Creating new PrintAlbum.");
			db.run(query, userID, theme, title, citation);
			console.log("INFO: PrintAlbum created.");
			result("true");
			//fechar instância da db.
			db.close();
		}); 
	}, 3000);

	setTimeout(function(){
		getCreatedPrintAlbumID(userID, function(printAlbumID){
			addPhotostoPrintAlbum(photos, printAlbumID);
		});
	}, 4000);
}

function getCitation(result){
	//obter uma citação
 	var options = { 
 		host: 'iheartquotes.com',
 		path: '/api/v1/random?format=json&max_lines=2&max_characters=320', 
 		method: 'GET'
 	};

 	callback = function(response){
 		var str = '';

 		response.on('data', function(chunk){
 			str += chunk;
 		});

		response.on('end', function(){			
			var res = JSON.parse(str);
			var quote = res.quote;
			var quote_clean = quote.replace(/"/g, ""); 
			var quote_clean1 = quote_clean.replace(/\r?\n|\r/g, " ");
			var quote_clean2 = quote_clean1.replace(/\t/g, " ");
			result(quote_clean2);
		});
	};

	http.request(options, callback).end();
}

function getCreatedPrintAlbumID(userID, result){
	//query para obter o printalbum criado.
	var query = "SELECT * FROM PRINTALBUMS WHERE userID=" + userID + " ORDER BY printAlbumID DESC";

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	var printAlbumID = 0;

	//obter o ID do printAlbum.
	db.get(query,
		function(err, row){
			if(err) return callback(err);
		},
		function(err, row){
			if(err) return callback(err);
			if(row !== undefined){
				printAlbumID = row.printAlbumID;
				completed(printAlbumID);
			} else {
				completed(printAlbumID);
			}
		}
	);

	var completed = function(id){
		result(id);
		//fechar instância da db.
		db.close();
	};
}

function addPhotostoPrintAlbum(photosID, printAlbumID){
	//abrir instância da db.
	var db = new sqlite3.Database(file);

	//executar as inserções num ciclo
	for(var i=0; i < photosID.length; i++){
		db.serialize(function(){
			var query_insert = "INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (?,?)";
			console.log("INFO: Associating photos with a printAlbum");
			//executar query.
			db.run(query_insert, photosID[i], printAlbumID);
			console.log("-> Photo " + (i+1) + " of " + photosID.length + " associated.");			
		});
	}

	//fechar instância da db.
	db.close();
}

function getPhotosPrintAlbum(printAlbumID, result){
	//query para obter o id das fotos associadas ao printalbum
	var query_photosID = "SELECT * FROM PRINTPHOTOS WHERE printAlbumID=" + printAlbumID;

	//variavel para armazenar a string json
	var photos_json = "[";

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	//obter as fotos
	db.each(query_photosID,
		function(err, row){
			if(err) return callback(err);
		},
		function(err, row){
			if(err) return callback(err);
			if(row !== undefined && row !== ""){
				photosHandler.getPhoto(row.photoID, function(photo){
					handler(photo);
				});				
			} else {
				completed();
			}
		},
		function(err, row){
			setTimeout(function(){
				completed();
			},1000);
		}
	);

	var first = true;

	var handler = function(json){		
		if(!first){
			photos_json += ",";
		} else {
			first = false;
		}
		photos_json += json;
	}

	var completed = function(){
		photos_json += "]";
		result(photos_json);
	}

	//fechar instância da db.
	db.close();
}

function getPrintAlbumsByUserID(userID, result){
	//query para obter as informações de todos os PrintAlbums de um utilizador.
	var query = "SELECT * FROM PRINTALBUMS WHERE userID=" + userID;

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	//variáveis para armazenar as strings json.
	var albums_json = "[";

	//para cada album que encontrar.
	db.each(query, 
		function(err, row){
			if(err) return callback(err);
		}
		,function(err, row){
			if(err) return callback(err);
			//criar string json para cada printalbum.
			if(row !== undefined){
				var album_json = "{\"printAlbumID\":" + row.printAlbumID 
						+ ",\"userID\":" + row.userID
						+ ",\"theme\":\"" + row.theme
						+ "\",\"title\":\"" + row.title
						+ "\",\"message\":\"" + row.message
						+ "\",\"photos\":"; 

				getPhotosPrintAlbum(row.printAlbumID, function(photos){
					album_json += photos + "}";					
					handler(album_json);
				});		
			}
		}
		,function(err,row){
			setTimeout(function(){
				completed();
			},3000);
		}
	);

	var first = true;
	
	var handler = function(json){
		if(!first){
			albums_json += ",";
		} else {
			first = false;
		}
		albums_json += json;
	};

	var completed = function(){
		albums_json += "]";
		result(albums_json);
		//fechar instância da db.
		db.close();
	};	
}

function getSpecificPrintAlbum(printAlbumID, result){
	//query para obter PrintAlbum especifico
	var query = "SELECT * FROM PRINTALBUMS WHERE printAlbumID=" + printAlbumID;

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	//variáveis para armazenar as strings json.
	var album_json = "";

	//obter o printalbum.
	db.get(query, 
		function(err, row){
			if(err) return callback(err);
		},
		function(err, row){
			if(err) return callback(err);
			//criar string json para o printalbum.
			if(row !== undefined){
				var album_json = "{\"printAlbumID\":" + row.printAlbumID 
						+ ",\"userID\":" + row.userID
						+ ",\"theme\":\"" + row.theme
						+ "\",\"title\":\"" + row.title
						+ "\",\"message\":\"" + row.message
						+ "\",\"photos\":"; 

				getPhotosPrintAlbum(row.printAlbumID, function(photos){
					album_json += photos + "}";
					var result_json = JSON.parse(album_json);
					completed(result_json);
				});				
			} else {
				completed(album_json);
			}
		}
	);

	var completed = function(json){
		result(json);
		//fechar instância da db.
		db.close();
	};
}
 
function updatePrintAlbum(printAlbumID, theme, title, message, photos, result){
	//queries para atualizar um álbum
	var query_select = "SELECT * FROM PRINTALBUMS WHERE printAlbumID=" + printAlbumID;
    var query_update_theme = "UPDATE PRINTALBUMS SET theme=\"" + theme + "\" where printAlbumID=" + printAlbumID;
    var query_update_title = "UPDATE PRINTALBUMS SET title=\"" + title + "\" where printAlbumID=" + printAlbumID;
    var query_update_message = "UPDATE PRINTALBUMS SET message=\"" + message + "\" where printAlbumID=" + printAlbumID;
    
    //abrir instância da db
	var db = new sqlite3.Database(file);

	db.get(query_select, 
		function(err,row){ 
			if(err) return callback(err);
		},
		function(err,row){
			if(err) return callback(err);
			if(row !== undefined){
				setTimeout(function(){
					db.serialize(function(){
				    	if(theme !== undefined){
					    	console.log("INFO: Updating printalbum's theme.");
					    	db.run(query_update_theme);
						}
						if(title !== undefined){
					    	console.log("INFO: Updating printalbum's title.");
					    	db.run(query_update_title);
						}
						if(message !== undefined){
					    	console.log("INFO: Updating printalbum's message.");
					    	db.run(query_update_message);
						}
					});
					completed("true");
				}, 4000);
			} else {
				completed("false");
			}
		}
	);		

	if(photos.length > 0){
    	setTimeout(function(){
			addPhotostoPrintAlbum(photos, printAlbumID);
		}, 5000);
    }

    var completed = function(status){
    	result(status);
    	//fechar instância da db.
		db.close();
    }
}

function deletePrintAlbum(printAlbumID, result){
	//queries para eliminar um printalbum
	var query_select = "SELECT * FROM PRINTALBUMS WHERE printAlbumID=" + printAlbumID;
    var query_delete_printalbum = "DELETE FROM PRINTALBUMS WHERE printAlbumID=" + printAlbumID;
    var query_delete_printphotos = "DELETE FROM PRINTPHOTOS WHERE printAlbumID=" + printAlbumID;

    //abrir instância da db
	var db = new sqlite3.Database(file);

	//verificar se printalbum existe
    db.get(query_select, 
    	function(err,row){ 
    		if(err) return callback(err);    		
		},
		function(err,row){
			if(err) return callback(err);
			if(row !== undefined){
				setTimeout(function(){
					db.serialize(function(){
						console.log("INFO: Deleting printalbum with id: " + printAlbumID);
						db.run(query_delete_printalbum);
						console.log("INFO: Deleting photos associations with the deleted printAlbum.");
						db.run(query_delete_printphotos);
					});
					completed("true");
				}, 2000);
			} else {
				completed("false");
			}
		}
	);
	
	var completed = function(status){
		result(status);
		//fechar instância da db.
		db.close();
	};	
}

function exportToPDF(){
	//Ainda não implementado
}

/***************************************************************/
/*  Handler Functions                                          */
/***************************************************************/

function handleGetPrintAlbums(req, res){
	getPrintAlbumsByUserID(req.userID, function(result){
		var result_json = JSON.parse(result);
    	res.status(200).send(result_json);
    });
};

function handlePostPrintAlbums(req, res){
	createPrintAlbum(req.userID, req.body.theme, req.body.title, req.body.photos, function(result){
        if(result === "true"){      
        	setTimeout(function(){
        		getCreatedPrintAlbumID(req.userID, function(id){
        		 	console.log("INFO: Done creating printAlbum");
        		 	var result = "{\"printAlbumID\":" + id + "}";
        		 	var result_json = JSON.parse(result);
        			res.status(201).send(result_json);        		
        		});
        	}, 6000);               
        }
    });
};

function handlePutPrintAlbums(req, res){
	res.status(405).send("Cannot overwrite the entire collection.");
};

function handleDeletePrintAlbums(req, res){
	res.status(405).send("Cannot delete the entire collection.");
};

function handleGetPrintAlbumItem(req, res){
	getSpecificPrintAlbum(req.printAlbumID, function(result){
            res.status(200).send(result);
    }); 
};

function handlePostPrintAlbumItem(req, res){
	res.status(405).send("Not allowed.");
};

function handlePutPrintAlbumItem(req, res){
	res.status(405).send("Not allowed.");
};

function handleDeletePrintAlbumItem(req, res){
	deletePrintAlbum(req.printAlbumID, function(result){
		if(result === "true"){
			res.status(200).send('PrintAlbum with ID ' + req.printAlbumID + ' was deleted.');
		} else {
			res.status(204).send('PrintAlbum with ID ' + req.printAlbumID + ' was not found');
		}
	});
};

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.createPrintAlbum = createPrintAlbum;
exports.getPrintAlbumsByUserID = getPrintAlbumsByUserID
exports.getSpecificPrintAlbum = getSpecificPrintAlbum;
exports.updatePrintAlbum = updatePrintAlbum;
exports.deletePrintAlbum = deletePrintAlbum;

exports.handleGetPrintAlbums = handleGetPrintAlbums;
exports.handlePostPrintAlbums = handlePostPrintAlbums;
exports.handlePutPrintAlbums = handlePutPrintAlbums;
exports.handleDeletePrintAlbums = handleDeletePrintAlbums;

exports.handleGetPrintAlbumItem = handleGetPrintAlbumItem;
exports.handlePostPrintAlbumItem = handlePostPrintAlbumItem;
exports.handlePutPrintAlbumItem = handlePutPrintAlbumItem;
exports.handleDeletePrintAlbumItem = handleDeletePrintAlbumItem;