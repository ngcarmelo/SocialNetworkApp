// Configuracion express

'use strict'

var express = require('express');

//antiguo, no hace falta:
//var bodyParser = require('body-parser');

var app = express();

//cargar rutas de user
var user_routes = require('./routes/user');
//cargar rutas de follow
var follow_routes = require('./routes/follow');
//cargar rutas de publication
var publication_routes = require('./routes/publication');
//cargar rutas de mensajes
var message_routes = require('./routes/message');


// middlewares

//antiguo:
//app.use(bodyParse.urlencoded({extended: false}));
//app.use(boyParser.json());

//nuevo:
app.use(express.urlencoded({ extended: true})); 
app.use(express.json());


// cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});


// rutas
//con 'use' creamos middlewares, y así sobre-escribimos la ruta y le añadimos '/api' delante
// de la ruta que se encuentre en user_routes
app.use('/api', user_routes);

//rutas de follow_routes
app.use('/api', follow_routes);

//rutas de publication_routes
app.use('/api', publication_routes);

//rutas de message_routes
app.use('/api',message_routes);

// prueba inicial:
 // app.get('/pruebas', (req, res) =>{

 // 	res.status(200).send({
 // 		message: 'Accion de pruebas en el servidor de NodeJS'

 // 	});
 // });

//exportar

module.exports = app;
