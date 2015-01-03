/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Node module to handle photos resource                      */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

const ROOT_DIR = __dirname; 

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

function getPhotos(albumID, result){}

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
            photo_json = "{\"photoID\":" + row.photoID + ",\"albumID\":\"" + row.albumID + "\",\"photo\":" + row.photo + ",\"description\":\"" + row.description + "\",\"date\":\"" + row.date + "\"}";
		}
	});
	
	setTimeout(function(){
		result_json = "[" + photo_json + "]";
		result(result_json);
		
		//fechar a db
        db.close();
	},1000);
}

function insertPhoto(albumID, filename, description, date, result){
	//query de inserção de fotos.
	var query = "INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (?,?,?,?)";
	
	//remover photos/ do filename
	var ext = filename.substr(filename.lastIndexOf('/'));

	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	//executar query
	db.serialize(function(){
		console.log("INFO: Creating photo with the following information");
		console.log("-> albumID: " + albumID);
		console.log("-> filename: " + ext);
		console.log("-> description: " + description);
		console.log("-> date: " + date);
		
		db.run(query, albumID, ext, description, date);
		
		console.log("INFO: Photo added");
		
		db.close();
	});	
	
	//upload da foto para a pasta	
	var albumPath =  "./photos/" + albumID;
	var photoPath = albumPath + ext;
	
	//criar pasta com o id do album
	mkdirp(albumPath, function(err) {});
	
	setTimeout(function(){
		console.log("INFO: Uploading photo to " + photoPath);
		fs.writeFile(photoPath, filename, function(err){
			if(!err){				
				result("true");
			} else {
				console.log(err);
				result("false");
			}
		});
	}, 5000);
	
	//apagar ficheiro repetido
	fs.unlinkSync('./photos/' + ext);
}

function updatePhoto(photoID, description, date, result){}

function deletePhoto(photoID, result){}

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.getPhotos = getPhotos;
exports.getPhoto = getPhoto;
exports.insertPhoto = insertPhoto;
exports.updatePhoto = updatePhoto;
exports.deletePhoto = deletePhoto;