/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Node module to handle albuns resource                      */
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

/** Função testada e funcional **/
function createAlbum(title, userID, description, start_date, end_date, result){
	//função para criar um novo album na db.	
	var query = "INSERT INTO ALBUNS (title, userID, description, start_date, end_date) VALUES (?,?,?,?,?)";
	
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

/** Função testada e funcional **/
function getUserAlbuns(userID, result){
	//função para obter as informações de todos os álbuns do utilizador
	var query = "SELECT * FROM ALBUNS WHERE userID=" + userID;
	
	//variavéis para armazenar as strings json
	var albuns = [];
    var album_json = "";
    var albuns_json = "";  
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	console.log("\nINFO: Getting all albuns of the user with id " + userID + ".");  
	
	//obter o álbum
	db.each(query, function(err, row){
		if(err) {
			throw err;
		}			
		
		if(row !== null){
            //criar string json para cada album 
            album_json = "{\"albumID\":" + row.albumID + ",\"title\":\"" + row.title + "\",\"userID\":" + row.userID + ",\"description\":\"" + row.description + "\",\"start_date\":\"" + row.start_date + "\",\"end_date\":\"" + row.end_date + "\"}";
            //armazenar no array
            albuns.push(album_json); 
		}
	});
	
	db.close();
	
	setTimeout(function(){
	    albuns_json = "[";
    	
    	for(var i = 0; i < albuns.length; i++){
    	    albuns_json += albuns[i];
    	    if(i !== (albuns.length-1)){
    	        albuns_json += ",";
    	    }
    	}
    	
    	albuns_json += "]";    	
	
		result(albuns_json);
	}, 5000);
}

/** Função testada e funcional **/
function getAlbum(albumID, res){
    //função para obter as informações de um álbum especifico
    var query = "SELECT * FROM ALBUNS WHERE albumID=" + albumID;
    
    var album_json = "";
    var result = "";
    
    //abrir instância da db.
	var db = new sqlite3.Database(file);
	
	console.log("\nINFO: Getting album of the user.");  
	
	//obter o álbum
	db.get(query, function(err, row){
		if(err) {
			throw err;
		}			
		
		if(row !== undefined){
            //criar string json para o album 
            console.log("albumID: " + row.albumID + "; Title: " + row.title + "; userID: " + row.userID + "; Description: " + row.description + "; Start Date: " + row.start_date + "; End Date: " + row.end_date);
            album_json = "{\"albumID\":" + row.albumID + ",\"title\":\"" + row.title + "\",\"userID\":" + row.userID + ",\"description\":\"" + row.description + "\",\"start_date\":\"" + row.start_date + "\",\"end_date\":\"" + row.end_date + "\"}";
		}
	});
	
	setTimeout(function(){
		result = "[" + album_json + "]";
		res(result);
		
		//fechar a db
        db.close();
	},1000);
}

/** Função testada e funcional **/
function updateAlbum(albumID, title, description, start_date, end_date, res){
    //função para atualizar um álbum
    var db = new sqlite3.Database(file);
    var query_select = "SELECT * FROM ALBUNS WHERE albumID=" + albumID;
    var query_update_title = "UPDATE ALBUNS SET title=\"" + title + "\" where albumID=" + albumID;
    var query_update_description = "UPDATE ALBUNS SET description=\"" + description + "\" where albumID=" + albumID;
    var query_update_startDate = "UPDATE ALBUNS SET start_date=\"" + start_date + "\" where albumID=" + albumID;
    var query_update_endDate = "UPDATE ALBUNS SET end_date=\"" + end_date + "\" where albumID=" + albumID;
    
	db.get(query_select, function(err,row){
		if(err){
			throw err;
		}
		
		if(row !== null){
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

/** Função testada e funcional **/
function deleteAlbum(albumID, res){
    //função para eliminar um álbum
    var db = new sqlite3.Database(file);
    var query_select = "SELECT * FROM ALBUNS WHERE albumID=" + albumID;
    var query_delete = "DELETE FROM ALBUNS WHERE albumID=" + albumID;
    
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
/*  Module Exports		                                       */
/***************************************************************/

exports.createAlbum = createAlbum;
exports.getUserAlbuns = getUserAlbuns;
exports.getAlbum = getAlbum;
exports.updateAlbum = updateAlbum;
exports.deleteAlbum = deleteAlbum;