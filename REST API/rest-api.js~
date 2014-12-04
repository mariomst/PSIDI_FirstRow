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

/***************************************************************/
/*  Data                                                       */
/***************************************************************/

const port = process.env.PORT || 2001;
const server_root = "http://localhost:" + port;

// Data Store

var users = {};
var albuns = {};

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

function createAlbum(newID, title, user, description, start_date, end_date){}

function uploadPhoto(albumID, photo, description, date){}

function albumsforprinting_pdf(){}

/***************************************************************/
/*  Handling Collection User                                   */
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
            console.log("-->" + req.body.user);
            console.log("-->" + req.body.pass);
            
            users[newID] = createUser(newID, req.body.user, req.body.pass);
            
            //send 202 Accepted and Location
            res.status(202).set('Location', server_root + "/user/" + newID).send(users[newID]);
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
/*  POST    update existing user                               */
/*  PUT     overwrite existing / create new                    */
/*  DELETE  delete user                                        */
/***************************************************************/
    
app.param('userID', function(req, res, next, userID){
    req.userID = userID;
    return next()
})

/***************************************************************/
/*  Starting...                                                */
/***************************************************************/

app.listen(port, function(){
    console.log("Listening on " + port);
});