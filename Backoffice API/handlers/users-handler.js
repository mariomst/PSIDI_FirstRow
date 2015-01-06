/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Node module to handle users resource                       */
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

function createUser(user, password, result){
    //função para criar um novo utilizador na db.
    var query = "INSERT INTO USERS (user, password) VALUES (?,?)"; 
    
    findUser(user, function(res){
        //timeout necessário para dar tempo a db responder à query.
        setTimeout(function () {
            if(res === 0){
                var db = new sqlite3.Database(file);  
                //Criar novo utilizador
                db.serialize(function(){
                    console.log("\nINFO: Creating user with the following information.");                    
                    console.log("-> user: " + user);
                    console.log("-> password: " + password);
                    
                    db.run(query, user, password);
                    
                    console.log("\nINFO: User created.");
                    
                    result("true");
                });
                db.close();
            } else {
                console.log("\nINFO: User already exists.");  
                result("false");
            }                        
        }, 2000);
    }); 
}

function findUser(usr,res){
    //função para procurar um determinado utilizador na db
    var db = new sqlite3.Database(file);
    var query = "SELECT * FROM USERS WHERE user=\""+usr+"\"";
    var flag = 0;
    
    console.log("\nINFO: Checking if there is already the user " + usr + ".");
    
    db.get(query, function(err, row) {
        if (err) {
            throw err;
        }
        
        if(row !== undefined)
        {
        	if(row.user === usr)
        	{
        		flag = 1;
        		res(flag);                    
        	} else {
        		flag = 0;
        		res(flag);
        	}
        } else {
        	flag = 0;
        	res(flag);
        }
    });
    
    db.close();
}

function login(user, password, result){
    //função para validar os dados inseridos pelo utilizador    
    var db = new sqlite3.Database(file);
    
    var userID = "";
    var userRes = "";
    var passwordRes = "";
    var user_json = "";
    var query = "SELECT * FROM USERS WHERE user=\""+user+"\"";
    
    console.log("\nINFO: Checking user credentials.");
    
    //procurar utilizador na db
    db.get(query, function(err, res){
        
        //caso ocorra algum erro
        if (err) {
            throw err;
        }
        
        //caso encontre
        if(res !== undefined){
            userID = res.userID;
            userRes = res.user;
            passwordRes = res.password;
        }
    });

    //timeout necessário para dar tempo a db responder à query.
    setTimeout(function () {           
        //comparar o que encontrou na DB com o que foi inserido pelo utilizador
        if(user === userRes && password === passwordRes){
            user_json = "{\"userID\":" + userID + ",\"username\":\"" + userRes + "\"}";
            result(user_json);
        } else {
            result("false");
        }    
        //fechar a db
        db.close();        
    }, 500);
}

function showAllUsers(result){
    //query para obter todos os utilizadores
    var query = "SELECT * FROM USERS";

    //variavéil para armazenar a string json
    var users_json = "[";  

    //abrir instância da db.
    var db = new sqlite3.Database(file);
    
    console.log("\nINFO: Showing all users.");  

    db.each(query, 
        function(err, row){ 
            if(err) return callback(err);
        },
        function(err, row){
            if(err) return callback(err);
            if(row !== undefined){
                //criar string json para cada utilizador
                user_json = "{\"userID\":" + row.userID
                    + ",\"username\":\"" + row.user 
                    + "\",\"password\":\"" + row.password 
                    + "\"}";

                handler(user_json);
            }
        },
        function(err, row){
            completed();
        }
    );

    var first = true;

    var handler = function(json){
        if(!first){
            users_json += ",";
        } else {
            first = false;
        }
        users_json += json;
    }

    var completed = function(json){
        users_json += "]";
        result(users_json);
    }

    //fechar instância da db.
    db.close();  	
}

function getUser(userID, result){
	//query para obter um utilizador especifico	
	var query = "SELECT * FROM USERS WHERE userID=" + userID;

    //variavéis para armazenar a string json
    var user_json = "";
	var result_json = "[";

    //abrir instância da db.
    var db = new sqlite3.Database(file);
	
	console.log("\nINFO: Getting user information.");
	
	db.get(query, 
        function(err, row){ 
            if(err) return callback(err);
		},
        function(err, row){
            if(err) return callback(err);
            if(row !== undefined){
                //criar string json para o utilizador
                user_json = "{\"userID\":" + row.userID 
                        + ",\"username\":\"" + row.user 
                        + "\",\"password\":\"" + row.password 
                        + "\"}";
                completed(user_json);
            } else {
                completed(user_json);
            }
            
        }
	);

    var completed = function(json){
        result_json += json + "]";
        result(result_json);
    };

    //fechar instância da db.
    db.close();
}

function getUserbyName(username, result){
    //query para obter um user específico.
    var query = "SELECT * FROM USERS WHERE user=\"" + username + "\"";

    //string json para retornar
    var user_json = "";
    var result_json = "[";

    console.log("\nINFO: Getting user information.");

    //abrir instância da db.
    var db = new sqlite3.Database(file);

    db.get(query, 
        function(err, row){
            if(err) return callback(err);
        },
        function(err, row){
            if(err) return callback(err);
            if(row !== undefined){
                //criar string json para o utilizador
                user_json = "{\"userID\":" + row.userID 
                    + ",\"username\":\"" + row.user 
                    + "\"}";
                completed(user_json);
            } else {
                completed(user_json);
            }
            
        } 
    );
    
    var completed = function(json){
        result_json += json + "]";
        result(result_json);
    };

    //fechar instância da db.
    db.close();
}

function updateUserPass(userID, newPass, res){
	//query para atualizar a password de um utilizador.
    var query_select = "SELECT * FROM USERS WHERE userID=" + userID;
    var query_update = "UPDATE USERS SET password=\""+ newPass +"\" where userID=" + userID;

    //abrir instância da db.
    var db = new sqlite3.Database(file);	 
	
	db.get(query_select, function(err,row){
		if(err){
			throw err;
		}
		
		if(row !== null){
			setTimeout(function(){
				db.serialize(function(){
					console.log("\nINFO: Updating user's password.");
					db.run(query_update);
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

function deleteUser(userID, res){
    //query para eliminar um utilizador
    var query_select = "SELECT * FROM USERS WHERE userID=" + userID;
    var query_delete = "DELETE FROM USERS WHERE userID=" + userID;
    
    //abrir instância da db.
    var db = new sqlite3.Database(file);   
    
    db.get(query_select, function(err,row){
		if(err){
			throw err;
		}
		
		if(row !== undefined){
			setTimeout(function(){
				db.serialize(function(){
					console.log("\nINFO: Deleting user.");
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

exports.createUser = createUser;
exports.findUser = findUser;
exports.login = login;
exports.showAllUsers = showAllUsers;
exports.getUser = getUser;
exports.getUserbyName = getUserbyName;
exports.updateUserPass = updateUserPass;
exports.deleteUser = deleteUser;