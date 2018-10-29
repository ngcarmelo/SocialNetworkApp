'use strict'
var express = require ('express');
var PublicationController = require('../controllers/publication');

//para tener acceso a los metodos: get,put....
var api = express.Router();
//cargamos el midleware de autentificacion
var md_auth = require('../midlewares/authenticated');

//para subir archivos: haremos un midleware para la subida de archivos
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/publications'}); //hay que crear estas carpetas

api.get('/probando-pub', md_auth.ensureAuth, PublicationController.probando);
api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
api.get('/publications-user/:page?', md_auth.ensureAuth, PublicationController.getPublicationsUser);
api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
api.delete('/publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);

api.post('/upload-image-pub/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);

module.exports = api;