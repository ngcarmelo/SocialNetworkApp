'use strict'
//Librerias
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
//Modelos
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');


function probando(req, res){
	res.status(200).send({message: 'Hola desde el controlador de publicaciones'});

}

function savePublication(req, res){
	//Postman: post, recordar de añadir en el headers el token de auth: --> authentication : valor_token
	//En el body incluir campo text, que es el unico campo obligatorio
	var params = req.body;

	

	if(!params.text) return res.status(200).send({message: 'Debes enviar un texto'});

	var publication = new Publication();
	publication.text = params.text;
	publication.file ='null';
	publication.user = req.user.sub;
	publication.created_at = moment().unix();

	publication.save((err,publicationStored)=>{
		if(err) return res.status(500).send({message: 'Error al guardar la publicacion'});
		if(!publicationStored) return res.status(404).send({message: 'La publicacion NO ha sido guardada'});

		return res.status(200).send({publication: publicationStored});
	});
}
	
	function getPublications (req, res){
		//Nos muestra publicaciones de los usuarios que nos siguen
		var page = 1;
		//si hay parametro pagina por la url
		if(req.params.page){
			page = req.params.page;
		}

		var itemsPerpage = 4;
		//find de de todos los usuarios que seguimos(todos los follows) y populamos el campo followed
		Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) =>{
			if(err) return res.status(500).send({message: 'Error al devolver el seguimiento'});

			var follows_clean =[];

			//Recorremos los objetos follows que nos ha devuelto el "find" anterior
			//Y vamos añadiendo al array: "follows_clean" el campo "followed"
			//O sea 2º metemos a todos los usuarios que nos siguen en el array limpio
			follows.forEach((follow) =>{
				follows_clean.push(follow.followed);
			});

			follows_clean.push(req.user.sub); //añadimos nuestro propio usuario y asi podremos ver nuestras propias publicaciones
			//console.log(follows_clean);

			//3º encontrar las publicaciones de los usuarios que nos siguen
			//nos busca las publicaciones cuyo usuarios(campo user) se encuentren dentro del array follows_clean
			//ordenamos por fecha y populamos "user" para obtener todos los campos del objeto y paginamos
			Publication.find({user: {"$in" : follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerpage,(err, publications, total) => {
				if(err) return res.status(500).send({message: 'Error al devolver publicaciones'});
				if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

				return res.status(200).send({
					total_items: total,
					pages: Math.ceil(total/itemsPerpage),
					page: page,
					items_per_page: itemsPerpage,
					publications
				});

			});
		});
	}

		//Publicaciones de un usuario
	function getPublicationsUser (req, res){
			//Nos muestra publicaciones de los usuarios que nos siguen
			var page = 1;
			//si hay parametro pagina por la url
			if(req.params.page){
				page = req.params.page;
			}

			var user = req.user.sub;
			//si hay parametro user por la url
			if(req.params.user){
				user = req.params.user;
			}


			var itemsPerpage = 4;
			
			
				Publication.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerpage,(err, publications, total) => {
					if(err) return res.status(500).send({message: 'Error al devolver publicaciones'});
					if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

					return res.status(200).send({
						total_items: total,
						pages: Math.ceil(total/itemsPerpage),
						page: page,
						items_per_page: itemsPerpage,
						publications
					});

				});
			}



//Devolver una publicacion gracias a su id
function getPublication(req, res){
	//Postam(get) y token de authorizacion.
	//Le pasamos por la url el id de una publicacion y listo,
	var publicationId = req.params.id;

	Publication.findById(publicationId, (err, publication) =>{
		if(err) return res.status(500).send({message: 'Error al devolver publicacion'});
		if(!publication) return res.status(404).send({message: 'No existe publicación'});

		return res.status(200).send({publication});

	});
}

function deletePublication(req, res){
	var publicationId = req.params.id;

	//Publication.findByIdAndRemove(publicationId, (err, publicationRemoved) =>{
	Publication.find({user: req.user.sub, '_id':publicationId}).remove((err) =>{

		if(err) return res.status(500).send({message: 'Error al borrar publicacion'});
		//if(!publicationRemoved) return res.status(404).send({message: 'No se ha bordrado la publicación'});

		return res.status(200).send({message: 'Publicacion eliminada'});
	});
}

// Subir archivos de imagen para la publicacion

function uploadImage(req, res){
	//****ojo --> En el body escibir campo --> "image" (form-data) y elegir archivo de imagen
	//**incluir en la url el id de la publicacion a adjuntar imagen
	//en el postman, en el body, elegir form-data--> campo "image" : adjuntar la imagen
	//**se pone campo imagen porque en el if de abajo lo nombramos así

//Nota: (Postam) incluir token de autenticacion: --> headers --> authorization : valor del token
//(Postman)Elegir post, url--> update-image-user/(id del user)
//Y en el Body elegir: form-data y elegir file, para que permita elegir un archivo
//El token se tiene que corresponder con el usuario
	var publicationId = req.params.id;

	

	if(req.files){
		//** 
		//**nota los console.log podemos verlos directamente en la consola, despues de ejecutar la peticion en el postman
		//es "image" porque así se lo hemos pasado por el body
		var file_path = req.files.image.path;
		console.log(file_path); //obtenemos ruta completa
		var file_split = file_path.split('\\');
		console.log(file_split); //obtenemos array de los elementos de la ruta

		var file_name = file_split[2];
		console.log(file_name);

		//para separar el nombre del archivo de la extension
		//utilizamos el split y como el 'pto' es un caracter especial
		//necesitamos escaparlo usando --> \.
		var ext_split = file_name.split('\.'); 
		var file_ext = ext_split[1]; //obtenemos la extension
		console.log(file_ext);

		

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif')
		{
			//
			Publication.findOne({'user':req.user.sub, '_id':publicationId}).exec((err,publication) =>{
				if(publication){

					//Actualizar documento de publicacion
			//utilizar version actualizada: findOneAndUpdate
		Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new: true}, (err, PublicationUpdated) =>{
			if(err) return res.status(500).send({message: 'Error en la peticion'});
			if(!PublicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
		//nos devuelve la publicacion actualizada
		return res.status(200).send({publication: PublicationUpdated});
			});
		}else{

			//Para borrar archivos, le pasamos la ruta
		return	removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicacion');
		}
	});

		
		}else {
			return	removeFilesOfUploads(res, file_path, 'Extension no válida');
			
		}


	}else {
		return res.status(200).send({message: 'No se han subido imagenes'});
	}
}

 function removeFilesOfUploads(res, file_path, message) {
 	fs.unlink(file_path, (err) => {
				 return res.status(200).send({ message: message});

			});	
 }

 //Obtener imagen de la publication

 function getImageFile(req, res){
 	//http://localhost:3801/api/get-image-pub/Ygl7radhcElkj7QknAhsB3Vd.jpg
 	//(Postman) en la ruta hay que añadir el nombre de la foto, mirar la bd, imageFile es el nombre de la imagen (nombre con la extension incluida)
 	///get-image-user/:imageFile
 	var image_file = req.params.imageFile;
 	var path_file = './uploads/publications/'+image_file;

 	fs.exists(path_file, (exists) => {
 		if(exists){
 			//nos devuelve la imagen
 			res.sendFile(path.resolve(path_file));
 		}else {
 			res.status(200).send({message: 'No existe la imagen...'});
 		}
 	})
 }





module.exports ={
	probando,
	savePublication,
	getPublications,
	getPublicationsUser,
	getPublication,
	deletePublication,
	uploadImage,
	getImageFile
}