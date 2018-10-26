'use strict'

var express = require ('express');
var UserController = require('../controllers/user');

//para tener acceso a los metodos: get,put....
var api = express.Router();
//cargamos el midleware de autentificacion
var md_auth = require('../midlewares/authenticated');

//para subir archivos: haremos un midleware para la subida de archivos
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'}); //hay que crear estas carpetas


api.get('/home', UserController.home);

//Ruta con middleware de autentificacion: el ensureAuth es el metodo de la libreria de Auth
//al hacer la peticion en postman hay que incluir en el headers: authorization --> valor del token

api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);



//para pasar dos midlewares utilizaremos un array:
api.post('/update-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

//api.get('/get-image-user/:imageFile', md_auth.ensureAuth, UserController.getImageFile);
api.get('/get-image-user/:imageFile', UserController.getImageFile);



module.exports = api;