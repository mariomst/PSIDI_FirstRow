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
	
	//variavéis para armazenar as strings json
	var photos = [];
    var photo_json = "";
    var photos_json = "";  
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	console.log("\nINFO: Getting all photos from album.");  
	
	//obter as photos
	db.each(query, function(err, row){
		if(err) {
			throw err;
		}			
		
		if(row !== undefined){
            //criar string json para cada foto 
            photo_json = "{\"photoID\":" + row.photoID + ",\"albumID\":\"" + row.albumID + "\",\"photo\":\"" + row.photo + "\",\"description\":\"" + row.description + "\",\"date\":\"" + row.date + "\"}";
            //armazenar no array
            photos.push(photo_json); 
		}
	});
		
	setTimeout(function(){
	    photos_json = "[";
    	
    	for(var i = 0; i < photos.length; i++){
    	    photos_json += photos[i];
    	    if(i !== (photos.length-1)){
    	        photos_json += ",";
    	    }
    	}
    	
    	photos_json += "]";    	
	
		result(photos_json);

		//fechar a db
		db.close();
	}, 5000);
}

function getPhoto(photoID, result){
	//query para obter uma foto específica.
	var query = "SELECT * FROM PHOTOS WHERE photoID=" + photoID;
	
	//para a informação a ser retornada em json.
	var photo_json = "";
    var result_json = "";
    
    //abrir instância da db.
	var db = new sqlite3.Database(file);
	
	console.log("\nINFO: Getting photo.");  

	//obter a foto
	db.get(query, function(err, row){
		if(err) {
			throw err;
		}			
		
		if(row !== undefined){
            //criar string json para a foto 
            console.log("photoID: " + row.photoID + "; albumID: " + row.albumID + "; Filename: " + row.photo + "; Description: " + row.description + "; Date: " + row.date);
            photo_json = "{\"photoID\":" + row.photoID + ",\"albumID\":\"" + row.albumID + "\",\"photo\":\"" + row.photo + "\",\"description\":\"" + row.description + "\",\"date\":\"" + row.date + "\"}";
		}
	});
	
	setTimeout(function(){
		result_json = "[" + photo_json + "]";
		result(result_json);
		
		//fechar a db
        db.close();
	},1000);
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
/*  Module Exports		                                       */
/***************************************************************/

exports.getPhotos = getPhotos;
exports.getPhoto = getPhoto;
exports.insertPhoto = insertPhoto;
exports.updatePhoto = updatePhoto;
exports.deletePhoto = deletePhoto;