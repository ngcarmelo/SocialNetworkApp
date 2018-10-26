'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; // nos permitirá definir nuevos esquemas

var UserSchema = Schema({
		name: String,
		surname: String,
		nick: String,
		email: String,
		password: String,
		role: String,
		image: String
});


module.exports = mongoose.model('User', UserSchema); //Nombre de la entidad y su esquema
//al crearse en la BD de datos se pluralizará y uppercase de forma automatica: User --> users