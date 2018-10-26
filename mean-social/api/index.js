//Conexion bd

'use strict'

var mongoose = require('mongoose');
var app = require('./app');
//problema con puerto 3800
var port = 3801;



//Conexion Database
mongoose.Promise = global.Promise;  //conexion a bd, nuestra bd se llama mean-social
// mongoose.connect('mongodb://localhost:27017/mean-social', { useMongoClient: true})
// así no nos aparece la advertencia: al ejecutar  --> "node index.js" en la consola
mongoose.connect('mongodb://localhost:27017/mean-social', { useNewUrlParser: true})
.then(()=>{
	console.log("La conexion a la base de datos mean-social se ha realizado correctamente");

	//Crear servidor
	app.listen(port, () => {
		console.log("Servidor corriendo en http://localhost:3800");
		// ruta para acccer peticiones: http://localhost:3801/api/
	});
})
.catch (err => console.log(err));

