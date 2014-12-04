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

function uploadPhoto(albumID, photo, description, date){}

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
    return next();
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
        res.status(201).set('Location', server_root + "/user/" + req.body.userID + "/album/" + newID).send(albuns[newID]);
        console.log("-> Accepted POST to new resource " + server_root + "/user/" + req.body.userID + "/album/" + newID);  
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

//ainda não implementado

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

//ainda não implementado

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

//ainda não implementado

/***************************************************************/
/*  Starting...                                                */
/***************************************************************/

app.listen(port, function(){
    console.log("Listening on " + port);
});