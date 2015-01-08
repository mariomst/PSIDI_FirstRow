/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Node module to handle photos resource                      */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

/***************************************************************/
/*  Necessary Modules                                          */
/***************************************************************/

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var mkdirp = require('mkdirp');

/***************************************************************/
/*  Database                                                   */
/***************************************************************/

var file = "./database/myphotoalbum.db";

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function getPhotos(albumID, result){
	//query para obter fotos de um album específico.
	var query = "SELECT * FROM PHOTOS WHERE albumID=" + albumID;
	
	//variavél para armazenar as strings json
    var photos_json = "[";  
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	console.log("\nINFO: Getting all photos from album.");  	

	//obter as photos
	db.each(query, 
		function(err, row){ 
			if(err) return callback(err);
		},			
		function(err, row){
			if(err) return callback(err);
			if(row !== undefined){
            	//criar string json para cada foto 
            	var photo_json = "{\"photoID\":" + row.photoID 
            				+ ",\"albumID\":" + row.albumID 
            				+ ",\"photo\":\"" + row.photo 
            				+ "\",\"description\":\"" + row.description 
            				+ "\",\"date\":\"" + row.date + "\"}";
				handler(photo_json);
			}
		},
		function(err, row){
			completed();
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
	};

	var completed = function(){
		photos_json += "]";
		result(photos_json);
	}
		
	//fechar instância da db.
	db.close();
}

function getPhoto(photoID, result){
	//query para obter uma foto específica.
	var query = "SELECT * FROM PHOTOS WHERE photoID=" + photoID;
	
	//variavél para armazenar as strings json
    var result_json = "";  
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	console.log("\nINFO: Getting photo.");  

	//obter a foto
	db.get(query, 
		function(err, row){ 
			if(err) return callback(err);
		},				
		function(err, row){
			if(row !== undefined){
				//criar string json para cada foto
				var photo_json = "{\"photoID\":" + row.photoID 
            			+ ",\"albumID\":" + row.albumID 
            			+ ",\"photo\":\"" + row.photo 
            			+ "\",\"description\":\"" + row.description 
            			+ "\",\"date\":\"" + row.date + "\"}";
				completed(photo_json);
			} else {
				completed("");
			}
		}
	);

	var completed = function(json){
		result_json += json;
		result(result_json);
	}
		
	//fechar instância da db.
	db.close();
}

function insertPhoto(albumID, filename, description, date, photos_dir, result){
	//query de inserção de fotos.
	var query = "INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (?,?,?,?)";

	console.log(filename);

	//remover photos/ do filename
	var ext = filename.substr(filename.lastIndexOf('/'));

	//upload da foto para a pasta	
	var oldPath = "./photos" + ext;
	var newPath =  "./photos/" + albumID + ext;
	var albumPath = "./photos/" + albumID;
	//var photoPath = albumPath + ext;

	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	//executar query
	db.serialize(function(){
		console.log("INFO: Creating photo with the following information");
		console.log("-> albumID: " + albumID);
		console.log("-> filename: " + newPath);
		console.log("-> description: " + description);
		console.log("-> date: " + date);
		
		db.run(query, albumID, newPath, description, date);
		
		console.log("INFO: Photo added");
		
		db.close();
	});		
	
	//criar pasta com o id do album
	mkdirp(albumPath, function(err) {});
	
	setTimeout(function(){
		console.log("INFO: Uploading photo to " + newPath);
		fs.rename(oldPath, newPath, function(err){
			if(!err){				
				result("true");
			} else {
				console.log(err);
				result("false");
			}
		});
	}, 8000);
	
	//apagar ficheiro repetido
	//fs.unlinkSync('./photos/' + ext);
}

function updatePhoto(photoID, description, date, result){
	//queries para atualizar informações de uma foto
    var query_select = "SELECT * FROM PHOTOS WHERE photoID=" + photoID;
    var query_update_description = "UPDATE PHOTOS SET description=\"" + description + "\" where photoID=" + photoID;
    var query_update_date = "UPDATE PHOTOS SET date=\"" + date + "\" where photoID=" + photoID;

    //abrir instância da db
	var db = new sqlite3.Database(file);
    
    //executar query
	db.get(query_select, function(err,row){
		if(err){
			throw err;
		}
		
		if(row !== undefined){
			setTimeout(function(){
				db.serialize(function(){				    
					if(description !== undefined){
					    console.log("\nINFO: Updating photos's description.");
					    db.run(query_update_description);
					}		
					if(date !== undefined){
					    console.log("\nINFO: Updating photos's date.");
					    db.run(query_update_date);
					}			
					result("true");
					//fechar a db
                    db.close();
				});
			}, 4000);
		} else {
			result("false");
			//fechar a db
            db.close();
		}
	});	
}

function deletePhoto(photoID, result){
	//queries para a eliminação de uma foto
	var query_select = "SELECT * FROM PHOTOS WHERE photoID=" + photoID;
    var query_delete = "DELETE FROM PHOTOS WHERE photoID=" + photoID;

    //abrir instância da db
	var db = new sqlite3.Database(file);

	//executar query
    db.get(query_select, function(err,row){
		if(err){
			throw err;
		}
		
		//se encontrar a foto
		if(row !== undefined){
			setTimeout(function(){
				db.serialize(function(){
					console.log("\nINFO: Deleting photo.");
					db.run(query_delete);
					result("true");
					//fechar a db
                    db.close();
				});

				//eliminar o ficheiro
				fs.unlinkSync(row.photo);
				

			}, 3000);
		} else {
			result("false");
			//fechar a db
            db.close();
		}
	});
}

/***************************************************************/
/*  Handler Functions                                          */
/***************************************************************/

function handleGetPhotos(req, res){
	getPhotos(req.albumID, function(result){
        res.status(200).send(result);
    });
};

function handlePostPhotos(req, res, photos_dir){
	console.log(req.files);        
	//chamar função para upload de foto
	var filename = req.files.file.path;
	insertPhoto(req.albumID, filename, req.body.description, req.body.date, photos_dir, function(result){
		setTimeout(function () {
			if(result === "true"){
				res.status(201).send('Photo uploaded');
			} else {
				res.status(500).send('Error uploading the photo');
			}
		}, 10000);
	});
};

function handlePutPhotos(req, res){
	res.status(405).send("Cannot overwrite the entire collection.");
};

function handleDeletePhotos(req, res){
	res.status(405).send("Cannot delete the entire collection.");
};

function handleGetPhotoItem(req, res){
	getPhoto(req.photoID, function(result){
        res.status(200).send(result);
    }); 
};

function handlePostPhotoItem(req, res){
	updatePhoto(req.photoID, req.body.description, req.body.date, function(result){
        setTimeout(function(){
            if(result === "true"){
                res.status(200).send("Photo's information was updated");
            } else {
                res.status(204).send('Photo was not found');
            }
        }, 8000);
    });
};

function handlePutPhotoItem(req, res){
	res.status(405).send("Not allowed.");
};

function handleDeletePhotoItem(req, res){
	deletePhoto(req.photoID, function(result){
        setTimeout(function(){
            if(result === "true"){
                res.status(200).send('Photo was deleted');
            } else {
                res.status(204).send('Photo was not found');
            }            
        }, 4000);  
    });  
}

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.getPhotos = getPhotos;
exports.getPhoto = getPhoto;
exports.insertPhoto = insertPhoto;
exports.updatePhoto = updatePhoto;
exports.deletePhoto = deletePhoto;

exports.handleGetPhotos = handleGetPhotos;
exports.handlePostPhotos = handlePostPhotos;
exports.handlePutPhotos = handlePutPhotos;
exports.handleDeletePhotos = handleDeletePhotos;

exports.handleGetPhotoItem = handleGetPhotoItem;
exports.handlePostPhotoItem = handlePostPhotoItem;
exports.handlePutPhotoItem = handlePutPhotoItem;
exports.handleDeletePhotoItem = handleDeletePhotoItem;