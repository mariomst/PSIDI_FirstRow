INSERT INTO USERS (user, password) VALUES ("Mario","Teste123");
INSERT INTO USERS (user, password) VALUES ("Ruben","Teste123");
INSERT INTO USERS (user, password) VALUES ("Filipe","Teste123");

INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES ("M1",1,"Album do Mario",1443654000000,1443654000000);
INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES ("M2",1,"Album do Mario",1443654000000,1443654000000);
INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES ("M3",1,"Album do Mario",1443654000000,1443654000000);

INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES ("R1",2,"Album do Ruben",1443654000000,1443654000000);
INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES ("R2",2,"Album do Ruben",1443654000000,1443654000000);
INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES ("R3",2,"Album do Ruben",1443654000000,1443654000000);

INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES ("F1",3,"Album do Filipe",1443654000000,1443654000000);
INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES ("F2",3,"Album do Filipe",1443654000000,1443654000000);
INSERT INTO ALBUMS (title, userID, description, start_date, end_date) VALUES ("F3",3,"Album do Filipe",1443654000000,1443654000000);

INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (1,"./photos/tests/imagem1.png","Foto1 - Mario","10/01/2015");
INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (2,"./photos/tests/imagem2.png","Foto2 - Mario","10/01/2015");
INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (3,"./photos/tests/imagem3.png","Foto3 - Mario","10/01/2015");

INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (4,"./photos/tests/imagem4.png","Foto1 - Ruben","10/01/2015");
INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (5,"./photos/tests/imagem5.png","Foto2 - Ruben","10/01/2015");
INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (6,"./photos/tests/imagem6.png","Foto3 - Ruben","10/01/2015");

INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (7,"./photos/tests/imagem7.png","Foto1 - Ruben","10/01/2015");
INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (8,"./photos/tests/imagem8.png","Foto2 - Ruben","10/01/2015");
INSERT INTO PHOTOS (albumID, photo, description, date) VALUES (9,"./photos/tests/imagem9.png","Foto3 - Ruben","10/01/2015");

INSERT INTO PRINTALBUMS (userID, theme, title, message) VALUES (1,"Tema1","Titulo1","Algo algo algo");
INSERT INTO PRINTALBUMS (userID, theme, title, message) VALUES (1,"Tema2","Titulo2","Algo algo algo");

INSERT INTO PRINTALBUMS (userID, theme, title, message) VALUES (2,"Tema3","Titulo3","Algo algo algo");
INSERT INTO PRINTALBUMS (userID, theme, title, message) VALUES (2,"Tema4","Titulo4","Algo algo algo");

INSERT INTO PRINTALBUMS (userID, theme, title, message) VALUES (3,"Tema5","Titulo5","Algo algo algo");
INSERT INTO PRINTALBUMS (userID, theme, title, message) VALUES (3,"Tema6","Titulo6","Algo algo algo");

INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (1,1);
INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (2,1);
INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (3,2);

INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (4,3);
INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (5,3);
INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (6,4);

INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (7,5);
INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (8,6);
INSERT INTO PRINTPHOTOS (photoID, printAlbumID) VALUES (9,6);