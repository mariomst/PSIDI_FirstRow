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
				var album_json = "{\"albumID\":" + row.albumID 
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

function getSpecificPrintAlbum(albumID, result){
	//query para obter PrintAlbum especifico
	var query = "SELECT * FROM PRINTALBUMS WHERE albumID=" + albumID;

	//abrir instância da db.
	var db = new sqlite3.Database(file);

	//variáveis para armazenar as strings json.
	var album_json = "";

	//obter o printalbum.
	db.get(query, 
		function(err, row){
			if(err) return callback(err);
		}
		,function(err, row){
			if(err) return callback(err);
			//criar string json para o printalbum.
			if(row !== undefined){
				var album_json = "{\"albumID\":" + row.albumID 
						+ ",\"userID\":" + row.userID
						+ ",\"theme\":\"" + row.theme
						+ "\",\"title\":\"" + row.title;
						+ "\",\"message\":\"" + row.message
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
 
function updatePrintAlbum(albumID, theme, title, message, result){
	//queries para atualizar um álbum
	var query_select = "SELECT * FROM PRINTALBUMS WHERE albumID=" + albumID;
    var query_update_theme = "UPDATE PRINTALBUMS SET theme=\"" + theme + "\" where albumID=" + albumID;
    var query_update_title = "UPDATE PRINTALBUMS SET title=\"" + title + "\" where albumID=" + albumID;
    var query_update_message = "UPDATE PRINTALBUMS SET message=\"" + message + "\" where albumID=" + albumID;
    
    //abrir instância da db
	var db = new sqlite3.Database(file);

	db.get(query_select, function(err,row){
		if(err){
			throw err;
		}

		if(row !== undefined){
			setTimeout(function(){
				db.serialize(function(){
				    if(theme !== undefined){
					    console.log("\nINFO: Updating printalbum's theme.");
					    db.run(query_update_theme);
					}
					if(title !== undefined){
					    console.log("\nINFO: Updating printalbum's title.");
					    db.run(query_update_title);
					}
					if(message !== undefined){
					    console.log("\nINFO: Updating printalbum's message.");
					    db.run(query_update_message);
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

function deletePrintAlbum(albumID, result){
	//query para eliminar um printalbum
	var query_select = "SELECT * FROM PRINTALBUMS WHERE albumID=" + albumID;
    var query_delete = "DELETE FROM PRINTALBUMS WHERE albumID=" + albumID;

    db.get(query_select, function(err,row){
		if(err){
			throw err;
		}
		
		if(row !== undefined){
			setTimeout(function(){
				db.serialize(function(){
					console.log("\nINFO: Deleting printalbum.");
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

function exportToPDF(){}

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.createPrintAlbum = createPrintAlbum;
exports.getPrintAlbumsByUserID = getPrintAlbumsByUserID
exports.getSpecificPrintAlbum = getSpecificPrintAlbum;
exports.updatePrintAlbum = updatePrintAlbum;
exports.deletePrintAlbum = deletePrintAlbum;
