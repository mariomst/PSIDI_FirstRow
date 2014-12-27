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
    //função para criar um novo utilizador na db.
    var query = "INSERT INTO USERS (userID, user, password) VALUES (?,?,?)"; 
    
    findUser(user, function(res){
        //timeout necessário para dar tempo a db responder à query.
        setTimeout(function () {
            if(res === 0){
                var db = new sqlite3.Database(file);  
                //Criar novo utilizador
                db.serialize(function(){
                    console.log("Info: A criar utilizador com as seguintes informações");
                    console.log("-> userID: " + newID);
                    console.log("-> user: " + user);
                    console.log("-> password: " + password);
                    
                    db.run(query, newID, user, password);
                    
                    console.log("Info: Utilizador criado.");
                });
                db.close();
            } else {
                console.log("Erro: Utilizador já existe.");             
            }                        
        }, 1000);
    }); 
}

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
        
        if(row.user === usr)
        {
            flag = 1;
            res(flag);                    
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
    }, 1000);
}

function showAllUsers(){
    var db = new sqlite3.Database(file);
    var query = "SELECT * FROM USERS";

    db.each(query, function(err, row){
        if (err) {
            throw err;
        }
        
        if(row != null)
        {
            console.log("ID: " + row.userID + "; Utilizador: " + row.user + "; Password: " + row.password);
        }      
    });
}

function testes(){
    
    var userIDTeste = "u" + (Math.random()*1000).toString().substr(1,4);
    var userTeste = "mario";
    var passTeste = "teste123";    
    
    console.log("\nTeste -> Criar um novo utilizador:");    
    createUser(userIDTeste,userTeste,passTeste);
    
    setTimeout(function () {
        console.log("\nTeste -> Mostrar todos os utilizadores:");    
        showAllUsers();
    }, 1500);
    
    findUser(userTeste, function(user){
        setTimeout(function () {
            console.log("\nTeste -> Procurar um utilizador especifico:");
            if(user == ""){
                console.log("Info: Utilizador " + userTeste + " não foi encontrado.");
            } else {
                console.log("Info: Utilizador " + userTeste + " encontrado");
            }
        }, 2000);
    });
    
    login(userTeste, passTeste, function(result){
        setTimeout(function () {
            console.log("\nTeste -> Realizar login:");
            
            if(result == "true"){
                console.log("Info: Utilizador autenticado.");
            } else {
                console.log("Info: Autenticação falhou.");
            }
        }, 2500);
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

/*app.listen(port, function(){
    console.log("Listening on " + port);
});*/

/***************************************************************/
/*  Testes dos métodos pela consola...                         */
/***************************************************************/

testes();