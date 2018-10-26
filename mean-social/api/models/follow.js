'use strict'


var mongoose = require('mongoose');
var Schema = mongoose.Schema; // nos permitirá definir nuevos esquemas

var FollowSchema = Schema({
	user: { type: Schema.ObjectId, ref: 'User'},  //el usuario que sigue
	followed: { type: Schema.ObjectId, ref: 'User'} //el usuario seguido
});

module.exports = mongoose.model('Follow', FollowSchema); //Nombre de la entidad y su esquema
