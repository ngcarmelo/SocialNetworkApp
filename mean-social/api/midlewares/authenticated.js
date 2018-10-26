'use strict'

//con este metodo del midleware,  se ejecuta primero y comprueba si en el headers
//esta la variable authorization y el valor del token,-->  authorization : valor token
//si está, se sale y se ejecuta el metodo de la ruta donde pusimos el middleware

var jwt = require('jwt-simple');
var moment = moment = require('moment');
var secret = 'clave_secreta_curso_desarrollar_red_social_angular';

//cuando ejecuta next, salimos del middleware
exports.ensureAuth = function(req, res, next){
	//el token nos llegara por el header
	if(!req.headers.authorization){
		return res.status(403).send({ message: 'La peticion no tiene la cabecera de autentificacion'});
	}
	// para eliminar las comillas dobles o simples del token:
	var token = req.headers.authorization.replace(/['"]+/g, '');
	try{
			var payload = jwt.decode(token, secret);
			if(payload.exp <= moment().unix()){
				return res.status(401).send({ message: 'El token ha expirado'});
			}
	}catch(ex){
			return res.status(404).send({ message: 'El token no es valido'});
	}
	
	// ** objeto del usuario registrado: //es el token decodificado y entendible
	//al usar este middleware nos devolvera en la request: req.user y lo podemos obtener directamente en los controladores
	req.user = payload;
	
	//salimos y ejecutamos  el controlador respectivo
	next();

}