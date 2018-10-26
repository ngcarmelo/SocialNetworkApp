'use-strict'

// var path = require('path');
// var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res){
	return res.status(200).send({message: 'Hola mundo desde el controlador follows'});
}
// Guardar a quien sigue 
function saveFollow(req, res){
	//Postam:(post) Incluir en el headers la authorizacion: authorization : valor token
	//y el en el body --> followed : id_a_quien_seguimos 
	var params = req.body;
	
	var follow = new Follow();
	follow.user = req.user.sub;  //req.user es el objeto que viene del middleware de auth, con todas las propiedades del objeto --> authenticated.js
	follow.followed = params.followed; //Usuario seguido (a quien seguimos)

	follow.save((err, followStored) => {
		if(err) return res.status(500).send({message: 'Error al guardar el seguimiento'});
		if(!followStored) return res.status(404).send({message: 'El seguimiento no se ha guardado'});

		return res.status(200).send({follow: followStored});
	});

}

//Borrar a quien sigue

function deleteFollow(req, res){
	//Postman(delete), headers de authentificacion
	//en la url incluir el id a  quien queremos dejar de seguir
	var userId = req.user.sub; //recibimos que usuario somos, debido al middleware de auth
	var followId = req.params.id; //id a quien seguimos (url)

	Follow.find({'user':userId, 'followed': followId}).remove(err =>{
		if(err) return res.status(500).send({message: 'Error al dejar de seguir'});

		return res.status(200).send({message: 'El follow se ha eliminado!!'});
	});
}
	//Listado de usuarios a quien sigo
function getFollowingUsers(req, res){
	//Postman:(get), incluir en el headers el authorization : valor token
	//opcional: el id del usuario con el que estamos logeados y el parametro de la pagina
	//http://localhost:3801/api/following/5ba3597d3f9e23248893fda8/1
	//http://localhost:3801/api/following/5ba3597d3f9e23248893fda8
	//http://localhost:3801/api/following/

	var userId = req.user.sub; //objeto que viene del middleware auth
	
	
	if(req.params.id && req.params.page){
		userId = req.params.id;
	
	}

	var page = 1;

	if(req.params.page){
		page = req.params.page;
		}else {
			page = req.params.id;
		}

	var itemsPerPage = 4;
	//con .populate() el campo followed en vez de mostrar el id, muestra todos los campos del objeto
	Follow.find({'user' :userId}).populate({path:'followed'}).paginate(page, itemsPerPage, (err, follows, total)=>{
		if(err) return res.status(500).send({message: 'Error en el servidor'});
		if(!follows) return res.status(404).send({message: 'No estas siguiendo a ningun usuario'});
		
		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			follows
		});
	});
}

//Listar los usuarios que nos  siguen
function getFollowedUsers(req, res){
	//recogemos el valor del Id del usuario identificado:
	var userId = req.user.sub; //objeto que viene del middleware auth
		
	if(req.params.id && req.params.page){
		userId = req.params.id;
	
	}

	var page = 1;

	if(req.params.page){
		page = req.params.page;
		}else {
			page = req.params.id;
		}

	var itemsPerPage = 4;
	//con .populate() el campo user y followed(al final solo hemos dejado user en el populate)
	// en vez de mostrar el id, muestra todos los campos del objeto
	Follow.find({'followed' :userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total)=>{
		if(err) return res.status(500).send({message: 'Error en el servidor'});
		if(!follows) return res.status(404).send({message: 'No te sigue ningun usuario'});
		
		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			follows
		});
	});

}



//Listado sin paginar de usuarios
//Segun si recibo parametro o no follweb por la url me listará una cosa u otra:
//A los que sigo o los que me siguen
function getMyFollows(req, res){
	var userId = req.user.sub;

	var find = Follow.find({user: userId}); //usuarios que yo sigo

	if(req.params.followed){
		find = Follow.find({followed: userId}); //usuarios que me estan siguiendo
	}

	find.populate('user followed').exec((err, follows) =>{
		if(err) return res.status(500).send({message: 'Error en el servidor'});
		if(!follows) return res.status(404).send({message: 'No  sigues  ningun usuario'});
		
		return res.status(200).send({follows});
	});

}
//Listado sin paginar de los usuarios que me siguen


module.exports = {
	prueba,
	saveFollow,
	deleteFollow,
	getFollowingUsers,
	getFollowedUsers,
	getMyFollows
}