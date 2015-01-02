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

/** Função testada e funcional **/
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

/** Função testada e funcional **/
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

/** Função testada e funcional **/
function login(user, password, result){
    //função para validar os dados inseridos pelo utilizador    
    var db = new sqlite3.Database(file);
    
    var userRes = "";
    var passwordRes = "";
    var query = "SELECT * FROM USERS WHERE user=\""+user+"\"";
    
    console.log("\nINFO: Checking user credentials.");
    
    //procurar utilizador na db
    db.get(query, function(err, res){
        
        //caso ocorra algum erro
        if (err) {
            throw err;
        }
        
        //caso encontre
        if(res !== null){
            userRes = res.user;
            passwordRes = res.password;
        }
    });

    //timeout necessário para dar tempo a db responder à query.
    setTimeout(function () {           
        //comparar o que encontrou na DB com o que foi inserido pelo utilizador
        if(user === userRes && password === passwordRes){
            result("true");
        } else {
            result("false");
        }    
        //fechar a db
        db.close();        
    }, 500);
}

/** Função testada e funcional **/
function showAllUsers(result){
    var db = new sqlite3.Database(file);
    var query = "SELECT * FROM USERS";
    var users = [];
    var user_json = "";
    var users_json = "";  
    
    console.log("\nINFO: Showing all users.");  

    db.each(query, function(err, row){
        if (err) {
            throw err;
        }
        
        if(row !== null)
        {
            console.log("ID: " + row.userID + "; Utilizador: " + row.user + "; Password: " + row.password);
            
            user_json = "{\"userID\":" + row.userID + ",\"user\":\"" + row.user + "\",\"password\":\"" + row.password + "\"}";
            
            users.push(user_json);                        
        }
    });
    
    setTimeout(function(){
    	users_json = "[";
    	
    	for(var i = 0; i < users.length; i++){
    	    users_json += users[i];
    	    if(i !== (users.length-1)){
    	        users_json += ",";
    	    }
    	}
    	
    	users_json += "]";
    	
    	//fechar a db
        db.close();
    	result(users_json);
    },1000);    	
}

/** Função testada e funcional **/
function getUser(userID, res){
	//função para obter informações de um determinado utilizador na db.
	var db = new sqlite3.Database(file);
	var query = "SELECT * FROM USERS WHERE userID=" + userID;
	var user_json = "";
	var result = "";
	
	console.log("\nINFO: Getting user information.");
	
	db.get(query, function(err, row){
		if(err) {
			throw err;
		} 
		
		if(row !== undefined){
			console.log("ID: " + row.userID + "; Utilizador: " + row.user + "; Password: " + row.password);
			user_json = "{\"userID\":" + row.userID + ",\"user\":\"" + row.user + "\",\"password\":\"" + row.password + "\"}";
		}
	});
	
	setTimeout(function(){
		result = "[" + user_json + "]";
		res(result);
		
		//fechar a db
        db.close();
	},1000);
}

/** Função testada e funcional **/
function updateUserPass(userID, newPass, res){
	//função para atualizar a password de um utilizador.
	var db = new sqlite3.Database(file);
	var query_select = "SELECT * FROM USERS WHERE userID=" + userID;
	var query_update = "UPDATE USERS SET password=\""+ newPass +"\" where userID=" + userID; 
	
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

/** Função testada e funcional **/
function deleteUser(userID, res){
    //função para eliminar um utilizador.
    var db = new sqlite3.Database(file);
    var query_select = "SELECT * FROM USERS WHERE userID=" + userID;
    var query_delete = "DELETE FROM USERS WHERE userID=" + userID;
    
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
exports.updateUserPass = updateUserPass;
exports.deleteUser = deleteUser;