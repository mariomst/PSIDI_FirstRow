/***************************************************************/
/*  Tests			                                           */
/***************************************************************/

function testes(){
    
    var userIDTeste = "u" + (Math.random()*1000).toString().substr(1,4);
    var userTeste = "mario1";
    var passTeste = "teste123";        
    
    console.log("\nTeste #1 -> Criar um novo utilizador:");    
    createUser(userIDTeste,userTeste,passTeste,function(res){});
    
    setTimeout(function () {
        console.log("\nTeste #2 -> Mostrar todos os utilizadores:");    
        showAllUsers(function(res){});
    }, 1500);
    
    findUser(userTeste, function(user){
        setTimeout(function () {
            console.log("\nTeste #3 -> Procurar um utilizador especifico:");
            if(user == ""){
                console.log("Info: Utilizador " + userTeste + " não foi encontrado.");
            } else {
                console.log("Info: Utilizador " + userTeste + " encontrado");
            }
        }, 2000);
    });
    
    login(userTeste, passTeste, function(result){
        setTimeout(function () {
            console.log("\nTeste #4 -> Realizar login:");
            
            if(result == "true"){
                console.log("Info: Utilizador autenticado.");
            } else {
                console.log("Info: Autenticação falhou.");
            }
        }, 2500);
    });
    
    var albumID = "a" + (Math.random()*1000).toString().substr(1,4);
    var title = "Album Teste";
    var userID = "u00.7";
    var description = "Album criado para testar as funcoes";
    var start_date = "01-01-2000";
    var end_date = "01-12-2000";
    
    var albuns = [];
    
    setTimeout(function(){
    	console.log("\nTeste #5 -> Criar um novo album");
    	createAlbum(albumID, title, userID, description, start_date, end_date)
    }, 3500);
    
    getUserAlbuns(userID, function(result){
    	setTimeout(function(){
    		console.log("\nTeste #6 -> Obter albuns de um utilizador");
    		
    		if(result.length > 0){
    			for(var i = 0; i < result.length; i++){
    				console.log("AlbumID: " + result[i]);
    				albuns.push(result[i]);
    			}
    		} else {
    			console.log("Info: O utilizador com id " + userID + " não tem albuns.");
    		}
    	}, 4500);   
    });    
    
    setTimeout(function(){
    	console.log("\nTeste #7 -> Apresentar informacoes de cada album");
    	if(albuns.length > 0){
    		for(var i = 0; i < albuns.length; i++){
    			getAlbum(albuns[i], function(result2){
    				setTimeout(function(){
    					console.log("Album:");
    					console.log("AlbumID: " + result2[0]);
    					console.log("Title: " + result2[1]);
    					console.log("UserID: " + result2[2]);
    					console.log("Description: " + result2[3]);
    					console.log("Start Date: " + result2[4]);
    					console.log("End Date: " + result2[5] + "\n");    					
    				}, 5000)
    			})
    		}
    	}
    }, 5500);
}


/***************************************************************/
/*  Testes dos métodos pela consola...                         */
/***************************************************************/

//testes();