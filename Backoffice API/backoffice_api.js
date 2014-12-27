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
        db.run("CREATE TABLE USERS (userID, user, password TEXT)");
        db.run("CREATE TABLE ALBUNS (albumID, title, userID, description, start_date, end_date TEXT)");
        //falta: tabela de fotos
    }   
});

db.close();

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function createUser(newID, user, password){

    var db = new sqlite3.Database(file);    
    
    findUser(user, function(res){
        if(res == ""){
            //Criar novo utilizador
            db.serialize(function(){
                console.log("Creating user with the following informations:");
                console.log("userID: " + newID);
                console.log("user: " + user);
                console.log("password: " + password);
                db.run("INSERT INTO USERS (userID, user, password) VALUES (?,?,?)", newID, user, password);
                console.log("\n-> User created");
            });
        } else {
            console.log("\nError: User already exists.");
        }
    });
                    
    db.close();
}

function findUser(usr,res){

    var db = new sqlite3.Database(file);

    var userRes = "";
    var passwordRes = "";
    
    db.each("SELECT * FROM USERS WHERE user=\""+usr+"\"", function(err, row) {
        if (err) {
            throw err;
        }
        
        if(row != null)
        {
            userRes = row.user;
            res(userRes);
        }         
    });
    
    if(res.userRes == undefined){
        userRes = "";
        res(userRes);
    }

    db.close();
}

function showAllUsers(){
    var db = new sqlite3.Database(file);

    db.each("SELECT * FROM USERS", function(err, row){
        if (err) {
            throw err;
        }
        
        if(row != null)
        {
            console.log("ID: " + row.userID + "; User: " + row.user + "; Password: " + row.password);
        }      
    });
}

function testes(){
    
    var userIDTeste = "u3";
    var userTeste = "cat2";
    var passTeste = "cat123";
    
    console.log("\nTeste: Criar um novo utilizador:");
    
    createUser(userIDTeste,userTeste,passTeste);     
    
    console.log("\nTeste: Mostrar todos os utilizadores:");
    
    showAllUsers();
    
    console.log("\nTeste: Procurar um utilizador especifico:");
       
    findUser(userTeste, function(user){
        if(user == ""){
            console.log("User: " + userTeste + " was not found");
        } else {
            console.log("User: " + userTeste + " was found");
        }
    });
}

/***************************************************************/
/*    Registo de novos utilizadores.                           */
/*                                                             */
/*    URL:    /signup                                          */
/*                                                             */
/*    POST    Registar utilizador                              */
/***************************************************************/

app.route("/signup")
    .get(function(req,res){
        res.status(405).send("Not allowed.");
    })
    .post(function(req,res){
        //gerar ID aleatório
        const newID = "u" + (Math.random()*1000).toString().substr(1,4);
        createUser(newID, req.body.user, req.body.pass);
        //falta retornar código caso já exista.
        res.status(201).set('User created');
    })
    .put(function(req,res){
        res.status(405).send("Not allowed.");
    })
    .delete(function(req,res){
        res.status(405).send("Not allowed.");
    });

/***************************************************************/
/*  Starting...                                                */
/***************************************************************/

app.listen(port, function(){
    console.log("Listening on " + port);
});

/***************************************************************/
/*  Testes dos métodos pela consola...                         */
/***************************************************************/

testes();
