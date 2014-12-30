/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Backoffice API                                             */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/***************************************************************/
/*  Data                                                       */
/***************************************************************/

const port = process.env.PORT || 2001;
const server_root = "http://localhost:" + port;

/***************************************************************/
/*  Database                                                   */
/*  Baseado no tutorial deste website (http://goo.gl/JxMvRB)   */
/***************************************************************/

var file = "myphotoalbum.db";
var exists = fs.existsSync(file);

if(!exists){
    console.log("INFO: Creating new DB file.");
    fs.openSync(file, "w");
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function(){
    if(!exists){
        console.log("INFO: Creating tables.\n-> USERS\n->ALBUNS\n->PHOTOS");
        db.run("CREATE TABLE USERS (userID INTEGER PRIMARY KEY, user TEXT, password TEXT)");
        db.run("CREATE TABLE ALBUNS (albumID INTEGER PRIMARY KEY, title TEXT, userID INTEGER, description TEXT, start_date TEXT, end_date TEXT)");
        db.run("CREATE TABLE PHOTOS (photoID INTEGER PRIMARY KEY, albumID INTEGER, photo BLOB, description TEXT, date TEXT)");
    }   
});

db.close();

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

/******** Funções relacionadas com os utilizadores *************/

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
		
		if(row !== null){
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

/*********** Funções relacionadas com os álbuns ****************/

/** Função testada e funcional **/
function createAlbum(title, userID, description, start_date, end_date, result){
	//função para criar um novo album na db.	
	var query = "INSERT INTO ALBUNS (title, userID, description, start_date, end_date) VALUES (?,?,?,?,?)";
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	//criar novo álbum
	db.serialize(function(){
		console.log("Info: A criar álbum com as seguintes informações");
		console.log("-> title: " + title);
		console.log("-> userID: " + userID);
		console.log("-> description: " + description);
		console.log("-> start_date: " + start_date);
		console.log("-> end_date: " + end_date);
		
		db.run(query, title, userID, description, start_date, end_date);
		
		console.log("Info: Álbum criado");
		
		result("true");
		
		db.close();
	});
}

/** Função testada e funcional **/
function getUserAlbuns(userID, result){
	//função para obter as informações do álbum
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

/***************************************************************/
/*    Registo de novos utilizadores.                           */
/*                                                             */
/*    URL:    /signup                                          */
/*                                                             */
/*    POST    Registar utilizador                              */
/*															   */
/*	  Estado: Testado e funcional							   */
/***************************************************************/

app.route("/signup")
    .get(function(req,res){
        res.status(405).send("Not allowed.");
    })
    .post(function(req,res){
        //chamar função para criar utilizador
        createUser(req.body.user, req.body.pass, function(result){
        	setTimeout(function () {        		
        		if(result === "true"){
        			res.status(201).send('User created');
        		} else {
        			res.status(406).send('User already exists');
        		}
        	}, 4000);
        });
    })
    .put(function(req,res){
        res.status(405).send("Not allowed.");
    })
    .delete(function(req,res){
        res.status(405).send("Not allowed.");
    });

/***************************************************************/
/*    Autenticação de um utilizador                            */
/*                                                             */
/*    URL:    /login                                           */
/*                                                             */
/*    POST    Autenticar utilizador                            */
/*															   */
/*	  Estado: Testado e funcional   						   */
/***************************************************************/

app.route("/login")
	.get(function(req,res){
		res.status(405).send("Not allowed.");
	})
	.post(function(req,res){
	    //chamar função para autenticar o utilizador
	    login(req.body.user, req.body.pass, function(result){
	        setTimeout(function(){
	            if(result === "true"){
	                res.status(202).send("Authentication was successful");
	            } else {
	                res.status(400).send("Authentication failed, please check username and password");
	            }	            
	        }, 4000);
	    });	  
	})
	.put(function(req,res){
		res.status(405).send("Not allowed.");
	})
	.delete(function(req,res){
		res.status(405).send("Not allowed.");
	});	

/***************************************************************/
/*    Colecção de utilizadores                                 */
/*                                                             */
/*    URL:    /users                                           */
/*                                                             */
/*    GET    Retorna todos os utilizadores                     */
/*															   */
/*	  Estado: Testado e funcional							   */
/***************************************************************/

app.route("/users")
	.get(function(req,res){
		showAllUsers(function(result){
			res.status(200).send(result);
		});
	})
	.post(function(req,res){
		res.status(405).send("Not allowed.");
	})
	.put(function(req,res){
		res.status(405).send("Cannot overwrite the entire collection.");
	})
	.delete(function(req,res){
		res.status(405).send("Cannot delete the entire collection.");
	});	

/***************************************************************/
/* 	  Utilizadores individuais                                 */
/*                                                             */
/*    URL:    /user/:id                                        */
/*                                                             */
/*    GET     retornar utilizador especifico                   */
/*    POST    atualizar password do utilizador                 */
/*    DELETE  apagar utilizador                                */
/*	  														   */
/*	  Estado: Testado e funcional   						   */
/***************************************************************/

app.param('userID', function(req, res, next, userID){
    req.userID = userID;
    return next()
})

app.route("/users/:userID")
    .get(function(req, res){ 
    	getUser(req.userID, function(result){
    		res.status(200).send(result);
    	});
    })
    .post(function(req, res){
    	//chamar função para atualizar password de utilizador
    	updateUserPass(req.userID, req.body.pass, function(result){
    		setTimeout(function () {
    			if(result === "true"){
    				res.status(200).send('Password was updated');
    			} else {
    				res.status(204).send('User was not found');
    			}
    		}, 4000);    		
    	});   	
    })
    .put(function(req, res){
    	res.status(405).send("Not allowed.");
    })
    .delete(function(req, res) {
        deleteUser(req.userID, function(result){
            setTimeout(function(){
                if(result === "true"){
                    res.status(200).send('User was deleted');
                } else {
                    res.status(204).send('User was not found');
                }            
            }, 4000);  
        });  
	});	

/***************************************************************/
/*	  Colecção de álbuns		                               */
/*                                                             */
/*    URL:    /user/:userID/album                              */
/*                                                             */
/*    GET     Retornar todos os álbuns                         */
/* 	  POST    Criar novo álbum                                 */
/*  					                                       */
/*	  Estado: Testado e funcional							   */
/***************************************************************/	

app.route("/users/:userID/albuns")
	.get(function(req,res){
	    getUserAlbuns(req.userID, function(result){
			res.status(200).send(result);
		});
	})
	.post(function(req,res){        
        //chamar função para criar álbum
        createAlbum(req.body.title, req.userID, req.body.description, req.body.start_date, req.body.end_date, function(result){
        	setTimeout(function () {
        		if(result === "true"){
        			res.status(201).send('Album created');
        		}
        	}, 4000);
        });
    })
	.put(function(req,res){
		res.status(405).send("Cannot overwrite the entire collection.");
	})
	.delete(function(req,res){
		res.status(405).send("Cannot delete the entire collection.");
	});	

/***************************************************************/
/*  Starting...                                                */
/***************************************************************/

app.listen(port, function(){
    console.log("Listening on " + port);
});