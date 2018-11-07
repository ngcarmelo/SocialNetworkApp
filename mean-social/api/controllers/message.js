'use-strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');


function probando(req, res){
		res.status(200).send({message: 'Hola soy un mensaje privado -prueba'});

	
}
// enviar mensajes
function saveMessage(req, res){
	//Postman: post, en el headers el token --> authorization : valor_token
	// en el body campos "text" --> el mensaje y "receiver" --> id del receptor del mensaje


	var params = req.body;

	if(!params.text || !params.receiver) return res.status(200).send({message: 'Envia los datos necesarios'});
	
	var message = new Message();
	message.emitter = req.user.sub; //nosotros
	message.receiver = params.receiver;
	message.text = params.text;
	message.created_at = moment().unix();
	message.viewed = 'false'; //propiedad para saver si se ha leido el mensaje

	message.save((err, messageStored) =>{

	if(err) return res.status(500).send({message: 'Error en la peticion'});
	if(!messageStored) return res.status(500).send({message: 'Error al enviar el Mensaje'});

	return res.status(200).send({message: messageStored});


	});

}
	//Mensajes recibidos listado
	function getReceivedMessages(req, res){
		//Postam --> get, en el headers campo: authorization : valor_token
		//El usuario logeado debe tener mensajes, para visualizarlos


		var userId = req.user.sub; //usuario logeado

		var page = 1;
		if(req.params.page){
			page = req.params.page;
		}

		var itemsPerPage = 4;
		//Busca  mensajes que hemos recibido, con nuestro Id
		//Message.find({receiver: userId}).populate('emitter').paginate(page, itemsPerPage,(err, messages, total)=>{
		//Con el segundo parametro del populate, podemos elegir los campos a mostrar, para que no salgan todos
		Message.find({receiver: userId}).populate('emitter', 'name surname image nick _id').sort('create_at').paginate(page, itemsPerPage,(err, messages, total)=>{
			if(err) return res.status(500).send({message: 'Error en la peticion'});
			if(!messages) return res.status(404).send({message: 'No hay mensajes'});

			return res.status(200).send({
				total: total, //total de elementos
				pages: Math.ceil(total/itemsPerPage),
				messages

			});

		});

	}


//Mensajes Enviados listado
	function getEmmitMessages(req, res){
		//Postam --> get, en el headers campo: authorization : valor_token
		//El usuario logeado debe haber enviado mensajes, para visualizarlos


		var userId = req.user.sub; //usuario logeado

		var page = 1;
		if(req.params.page){
			page = req.params.page;
		}

		var itemsPerPage = 4;
		//Busca  mensajes que hemos enviado, con nuestro Id
		//Con el segundo parametro del populate, podemos elegir los campos a mostrar, para que no salgan todos
		Message.find({emitter: userId}).populate('emitter receiver', 'name surname image nick _id').sort('create_at').paginate(page, itemsPerPage,(err, messages, total)=>{
			if(err) return res.status(500).send({message: 'Error en la peticion'});
			if(!messages) return res.status(404).send({message: 'No hay mensajes'});

			return res.status(200).send({
				total: total, //total de elementos
				pages: Math.ceil(total/itemsPerPage),
				messages

			});

		});

	}


	function getUnviewedMessages(req, res){
		var userId = req.user.sub;
		//Queremos contar mensajes sin leer
		Message.count({receiver: userId, viewed: 'false'}).exec((err, count) =>{
			if(err) return res.status(500).send({message: 'Error en la peticion'});
			return res.status(200).send({
				'unviewed': count
			});

		});

	}
	//Nos modifica todos los mensajes a leidos
	function setViewedMessages(req, res){
		var userId = req.user.sub;
		//1º parametros: Buscamos los objetos con viewed false 
		//2º parametro: cambiamos propiedad viewed a true
		//3º parametros: con multi:true , actualizamos todos los documentos, sin el solo actualizaría uno
		//4º parametro el callback
		Message.update({receiver: userId, viewed: 'false'}, {viewed:'true'}, {"multi": true}, (err, messagesUpdated)=>{
			if(err) return res.status(500).send({message: 'Error en la peticion'});
			return res.status(200).send({
				messages: messagesUpdated
			});


		});
	}





module.exports = {

	probando,
	saveMessage,
	getReceivedMessages,
	getEmmitMessages,
	getUnviewedMessages,
	setViewedMessages
}