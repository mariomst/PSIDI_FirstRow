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

function getPhotos(){}

function getPhoto(){}

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

function updatePhoto(){}

function deletePhoto(){}

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.getPhotos = getPhotos;
exports.getPhoto = getPhoto;
exports.insertPhoto = insertPhoto;
exports.updatePhoto = updatePhoto;
exports.deletePhoto = deletePhoto;