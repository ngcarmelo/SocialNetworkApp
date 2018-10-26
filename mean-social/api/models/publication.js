'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; // nos permitirá definir nuevos esquemas

var PublicationSchema = Schema({
		text: String,
		file: String,
		created_at: String,
		user: { type: Schema.ObjectId, ref: 'User'} 
		//propiedad de tipo ObjectId y haciendo referencia al modelo 'User'
				
});

module.exports = mongoose.model('Publication', PublicationSchema);
//al crearse en la BD de datos se pluralizará y uppercase de forma automatica: Publication --> publications