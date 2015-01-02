/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Backoffice API                                             */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

/***************************************************************/
/*  Necessary Modules                                          */
/***************************************************************/

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var usersHandler = require('./handlers/users-handler');
var albunsHandler = require('./handlers/albuns-handler');
var photosHandler = require('./handlers/photos-handler');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer({dest: './photos/'}));

/***************************************************************/
/*  Data                                                       */
/***************************************************************/

const port = process.env.PORT || 2001;
const server_root = "http://localhost:" + port;

/***************************************************************/
/*  Database                                                   */
/*  Baseado no tutorial deste website (http://goo.gl/JxMvRB)   */
/***************************************************************/

var file = "./database/myphotoalbum.db";
var exists = fs.existsSync(file);

if(!exists){
    console.log("INFO: Creating new DB file.");
    fs.openSync(file, "w");
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function(){
    if(!exists){
        console.log("INFO: Creating tables.\n->PUBLICURI\n->USERS\n->ALBUNS\n->PHOTOS");
        db.run("CREATE TABLE PUBLICURI (uri TEXT, userID INTEGER)");
        db.run("CREATE TABLE USERS (userID INTEGER PRIMARY KEY, user TEXT, password TEXT)");
        db.run("CREATE TABLE ALBUNS (albumID INTEGER PRIMARY KEY, title TEXT, userID INTEGER, description TEXT, start_date TEXT, end_date TEXT)");
        db.run("CREATE TABLE PHOTOS (photoID INTEGER PRIMARY KEY, albumID INTEGER, photo TEXT, description TEXT, date TEXT)");
    }   
});

db.close();

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
    	usersHandler.createUser(req.body.user, req.body.pass, function(result){
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
		usersHandler.login(req.body.user, req.body.pass, function(result){
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
		usersHandler.showAllUsers(function(result){
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
/*    URL:    /users/:id                                       */
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
    	usersHandler.getUser(req.userID, function(result){
    		res.status(200).send(result);
    	});
    })
    .post(function(req, res){
    	//chamar função para atualizar password de utilizador
    	usersHandler.updateUserPass(req.userID, req.body.pass, function(result){
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
    	usersHandler.deleteUser(req.userID, function(result){
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
/*    URL:    /users/:userID/albuns                            */
/*                                                             */
/*    GET     Retornar todos os álbuns                         */
/* 	  POST    Criar novo álbum                                 */
/*  					                                       */
/*	  Estado: Testado e funcional							   */
/***************************************************************/	

app.route("/users/:userID/albuns")
	.get(function(req,res){
		albunsHandler.getUserAlbuns(req.userID, function(result){
			res.status(200).send(result);
		});
	})
	.post(function(req,res){        
        //chamar função para criar álbum
		albunsHandler.createAlbum(req.body.title, req.userID, req.body.description, req.body.start_date, req.body.end_date, function(result){
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
/*	  Álbuns individuais		                               */
/*                                                             */
/*    URL:    /users/:userID/albuns/:albumID                   */
/*                                                             */
/*    GET     retornar álbum especifico                        */
/*    POST    atualizar álbum especifico                       */
/*    DELETE  apagar álbum especifico                          */
/*  					                                       */
/*	  Estado: Testado e funcional 							   */
/***************************************************************/

app.param('albumID', function(req, res, next, albumID){
    req.albumID = albumID;
    return next()
})

app.route("/users/:userID/albuns/:albumID")
    .get(function(req, res){ 
    	albunsHandler.getAlbum(req.albumID, function(result){
    		res.status(200).send(result);
    	});
    })
    .post(function(req, res){
    	//chamar função para atualizar um album
    	albunsHandler.updateAlbum(req.albumID, req.body.title, req.body.description, req.body.start_date, req.body.end_date, function(result){
    	    setTimeout(function(){
    	        if(result === "true"){
    				res.status(200).send('Album was updated');
    			} else {
    				res.status(204).send('Album was not found');
    			}
    	    }, 8000);
    	});
    })
    .put(function(req, res){
    	res.status(405).send("Not allowed.");
    })
    .delete(function(req, res) {
    	albunsHandler.deleteAlbum(req.albumID, function(result){
            setTimeout(function(){
                if(result === "true"){
                    res.status(200).send('Album was deleted');
                } else {
                    res.status(204).send('Album was not found');
                }            
            }, 4000);  
        });  
	});	

/***************************************************************/
/*	  Colecção de fotos			                               */
/*                                                             */
/*    URL:    /users/:userID/albuns/:albumID/photos            */
/*                                                             */
/*    GET     Retornar todas as fotos de um álbum              */
/* 	  POST    Upload de uma fotografia                         */
/*  					                                       */
/*	  Estado: -												   */
/***************************************************************/

app.route("/users/:userID/albuns/:albumID/photos")
	.get(function(req,res){
		res.status(404).send("Not implemented yet.");
	})
	.post(function(req,res){        
		//chamar função para upload de foto
		var filename = req.files.displayImage.path;
		photosHandler.insertPhoto(req.albumID, filename, req.body.description, req.body.date, function(result){
			setTimeout(function () {
				if(result === "true"){
					res.status(201).send('Photo uploaded');
				} else {
					res.status(500).send('Error uploading the photo');
				}
			}, 10000);
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