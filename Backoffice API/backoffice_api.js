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
var albumsHandler = require('./handlers/albums-handler');
var photosHandler = require('./handlers/photos-handler');
var printAlbumsHandler = require('./handlers/printAlbums-handler');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer({dest: './photos/'}));

app.use('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Requested-With, Accept");
    if ('OPTIONS' == req.method){
        return res.sendStatus(200);
    }
    next();
});

//var allowCrossDomain = function(req, res, next) {
//    res.header('Access-Control-Allow-Origin', "*");
 //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //  res.header('Access-Control-Allow-Headers', 'Content-Type');
    //next();
//};

//app.configure(function() {
  //  app.use(allowCrossDomain);
    //some other code
//}); 

/***************************************************************/
/* Directório das fotos                                        */
/***************************************************************/

const photos_dir = __dirname + "/photos/";


/***************************************************************/
/*  Data                                                       */
/***************************************************************/

const port = process.env.PORT || 8000;
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
        console.log("INFO: Creating tables.\n->PUBLICURI\n->USERS\n->ALBUMS\n->PHOTOS\n->PRINTALBUMS\n->PRINTPHOTOS\n->ORDERS");
        db.run("CREATE TABLE PUBLICURI (uri TEXT, userID INTEGER)");
        db.run("CREATE TABLE USERS (userID INTEGER PRIMARY KEY, user TEXT, password TEXT)");
        db.run("CREATE TABLE ALBUMS (albumID INTEGER PRIMARY KEY, title TEXT, userID INTEGER, description TEXT, start_date LONG, end_date LONG)");
        db.run("CREATE TABLE PHOTOS (photoID INTEGER PRIMARY KEY, albumID INTEGER, photo TEXT, description TEXT, date LONG)");
        db.run("CREATE TABLE PRINTALBUMS (printAlbumID INTEGER PRIMARY KEY, userID INTEGER, theme TEXT, title TEXT, message TEXT)");
        db.run("CREATE TABLE PRINTPHOTOS (photoID INTEGER, printAlbumID INTEGER)");
        db.run("CREATE TABLE ORDERS (orderID INTEGER PRIMARY KEY, printPrice FLOAT, transportPrice FLOAT, address TEXT, confirmed BOOLEAN, state TEXT)");
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
    .get(usersHandler.handleGetRegister)
    .post(usersHandler.handlePostRegister)
    .put(usersHandler.handlePutRegister)
    .delete(usersHandler.handleDeleteRegister);

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
	.get(usersHandler.handleGetLogin)
	.post(usersHandler.handlePostLogin)
	.put(usersHandler.handlePutLogin)
	.delete(usersHandler.handleDeleteLogin);	

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
	.get(usersHandler.handleGetUsers)
	.post(usersHandler.handlePostUsers)
	.put(usersHandler.handlePutUsers)
	.delete(usersHandler.handleDeleteUsers);	

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
    .get(usersHandler.handleGetUserItem)
    .post(usersHandler.handlePostUserItem)
    .put(usersHandler.handlePutUserItem)
    .delete(usersHandler.handleDeleteUserItem);

/***************************************************************/
/*	  Colecção de álbuns		                               */
/*                                                             */
/*    URL:    /users/:userID/albums                            */
/*                                                             */
/*    GET     Retornar todos os álbuns                         */
/* 	  POST    Criar novo álbum                                 */
/*  					                                       */
/*	  Estado: Testado e funcional							   */
/***************************************************************/	

app.route("/users/:userID/albums")
	.get(albumsHandler.handleGetAlbums)
	.post(albumsHandler.handlePostAlbums)
	.put(albumsHandler.handlePutAlbums)
	.delete(albumsHandler.handleDeleteAlbums);	
	
/***************************************************************/
/*	  Álbuns individuais		                               */
/*                                                             */
/*    URL:    /users/:userID/albums/:albumID                   */
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

app.route("/users/:userID/albums/:albumID")
    .get(albumsHandler.handleGetAlbumItem)
    .post(albumsHandler.handlePostAlbumItem)
    .put(albumsHandler.handlePutAlbumItem)
    .delete(albumsHandler.handleDeleteAlbumItem);	

/***************************************************************/
/*	  Colecção de fotos			                               */
/*                                                             */
/*    URL:    /users/:userID/albums/:albumID/photos            */
/*                                                             */
/*    GET     Retornar todas as fotos de um álbum              */
/* 	  POST    Upload de uma fotografia                         */
/*  					                                       */
/*	  Estado: -												   */
/***************************************************************/

app.route("/users/:userID/albums/:albumID/photos")
	.get(photosHandler.handleGetPhotos)
	.post(photosHandler.handlePostPhotos)
	.put(photosHandler.handlePutPhotos)
	.delete(photosHandler.handleDeletePhotos);	

/***************************************************************/
/*    Fotos individuais                                        */
/*                                                             */
/*    URL:    /users/:userID/albums/:albumID/photos/:photoID   */
/*                                                             */
/*    GET     retornar foto especifica                         */
/*    POST    atualizar foto especifica                        */
/*    DELETE  apagar foto especifica                           */
/*                                                             */
/*    Estado: -                                                */
/***************************************************************/

app.param('photoID', function(req, res, next, photoID){
    req.photoID = photoID;
    return next()
})

app.route("/users/:userID/albums/:albumID/photos/:photoID")
    .get(photosHandler.handleGetPhotoItem)
    .post(photosHandler.handlePostPhotoItem)
    .put(photosHandler.handlePutPhotoItem)
    .delete(photosHandler.handleDeletePhotoItem); 

/***************************************************************/
/*    Colecção printAlbums                                     */
/*                                                             */
/*    URL:    /users/:userID/printAlbums                       */
/*                                                             */
/*    GET     Retornar todos os printAlbums                    */
/*    POST    Criar novo printAlbum                            */
/*                                                             */
/*    Estado: -                                                */
/***************************************************************/

app.route("/users/:userID/printAlbums")
    .get(printAlbumsHandler.handleGetPrintAlbums)
    .post(printAlbumsHandler.handlePostPrintAlbums)
    .put(printAlbumsHandler.handlePutPrintAlbums)
    .delete(printAlbumsHandler.handleDeletePrintAlbums);

/***************************************************************/
/*    PrintAlbums individuais                                  */
/*                                                             */
/*    URL:    /users/:userID/printAlbums/:printAlbumID         */
/*                                                             */
/*    GET     retornar printAlbums especifico                  */
/*    POST    atualizar printAlbums especifico                 */
/*    DELETE  apagar printAlbums especifico                    */
/*                                                             */
/*    Estado: -                                                */
/***************************************************************/

app.param('printAlbumID', function(req, res, next, printAlbumID){
    req.printAlbumID = printAlbumID;
    return next()
})

app.route("/users/:userID/printAlbums/:printAlbumID")
    .get(printAlbumsHandler.handleGetPrintAlbumItem)
    .post(printAlbumsHandler.handlePostPrintAlbumItem)
    .put(printAlbumsHandler.handlePutPrintAlbumItem)
    .delete(printAlbumsHandler.handleDeletePrintAlbumItem); 

/***************************************************************/
/*  Starting...                                                */
/***************************************************************/

app.listen(port, function(){
    console.log("Listening on " + port);
});