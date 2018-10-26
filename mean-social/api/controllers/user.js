'use strict'

//necesario para las contraseñas cifradas:
var bcrypt = require('bcrypt-nodejs');

//necesario para la paginacion:
var mongoosePaginate = require('mongoose-pagination');
//Nos permite trabajar con archivos
var fs = require('fs');
var path = require('path'); //nos permite trabajar con rutas

var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');

var jwt = require('../services/jwt.js');

// app.get('/', (req, res) =>{

//  	res.status(200).send({
//  		message: 'Hola Mundo desde  en el servidor de NodeJS'

//  	});
//  });

//Metodos de prueba
function home (req, res) {

 	res.status(200).send({
 		message: 'Hola Mundo desde  en el servidor de NodeJS'

 	});
 }



function pruebas (req, res) {

 	res.status(200).send({
 		message: 'Hola mundo desde  el servidor de NodeJS'

 	});
 }

//Registro
function saveUser (req, res){
	//campos que nos lleguen por post en --> params, con req.body
	var params = req.body;
	var user = new User();

	if(params.name && params.surname && params.nick
	 && params.email && params.password){ 

		user.name = params. name;
		user.surname = params.surname;
		user.nick = params.nick;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		//condicion or para buscar en la BD, si existe ese email o ese nick
		//nos encontrara todos los que se repitan
		//Controlar usuarios duplicados
		User.find({ $or: [
						{email: user.email.toLowerCase()},
						{nick: user.nick.toLowerCase()}

						]}).exec((err, users) => {

							if(err) return res.status(500).send({ message: 'Error en la peticion de usuarios'});

							if(users && users.length >= 1){
								return res.status(200).send({ message: 'El usuario que intenta registrar ya existe!!'});
							}else {

								//Cifra el password y me guarda los datos:
		bcrypt.hash(params.password, null, null, (err, hash) =>{
			user.password = hash;
			//funcion de mongoose:
			user.save((err, userStored) => {
				if(err) return res.status(500).send({ message: 'Error al guardar el usuario'});
				if(userStored){
					res.status(200).send({user: userStored});
				}else{
					res.status(404).send({message: 'No se ha registrado el usuario'})
				}
			});

		});
							}
						});
		}else{
			res.status(200).send({
				message: 'Envia todos los campos necesarios'
			});
		} 
}

//Login
function loginUser(req, res){

	//al logearnos obtenemos el token, si agregamos gettoken :true en el body (postman)
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email}, (err, user) =>{
		if(err) return res.status(500).send({message: 'Error en la peticion'});
		if(user)  {
			//comparacion entre password del post y el almacenado en BD
			bcrypt.compare(password, user.password, (err, check)=>{
				if(check){

					//Si en la peticion está este parametro nos devuelve el token:	
					//en postman ponemos (en el body): gettoken --> true
					if(params.gettoken){
						//devolver token y generar token
						return res.status(200).send({
							//libreria jwt y el createToken es el metodo creado en: services/jwt.js
							token: jwt.createToken(user)
						});

					}else {
					//devolver datos de usuario
					user.password = undefined; //eliminamos esta propiedad por seguridad 
												//y que no la muestre al devolver datos
					return res.status(200).send({user});
					}
					
					
				}else {
					return res.status(404).send({message:'El usuario no se ha podido identificar'});
				}

			});
		}else {
			return res.status(404).send({message:'El usuario no se ha podido identificar!!!'});
		}
	})

}

// // Conseguir datos de un usuario
// function getUser(req, res){
//  //**hace falta pasarle por headers el token --> authorization : valor token 
//  //** y el id del usuario claro esta xD

// 	//cuando nos llegan datos por la url: usamos params
// 	//cuando nos llegan datos por post, put: body
// 	var userId = req.params.id;

// 	User.findById(userId,(err, user) => {
// 			if(err) return res.status(500).send({message: 'Error en la peticion'});
// 			if(!user) return res.status(404).send({message: 'El usuario no existe'});

// 			return res.status(200).send({user});

// 	});
// }


// // Conseguir datos de un usuario, y si nos sigue o no (añadido)
// function getUser(req, res){
//  //**hace falta pasarle por headers el token --> authorization : valor token 
//  //** y el id del usuario claro esta xD

// 	//cuando nos llegan datos por la url: usamos params
// 	//cuando nos llegan datos por post, put: body
// 	var userId = req.params.id;

// 	User.findById(userId,(err, user) => {
// 			if(err) return res.status(500).send({message: 'Error en la peticion'});
// 			if(!user) return res.status(404).send({message: 'El usuario no existe'});

// 			Follow.findOne({"user": req.user.sub, "followed": userId}).exec((err, follow)=>{
// 				if(err) return res.status(500).send({message: 'Error al comprobar el seguiemiento'});
// 				return res.status(200).send({user, follow});
// 				//***si nos sale follow null es porque no nos sigue
// 			});
			
// 	});
// }

// Conseguir datos de un usuario, y si nos sigue o no (añadido) version con asincronia
function getUser(req, res){
 //**hace falta pasarle por headers el token --> authorization : valor token 
 //** y el id del usuario claro esta xD

	//cuando nos llegan datos por la url: usamos params
	//cuando nos llegan datos por post, put: body

	var userId = req.params.id;

	User.findById(userId,(err, user) => {
			if(err) return res.status(500).send({message: 'Error en la peticion'});
			if(!user) return res.status(404).send({message: 'El usuario no existe'});
			
			followThisUser(req.user.sub, userId).then((value)=>{
				user.password = undefined;
				return res.status(200).send({user,
				following: value.following,
				followed: value.followed
			});
			});
			
	});
}




 //Asincrona, este metodo me devuelve una promesa, así que podremos usar el .then
async function followThisUser(identity_user_id, user_id){
    try {
        var following = await Follow.findOne({ user: identity_user_id, followed: user_id}).exec()
            .then((following) => {
                return following;
            })
            .catch((err)=>{
                return handleError(err); //metodo de node para devolver un error por consola
            });
        var followed = await Follow.findOne({ user: user_id, followed: identity_user_id}).exec()
            .then((followed) => {
                return followed;
            })
            .catch((err)=>{
                return handleError(err);
            });
        return {
        		//***si nos sale follow null es porque no nos sigue o no lo seguimos
            following: following,
            followed: followed
        }
    } catch(err){
        return handleError(err);
    }
}




// //Devolver un listado de usuarios paginado sin asincronia 1º version
// function getUsers(req, res){

// //** para el postman, al tener el midleware necesitará en el headers el authorization : valor token

// 	//al crear el token, creamos una propiedad sub con el id del usuario
// 	var identity_user_id = req.user.sub;
// 	var page = 1;
// 	if(req.params.page){
// 		page = req.params.page;

// 		}
// 		var itemsPerPage = 5;
// 			//sacamos todos los user de la bd y lo ordenamos por id
// 			//paginate --> 1º param: pagina actual 2º itemsPerPage, 3º callback
// 			//--> users: usuarios de la bd y total: numero total de usuarios
// 		User.find().sort('_id').paginate(page, itemsPerPage,(err, users, total) =>{
// 			if(err) return res.status(500).send({message: 'Error en la peticion'});
		
// 			if(!users) return res.status(404).send({message: 'No hay usuarios en la plataforma'});


// 			});
// 			return res.status(200).send({
// 				total,
// 				pages: Math.ceil(total/itemsPerPage),
// 				users
				
// 			});
// 		});
// }


//Devolver un listado de usuarios paginado con asincronia
function getUsers(req, res){

//** para el postman, al tener el midleware necesitará en el headers el authorization : valor token

	//al crear el token, creamos una propiedad sub con el id del usuario
	var identity_user_id = req.user.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;

		}
		var itemsPerPage = 5;
			//sacamos todos los user de la bd y lo ordenamos por id
			//paginate --> 1º param: pagina actual 2º itemsPerPage, 3º callback
			//--> users: usuarios de la bd y total: numero total de usuarios
		User.find().sort('_id').paginate(page, itemsPerPage,(err, users, total) =>{
			if(err) return res.status(500).send({message: 'Error en la peticion'});
		
			if(!users) return res.status(404).send({message: 'No hay usuarios en la plataforma'});

			followUserIds(identity_user_id).then((value)=>{

			return res.status(200).send({
							total,
							pages: Math.ceil(total/itemsPerPage),
							users,
							users_following: value.following,
							users_follow_me: value.followed
					});

			});
		
		});
}





// async function followUserIds(user_id){
// 	//Con select podemos  deselecionar los campos que queremos con --> 'campo':0
// 	var following = await Follow.find({"user":user_id}).select({'_id':0,'__v':0, 'user':0}).exec((err,follows)=>{

// 		var follows_clean = [];

// 		follows.forEach((follow) =>{
// 			follows_clean.push(follow.followed);
// 			});
// 		return follows_clean;
// 	});

// 	var followed = await Follow.find({"followed":user_id}).select({'_id':0,'__v':0, 'followed':0}).exec((err,follows)=>{

// 		var follows_clean = [];

// 		follows.forEach((follow) =>{
// 			follows_clean.push(follow.user);
// 			});
// 		return follows_clean;
// 	});

// 	return {
// 		following: following,
// 		followed: followed
// 	}

// }



async function followUserIds(user_id){

var following = await Follow.find({"user": user_id}).select({'_id': 0, '__uv': 0, 'user': 0}).exec().then((follows)=>{

var follows_clean=[];

follows.forEach((follow)=>{
	follows_clean.push(follow.followed);

});

console.log(follows_clean);

return follows_clean;

}).catch((err)=>{

return handleerror(err);

});

var followed = await Follow.find({"followed": user_id}).select({'_id': 0, '__uv': 0, 'followed': 0}).exec().then((follows)=>{

var follows_clean=[];

follows.forEach((follow)=>{

follows_clean.push(follow.user);

});

return follows_clean;

}).catch((err)=>{

return handleerror(err);

});



console.log(following);

return {

following: following,

followed: followed

}

}


// Contadores y estadisticas
function getCounters(req, res){
	var userId = req.user.sub;
	if(req.params.id){
		userId = req.params.id;
	}
	getCountFollow(userId).then((value)=>{
				return res.status(200).send(value);

			});

}

// async function getCountFollow(user_id){
// 	//llamadas sincronas:
// 	var following = await Follow.count({"user": user_id}).exec((err,count) =>{

// 		if(err) return hadndleError(err);
// 		return count;
// 	});

// 	var followed = await Follow.count({"followd": user_id}).exec((err,count) =>{
// 			if(err) return hadndleError(err);
// 				return count;
// 	});

// 	return {
// 		following: following,
// 		followed: followed
// 	}
// }

async function getCountFollow(user_id){
try{
var following = await Follow.count({"user":user_id}).exec()
.then(count=>{
return count;
})
.catch((err)=>{
return handleError(err);

});

var followed = await Follow.count({"followed":user_id}).exec()
.then(count=>{
return count;
})
.catch((err)=>{
return handleError(err);
});


///////
  var publications = await Publication.count({"user":user_id}).estimatedDocumentCount((err, count) => {
        if(err) return handleError(err);
        return count;
    });



//   var publications = await Publication.count({"user":user_id}).exec() 
//  .then(count=>{
// return count;
// })
// .catch((err)=>{
// return handleError(err);
// });

/////////

return {
following:following,
followed:followed,
publications: publications

}

}catch(e){
console.log(e);
}
}




// Edicion datos de usuario // actualizar xD

function updateUser(req, res){
  //**nota en postam: poner put(porque actualizamos)
  //**en el headers añadir authorization: valor token de (solo) este usuario,
  //así hay que logearse con el para obtenerlo (el token)
  //y los campos a modificar

//*metodo mejorado para comprobar si el usuario esta duplicado o no, como el nick unico


	var userId = req.params.id;
	var update = req.body;

	//eliminar campo password por seguridad
	delete update.password;

	//** nota: req.user esta almacenado todas las propiedades del usuario (viene del middleware de autentificacion)
	// osea el objeto del token
	if(userId != req.user.sub){
		return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
	}

		User.find({ $or: [
						{email: update.email.toLowerCase()},
						{nick: update.nick.toLowerCase()}

						]}).exec((err, users)=>{
							console.log(users);
							var user_isset = false;
							users.forEach((user) =>{
					if(user && user._id != userId)  user_isset = true;

						});

		if(user_isset) return  res.status(404).send({message: 'Los datos ya están en uso'});
		
		User.findByIdAndUpdate(userId, update, { new: true}, (err, userUpdated) => {
			if(err) return res.status(500).send({message: 'Error en la peticion'});

			if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({user: userUpdated});
	 });


					
		
						

	

						});

				//**al incluir new true, nos devolverá el objeto actualizado
				//sino nos devolveria el antiguo sin el { new: true},


	
}

// Subir archivos de imagen/avatar de usuario

function uploadImage(req, res){

//Nota: (Postam) incluir token de autenticacion: --> headers --> authorization : valor del token
//(Postman)Elegir post, url--> update-image-user/(id del user)
//Y en el Body elegir: form-data y elegir file, para que permita elegir un archivo
//El token se tiene que corresponder con el usuario
	var userId = req.params.id;

	

	if(req.files){
		//** 'image' es el nombre del campo donde va el input de archivos en el body(form-data)Postman
		//**nota los console.log podemos verlos directamente en la consola, despues de ejecutar la peticion en el postman
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

		if(userId != req.user.sub){
	 	return 	removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
	}

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif')
		{
			//Actualizar documento de usuario logeado
			//utilizar version actualizada: findOneAndUpdate
		User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) =>{
			if(err) return res.status(500).send({message: 'Error en la peticion'});
			if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
	
		return res.status(200).send({user: userUpdated});
			});

		}else {
			//Para borrar archivos, le pasamos la ruta
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

 //Obtener avatar

 function getImageFile(req, res){
 	//(Postman) en la ruta hay que añadir el nombre de la foto, mirar la bd, imageFile es el nombre de la imagen
 	///get-image-user/:imageFile
 	var image_file = req.params.imageFile;
 	var path_file = './uploads/users/'+image_file;

 	fs.exists(path_file, (exists) => {
 		if(exists){
 			//nos devuelve la imagen
 			res.sendFile(path.resolve(path_file));
 		}else {
 			res.status(200).send({message: 'No existe la imagen...'});
 		}
 	})
 }




 module.exports = { 
 	home, 
 	pruebas,
 	saveUser,
 	loginUser,
 	getUser,
 	getUsers, 
 	getCounters,
 	updateUser,
 	uploadImage,
 	getImageFile
 }