/***************************************************************/
/*                                                             */
/*  Trabalho Prático                                           */
/*  Node module to handle print albums resource                */
/*  PSIDI / MEI / ISEP                                         */
/*  (c) 2014                                                   */
/*                                                             */
/***************************************************************/

/***************************************************************/
/*  Necessary Modules                                          */
/***************************************************************/

var sqlite3 = require('sqlite3').verbose();

/***************************************************************/
/*  Database                                                   */
/***************************************************************/

var file = "./database/myphotoalbum.db";

/***************************************************************/
/*  Helper Functions                                           */
/***************************************************************/

function createPrintAlbum(){}

function getPrintAlbums(){}

function getPrintAlbumsByUserID(){}

function getSpecificPrintAlbum(){}
 
function updatePrintAlbum(){}

function deletePrintAlbum(){}

/***************************************************************/
/*  Module Exports		                                       */
/***************************************************************/

exports.createPrintAlbum = createPrintAlbum;
exports.getPrintAlbums = getPrintAlbums;
exports.getPrintAlbumsByUserID = getPrintAlbumsByUserID
exports.getPrintAlbumByUserID = getPrintAlbumByUserID;
exports.updatePrintAlbum = updatePrintAlbum;
exports.deletePrintAlbum = deletePrintAlbum;
