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

/***************************************************************/
/*  Database                                                   */
/***************************************************************/

var file = "./database/myphotoalbum.db";

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function createPrintAlbum(userID, theme, title, message, result){
	//query para inserção de um novo PrintAlbum.
	var query = "INSERT INTO PRINTALBUMS (userID, theme, title, message) VALUES (?,?,?,?)";

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	//criar novo PrintAlbum.
	db.serialize(function(){
		console.log("INFO: Creating new PrintAlbum.");
		//executar query.
		db.run(query, userID, theme, title, message);
		console.log("INFO: PrintAlbum created.");
		result("true");
		//fechar instância da db.
		db.close();
	}); 
}

function getPrintAlbumsByUserID(userID, result){
	//query para obter as informações de todos os PrintAlbums de um utilizador.
	var query = "SELECT * FROM PRINTALBUMS WHERE userID=" + userID;

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	//array para armazenar os albums.
	var albums = [];

	//variáveis para armazenar as strings json.
	var album_json = "";
	var albums_json = "";

	//para cada album que encontrar.
	db.each(query, 
		function(err, row){
			if(err) return callback(err);
		}
		,function(err, row){
			if(err) return callback(err);
			//criar string json para cada printalbum.
			if(row !== undefined){
				album_json = "{\"albumID\":" + row.albumID 
						+ ",\"userID\":" + row.userID
						+ ",\"theme\":\"" + row.theme
						+ "\",\"title\":\"" + row.title;
						+ "\",\"message\":\"" + row.message
						+ "\"}"; 
				handler(album_json);
			}
		}
		,function(err,row){
			completed();
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

function getSpecificPrintAlbum(albumID, result){}
 
function updatePrintAlbum(albumID, theme, title, message, result){}

function deletePrintAlbum(albumID, result){}

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.createPrintAlbum = createPrintAlbum;
exports.getPrintAlbumsByUserID = getPrintAlbumsByUserID
exports.getSpecificPrintAlbum = getSpecificPrintAlbum;
exports.updatePrintAlbum = updatePrintAlbum;
exports.deletePrintAlbum = deletePrintAlbum;
