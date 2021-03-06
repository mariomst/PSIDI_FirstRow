/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Node module to handle albums resource                      */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

/***************************************************************/
/*  Necessary Modules                                          */
/***************************************************************/

var sqlite3 = require('sqlite3').verbose();
var photosHandler = require('./photos-handler');

/***************************************************************/
/*  Database                                                   */
/***************************************************************/

var file = "./database/myphotoalbum.db";

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function createAlbum(title, userID, description, start_date, end_date, result){
	//query para criar um novo album.	
	var query = "INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES (?,?,?,?,?)";
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	//criar novo álbum
	db.serialize(function(){
		console.log("INFO: Creating album with the following information:");
		console.log("-> title: " + title);
		console.log("-> userID: " + userID);
		console.log("-> description: " + description);
		console.log("-> start_date: " + start_date);
		console.log("-> end_date: " + end_date);
		
		db.run(query, title, userID, description, start_date, end_date);
		
		console.log("Info: Album created");
		
		result("true");
		
		db.close();
	});
}

function getUserAlbums(userID, result){
	//query para obter todos os álbuns de um utilizador
	var query = "SELECT * FROM ALBUMS WHERE userID=" + userID;
	
	//variavéis para armazenar a string json
    var albums_json = "[";  
    var photos_json = "";
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	console.log("\nINFO: Getting all albums of the user with id " + userID + ".");  
	
	//obter o álbum
	db.each(query, 
		function(err, row){
			if(err) return callback(err);
		},
		function(err, row){
			if(err) return callback(err);
			if(row !== undefined){
				//criar string json para cada album 
				var album_json = "{\"albumID\":" + row.albumID 
						+ ",\"title\":\"" + row.title 
						+ "\",\"userID\":" + row.userID 
						+ ",\"description\":\"" + row.description 
						+ "\",\"start_date\":\"" + row.start_date 
						+ "\",\"end_date\":\"" + row.end_date 
						+ "\",\"photos\":";

				photosHandler.getPhotos(row.albumID, function(photos){
					photos_json = photos;
					album_json += photos_json + "}";
					handler(album_json);
				});		
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
			albums_json += ",";
		} else {
			first = false;
		}
		albums_json += json;
	};

	var completed = function(){
		albums_json += "]";
		result(albums_json);
	};

	//fechar instância da db.
	db.close();
}

function getAlbum(albumID, result){
    //query para obter todos um álbum de um utilizador
    var query = "SELECT * FROM ALBUMS WHERE albumID=" + albumID;
    
    //variavéis para armazenar a string json
    var album_json = "";  
    var photos_json = "";
    
    //abrir instância da db.
	var db = new sqlite3.Database(file);
	
	console.log("\nINFO: Getting album of the user.");  
	
	//obter o álbum
	db.get(query, 
		function(err, row){
			if(err) return callback(err);
		},	
		function(err, row){
			if(err) return callback(err);
			if(row !== undefined){
            	//criar string json para o album 
            	album_json = "{\"albumID\":" + row.albumID 
            			+ ",\"title\":\"" + row.title 
            			+ "\",\"userID\":" + row.userID 
            			+ ",\"description\":\"" + row.description 
            			+ "\",\"start_date\":\"" + row.start_date 
            			+ "\",\"end_date\":\"" + row.end_date 
            			+ "\",\"photos\":";

            	photosHandler.getPhotos(row.albumID, function(photos){
					photos_json = photos;
					album_json += photos_json + "}";
					completed(album_json);					
				});	
			} else {
				completed(album_json);
			}			
		}	
	);
	
	var completed = function(json){
		result(json);
	};

	//fechar instância da db.
	db.close();
}

function getAlbumWithInfo(title, userID, description, start_date, end_date, result){
	//query para obter um album específico
	var query = "SELECT * FROM ALBUMS WHERE userID=" + userID + " AND title=\""+ title + "\"";

	//construção da query dinamicamente (caso sejam indicados mais campos)
	if(description !== undefined){
		query = query + " AND description=\"" + description + "\"";
	}
	if(start_date !== undefined){
		query = query + " AND start_date=" + start_date;
	}
	if(end_date !== undefined){
		query = query + " AND end_date=" + end_date;
	}

	//variavéis para armazenar as strings json
	var album_json = "";

	//abrir instância da db
	var db = new sqlite3.Database(file);

	console.log("\nINFO: Getting album of a user.");  

	//obter o álbum
	db.get(query, 
		function(err, row){
			if(err) return callback(err);
		},
		function(err, row){
			if(err) return callback(err);
			if(row !== undefined){
            	//criar string json para o album 
                album_json = "{\"albumID\":" + row.albumID 
                		+ ",\"title\":\"" + row.title 
                		+ "\",\"userID\":" + row.userID 
                		+ ",\"description\":\"" + row.description 
                		+ "\",\"start_date\":\"" + row.start_date 
                		+ "\",\"end_date\":\"" + row.end_date 
                		+ "\"}";
                completed(album_json);
			} else {
				completed(album_json);
			}
		}
	);

	var completed = function(json){
		result(json);
	};

	//fechar instância da db.
	db.close();
}

function updateAlbum(albumID, title, description, start_date, end_date, res){
    //função para atualizar um álbum
    var db = new sqlite3.Database(file);
    var query_select = "SELECT * FROM ALBUMS WHERE albumID=" + albumID;
    var query_update_title = "UPDATE ALBUMS SET title=\"" + title + "\" where albumID=" + albumID;
    var query_update_description = "UPDATE ALBUMS SET description=\"" + description + "\" where albumID=" + albumID;
    var query_update_startDate = "UPDATE ALBUMS SET start_date=\"" + start_date + "\" where albumID=" + albumID;
    var query_update_endDate = "UPDATE ALBUMS SET end_date=\"" + end_date + "\" where albumID=" + albumID;
    
	db.get(query_select, function(err,row){
		if(err){
			throw err;
		}
		
		if(row !== undefined){
			setTimeout(function(){
				db.serialize(function(){
				    if(title !== undefined){
					    console.log("\nINFO: Updating album's title.");
					    db.run(query_update_title);
					}
					if(description !== undefined){
					    console.log("\nINFO: Updating album's description.");
					    db.run(query_update_description);
					}
					if(start_date !== undefined){
					    console.log("\nINFO: Updating album's start_date.");
					    db.run(query_update_startDate);
					}
					if(end_date !== undefined){
					    console.log("\nINFO: Updating album's end_date.");
					    db.run(query_update_endDate);
					}
					res("true");
					//fechar a db
                    db.close();
				});
			}, 4000);
		} else {
			res("false");
			//fechar a db
            db.close();
		}
	});
}

function deleteAlbum(albumID, res){
    //função para eliminar um álbum
    var db = new sqlite3.Database(file);
    var query_select = "SELECT * FROM ALBUMS WHERE albumID=" + albumID;
    var query_delete = "DELETE FROM ALBUMS WHERE albumID=" + albumID;
    
    db.get(query_select, function(err,row){
		if(err){
			throw err;
		}
		
		if(row !== undefined){
			setTimeout(function(){
				db.serialize(function(){
					console.log("\nINFO: Deleting album.");
					db.run(query_delete);
					res("true");
					//fechar a db
                    db.close();
				});
			}, 1000);
		} else {
			res("false");
			//fechar a db
            db.close();
		}
	});
}

/***************************************************************/
/*  Handler Functions                                          */
/***************************************************************/

function handleGetAlbums(req, res){
	getUserAlbums(req.userID, function(result){
		res.status(200).send(result);
	});
};

function handlePostAlbums(req, res){
	createAlbum(req.body.title, req.userID, req.body.description, req.body.start_date, req.body.end_date, function(result){
       	setTimeout(function () {
       		if(result === "true"){
                getAlbumWithInfo(req.body.title, req.userID, req.body.description, req.body.start_date, req.body.end_date, function(result){
                    setTimeout(function(){
                        res.status(201).send(result);
                    }, 2000)
                });
        	}
        }, 4000);
    });
};

function handlePutAlbums(req, res){
	res.status(405).send("Cannot overwrite the entire collection.");
};

function handleDeleteAlbums(req, res){
	res.status(405).send("Cannot delete the entire collection.");
};

function handleGetAlbumItem(req, res){
	getAlbum(req.albumID, function(result){
    	res.status(200).send(result);
    });
};

function handlePostAlbumItem(req, res){
	updateAlbum(req.albumID, req.body.title, req.body.description, req.body.start_date, req.body.end_date, function(result){
    	setTimeout(function(){
    	    if(result === "true"){
    			res.status(200).send('Album was updated');
    		} else {
    			res.status(204).send('Album was not found');
    		}
    	}, 8000);
    });
};

function handlePutAlbumItem(req, res){
	res.status(405).send("Not allowed.");
};

function handleDeleteAlbumItem(req, res){
	deleteAlbum(req.albumID, function(result){
        setTimeout(function(){
            if(result === "true"){
                res.status(200).send('Album was deleted');
            } else {
                res.status(204).send('Album was not found');
            }            
        }, 4000);  
    });  
}	

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.createAlbum = createAlbum;
exports.getUserAlbums = getUserAlbums;
exports.getAlbum = getAlbum;
exports.getAlbumWithInfo = getAlbumWithInfo;
exports.updateAlbum = updateAlbum;
exports.deleteAlbum = deleteAlbum;

exports.handleGetAlbums = handleGetAlbums;
exports.handlePostAlbums = handlePostAlbums;
exports.handlePutAlbums = handlePutAlbums;
exports.handleDeleteAlbums = handleDeleteAlbums;

exports.handleGetAlbumItem = handleGetAlbumItem;
exports.handlePostAlbumItem = handlePostAlbumItem;
exports.handlePutAlbumItem = handlePutAlbumItem;
exports.handleDeleteAlbumItem = handleDeleteAlbumItem;