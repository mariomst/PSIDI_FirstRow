/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
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

// Data Store

var users = {};
var albuns = {};
var photos = {};

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function createUser(newID, user, password){
    return {
        id: newID,
        user: user,
        password: password,
    };
}

function createAlbum(newID, title, userID, description, start_date, end_date){
    return {
        id: newID,
        title: title,
        description: description,
        startDate: start_date,
        endDate: end_date,
        owner: userID, 
    };
}

function uploadPhoto(newID, albumID, photo, description, date){}

function albumsforprinting_pdf(){}

/***************************************************************/
/*  Handling Collection Users                                  */
/*                                                             */
/*  URL:    /user                                              */
/*                                                             */
/*  GET     return all users                                   */
/*  POST    create new entry                                   */
/*  PUT     not allowed                                        */
/*  DELETE  not allowed                                        */
/***************************************************************/

app.route("/user")
    .get(function(req, res){
        res.json(users);
    })
    .post(function(req, res){
            //generate random ID
            const newID = "u" + (Math.random()*1000).toString().substr(1,4);            
            users[newID] = createUser(newID, req.body.user, req.body.pass);            
            //send 202 Accepted and Location
            res.status(201).set('Location', server_root + "/user/" + newID).send(users[newID]);
            console.log("-> Accepted POST to new resource " + server_root + "/user/" + newID);        
    })
    .put(function(req, res){
        res.status(405).send("Cannot overwrite the entire collection.");
    })
    .delete(function(req, res){
        res.status(405).send("Cannot delete the entire collection.");
    });
    
/***************************************************************/
/*  Handling invidual itens                                    */
/*                                                             */
/*  URL:    /user/:id                                          */
/*                                                             */
/*  GET     return specific user                               */
/*  POST    update password of existing user                   */
/*  PUT     overwrite existing / create new                    */
/*  DELETE  delete user                                        */
/***************************************************************/
    
app.param('userID', function(req, res, next, userID){
    req.userID = userID;
    return next()
})

app.route("/user/:userID")
    .get(function(req, res){
        var entry = users[req.userID];
        console.log("-> Requested user: " + req.userID);
        if(entry === undefined){
            res.status(404).send("User " + req.userID + " not found.");
        } else {
            res.json(entry);
        }        
    })
    .post(function(req, res){
        var entry = users[req.userID];
        if(entry === undefined){
            res.status(404).send("User " + req.userID + " not found.");
        } else {
            entry.password = req.body.pass;
            res.json(entry);
        }
    })
    .put(function(req, res){
        var entry = users[req.userID];
        if(entry === undefined){
            entry = createUser(req.userID, req.body.user, req.body.pass);
            users[req.userID] = entry;
            res.stats(201).set('Location', server_root + "/user/" + req.userID).json(entry);
        } else {
            entry.user = req.body.user;
            entry.password = req.body.pass;            
            res.json(entry);
        }
    })
    .delete(function(req, res) {
		var entry = users[req.userID];
		if (entry === undefined) {
			res.status(404).send("User " + req.userID + " not found.");
		}
		else {
			delete users[req.userID];
			res.status(204).send("User " + req.userID + " deleted.");
		}
	});	
	
/***************************************************************/
/*  Handling Collection Albuns                                 */
/*                                                             */
/*  URL:    /user/:userID/album                                */
/*                                                             */
/*  GET     return all albums                                  */
/*  POST    create new album                                   */
/*  PUT     not allowed                                        */
/*  DELETE  not allowed                                        */
/***************************************************************/	

app.route("user/:userID/album")
    .get(function(req, res){
        var entry = users[req.userID];
        console.log("-> Requested user: " + req.userID);
        if(entry === undefined){
            res.status(404).send("User " + req.userID + " not found.");
        } else {
            var userAlbuns = {};
            for(var a in albuns){
                if(albuns[a].owner === req.userID){
                    userAlbuns[a] = albuns[a];
                }
            }
            res.json(userAlbuns);
        }        
    })
    .post(function(req, res){
        //generate random ID
        const newID = "a" + (Math.random()*1000).toString().substr(1,4);   
        //create new album       
        albuns[newID] = createAlbum(newID, req.body.title, req.body.userID, req.body.description, req.body.start_date, req.body.end_date);            
        //send 202 Accepted and Location
        res.status(201).set('Location', server_root + "/user/" + req.userID + "/album/" + newID).send(albuns[newID]);
        console.log("-> Accepted POST to new resource " + server_root + "/user/" + req.userID + "/album/" + newID);  
    })
    .put(function(req, res){
        res.status(405).send("Cannot overwrite the entire collection.");
    })
    .delete(function(req, res){
        res.status(405).send("Cannot delete the entire collection.");
    });
    
/***************************************************************/
/*  Handling invidual itens                                    */
/*                                                             */
/*  URL:    /user/:userID/album/:albumID                       */
/*                                                             */
/*  GET     return specific album                              */
/*  POST    update album                                       */
/*  PUT     overwrite existing / create new                    */
/*  DELETE  delete album                                       */
/***************************************************************/

app.param('albumID', function(req, res, next, albumID){
    req.albumID = albumID;
    return next();
})

app.route("user/:userID/album/:albumID")
    .get(function(req, res){
        var entry = albuns[req.albumID];
        console.log("-> Requested album: " + req.albumID);
        if(entry === undefined){
            res.status(404).send("Album " + req.albumID + " not found.");
        } else {
            res.json(entry);
        }
    })
    .post(function(req, res){
        var entry = albuns[req.albumID];
        if(entry === undefined){
            res.status(404).send("Album " + req.albumID + " not found.");
        } else {
            entry.title = req.body.title;
            entry.description = req.body.description;
            entry.startDate = req.body.start_date;
            entry.endDate = req.body.end_date;
            res.json(entry);
        }
    })
    .put(function(req, res){
        var entry = albuns[req.albumID];
        if(entry === undefined){
            entry = createAlbum(req.body.albumID, req.body.title, req.body.userID, req.body.description, req.body.start_date, req.body.end_date);
            albuns[req.albumID] = entry;
            res.stats(201).set('Location', server_root + "/user/" + req.albumID).json(entry);
        } else {
            entry.title = req.body.title;
            entry.description = req.body.description;
            entry.startDate = req.body.start_date;
            entry.endDate = req.body.end_date;          
            res.json(entry);
        }
    })
    .delete(function(req, res) {
		var entry = albuns[req.albumID];
		if (entry === undefined) {
			res.status(404).send("Album " + req.albumID + " not found.");
		}
		else {
			delete albuns[req.albumID];
			res.status(204).send("Album " + req.albumID + " deleted.");
		}
	});	

/***************************************************************/
/*  Handling Collection Photos                                 */
/*                                                             */
/*  URL:    /user/:userID/album/:albumID/photo                 */
/*                                                             */
/*  GET     return all photos                                  */
/*  POST    upload new photo                                   */
/*  PUT     not allowed                                        */
/*  DELETE  not allowed                                        */
/***************************************************************/

app.route("user/:userID/album/:albumID/photo")
    .get(function(req, res){
        var entry = photos[req.albumID];
        console.log("-> Requested album: " + req.albumID);
        if(entry === undefined){
            res.status(404).send("Album " + req.albumID + " not found.");
        } else {
            var albumPhotos = {};
            for(var p in photos){
                if(photos[p].albumID === req.albumID){
                    albumPhotos[p] = photos[p];
                }
            }
            res.json(albumPhotos);
        }        
    })
    .post(function(req, res){
        //generate random ID
        const newID = "p" + (Math.random()*1000).toString().substr(1,4);   
        //upload new photo       
        //instruções de upload no metódo uploadPhoto. Verificar isto depois.
        photos[newID] = uploadPhoto(newID, req.body.albumID, req.body.photo, req.body.description, req.body.date);            
        //send 202 Accepted and Location
        res.status(201).set('Location', server_root + "/user/" + req.userID + "/album/" + req.albumID + "/photo/" + newID).send(photos[newID]);
        console.log("-> Accepted POST to new resource " + server_root + "/user/" + req.userID + "/album/" + req.albumID + "/photo/" + newID);  
    })
    .put(function(req, res){
        res.status(405).send("Cannot overwrite the entire collection.");
    })
    .delete(function(req, res){
        res.status(405).send("Cannot delete the entire collection.");
    });

/***************************************************************/
/*  Handling invidual itens                                    */
/*                                                             */
/*  URL:    /user/:userID/album/:albumID/photo/:idPhoto        */
/*                                                             */
/*  GET     return specific photo                              */
/*  POST    update photo                                       */
/*  PUT     overwrite existing / create new                    */
/*  DELETE  delete photo                                       */
/***************************************************************/

//uploadPhoto(albumID, photo, description, date)

app.param('photoID', function(req, res, next, albumID){
    req.photoID = photoID;
    return next();
})

app.route("user/:userID/album/:albumID/photo/:photoID")
    .get(function(req, res){
        var entry = photos[req.photoID];
        console.log("-> Requested photo: " + req.photoID);
        if(entry === undefined){
            res.status(404).send("Photo: " + req.photoID + " not found.");
        } else {
            res.json(entry);
        }
    })
    .post(function(req, res){
        var entry = photos[req.photoID];
        if(entry === undefined){
            res.status(404).send("Photo: " + req.photoID + " not found.");
        } else {
            //chamada da instrução de upload de photos
            uploadPhoto(req.photoID, req.body.albumID, req.body.photo, req.body.description, req.body.date);
            res.json(entry);
        }
    })
    .put(function(req, res){
        var entry = photos[req.photoID];
        if(entry === undefined){
            entry = uploadPhoto(req.body.photoID, req.body.albumID, req.body.photo, req.body.description, req.body.date);
            photos[req.photoID] = entry;
            res.stats(201).set('Location', server_root + "/user/" + req.albumID).json(entry);
        } else {
            //chamada da instrução de upload de photos
            uploadPhoto(req.photoID, req.body.albumID, req.body.photo, req.body.description, req.body.date);          
            res.json(entry);
        }
    })
    .delete(function(req, res) {
		var entry = photos[req.photoID];
		if (entry === undefined) {
			res.status(404).send("Photo: " + req.photoID + " not found.");
		}
		else {
			delete photos[req.photoID];
			res.status(204).send("Photo: " + req.photoID + " deleted.");
		}
	});	

/***************************************************************/
/*  Starting...                                                */
/***************************************************************/

app.listen(port, function(){
    console.log("Listening on " + port);
});