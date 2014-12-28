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
    console.log("-> Creating new DB file.");
    fs.openSync(file, "w");
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function(){
    if(!exists){
        console.log("-> Creating tables.");
        db.run("CREATE TABLE USERS (userID INTEGER PRIMARY KEY, user TEXT, password TEXT)");
        db.run("CREATE TABLE ALBUNS (albumID INTEGER PRIMARY KEY, title TEXT, userID TEXT, description TEXT, start_date TEXT, end_date TEXT)");
        //falta: tabela de fotos
    }   
});

db.close();

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
                    console.log("Info: A criar utilizador com as seguintes informações");                    
                    console.log("-> user: " + user);
                    console.log("-> password: " + password);
                    
                    db.run(query, user, password);
                    
                    console.log("Info: Utilizador criado.");
                    result("true");
                });
                db.close();
            } else {
                console.log("Erro: Utilizador já existe.");  
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
    
    console.log("Info: A verificar se já existe utilizador");
    
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
    
    var userRes = "";
    var passwordRes = "";
    var query = "SELECT * FROM USERS WHERE user=\""+user+"\"";
    
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
       
    //fechar a db
    db.close();
    
    //timeout necessário para dar tempo a db responder à query.
    setTimeout(function () {           
        //comparar o que encontrou na DB com o que foi inserido pelo utilizador
        if(user === userRes && password === passwordRes){
            result("true");
        } else {
            result("false");
        }    
    }, 500);
}

/** Função testada e funcional **/
function showAllUsers(result){
    var db = new sqlite3.Database(file);
    var query = "SELECT * FROM USERS";
    var users = "";
    var text = "";    

    db.each(query, function(err, row){
        if (err) {
            throw err;
        }
        
        if(row != null)
        {
            console.log("ID: " + row.userID + "; Utilizador: " + row.user + "; Password: " + row.password);
            users += "<tr><td>" + row.userID + "</td><td>" + row.user + "</td><td>" + row.password + "</td></tr>";            
        }
        else{
        	users += "</table>";
        }
    });
    
    setTimeout(function(){
    	text = "<table border=\"1\"><tr><td>UserID</td><td>User</td><td>Password</td></tr>";
    	text += users;
    	
    	result(text);
    },1000);    	
}

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

function getUserAlbuns(userID, result){
	//função para obter as informações do álbum
	var query = "SELECT * FROM ALBUNS WHERE userID=\"" + userID + "\"";
	
	//tabela html para apresentar os álbuns do utilizador
	var html_albuns = "";
	
	//abrir instância da db.
	var db = new sqlite3.Database(file);
	
	//obter o álbum
	db.each(query, function(err, row){
		if(err) {
			throw err;
		}			
		
		if(row != null){
			/*album.push(row.albumID);
			album.push(row.title);
			album.push(row.userID);
			album.push(row.description);
			album.push(row.start_date);
			album.push(row.end_date);*/
			
			html_albuns += "<tr><td>" + row.albumID + "</td><td>" + row.title + "</td><td>" + row.userID + "</td><td>" + row.description + "</td><td>" + row.start_date + "</td><td>" + row.end_date + "</td></tr>";
		}
	});
	
	db.close();
	
	setTimeout(function(){
		result(html_albuns);
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
/*	  Estado: ainda não implementado						   */
/***************************************************************/

app.route("/login")
	.get(function(req,res){
		res.status(405).send("Not allowed.");
	})
	.post(function(req,res){
		res.status(404).send("Not implemented yet.");
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
/* 		Utilizadores individuais                               */
/*                                                             */
/*  	URL:    /user/:id                                      */
/*                                                             */
/*  	GET     retornar utilizador especifico                 */
/*  	POST    atualizar password do utilizador               */
/*  	DELETE  apagar utilizador                              */
/*	  														   */
/*	  Estado: ainda não implementado						   */
/***************************************************************/

app.param('userID', function(req, res, next, userID){
    req.userID = userID;
    return next()
})

app.route("/users/:userID")
    .get(function(req, res){
    	res.status(404).send("Not implemented yet.");     
    })
    .post(function(req, res){
    	res.status(404).send("Not implemented yet.");     
    })
    .put(function(req, res){
    	res.status(405).send("Not allowed.");
    })
    .delete(function(req, res) {
    	res.status(404).send("Not implemented yet.");     
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
		var html_text = "";
		var html_albuns = "";
		
		getUserAlbuns(req.userID, function(albuns){
			if(albuns.length > 0){					
				html_albuns = albuns;
			}
		});
		
		setTimeout(function () {
			html_text = "<table border=\"1\"><tr>" +
					"<td>AlbumID</td>" +
					"<td>Title</td>" +
					"<td>UserID</td>" +
					"<td>Description</td>" +
					"<td>Start Date</td>" +
					"<td>End Date</td></tr>";
			html_text += html_albuns;
			html_text += "</table>"
							
			res.status(200).send(html_text);
		}, 6000);
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