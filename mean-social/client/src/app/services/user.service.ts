'use strict'

import { Injectable } from '@angular/core'; //definir servicios e inyectarlos
import { HttpClient, HttpHeaders } from '@angular/common/http'; // para hacer las peticiones ajax y cabeceras
import { Observable } from 'rxjs/Observable'; // para recoger las respuestas del api **posible problema segun version
import { GLOBAL } from '../services/global';
import { User } from '../models/user';

@Injectable() //Decorador
export class UserService{
	public url:string; //url del backend
	
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
		//console.log(this.url);
	}
	//Metodo de registro
	register(user: User): Observable<any>{
		let params = JSON.stringify(user); //json(objeto) convertido a string
		let headers = new HttpHeaders().set('Content-type', 'application/json'); //en php el application/json seria diferente
		
		//Peticion al API:
		//Parametros: 1º url 2º params(el objeto que enviamos) 3º headers
		return this._http.post(this.url+'/register', params, {headers: headers});
	}

	//Metodo para logearse
	signup(user: any, gettoken = null): Observable<any>{

		//tal como esta el backend, si hay gettoken nos devolverá el token
		if(gettoken != null){
			user.gettoken = gettoken;
		}

		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'/login', params, {headers: headers});


	}

	//Metodos para obtener los datos del localStorage, valores de usuario y token logeado
	getIdentity(){

		//El string del localstorage lo convertimos a un objeto JSON
		let identity = JSON.parse(localStorage.getItem('identity'));



		 if(identity != "undefined"){
		
			//console.log('existe identity');
			this.identity = identity;
		//	console.log(this.identity);
		}else {
		//	console.log('identity es nulo');
			this.identity = null;
		}
		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');

		if(token != "undefined"){
			this.token = token;
		}else {
			this.token = null;
		}
		return this.token;
	}

	getStats(){
		let stats = JSON.parse(localStorage.getItem('stats'));

		if(stats != "undefined"){
			this.stats = stats;
		}else {
			this.stats = null;
		}

		return this.stats;

	}


getCounters(userId = null): Observable<any>{

	let headers = new HttpHeaders().set('Content-Type','application/json')
									.set('Authorization',this.getToken()); 
			//Como novedad le pasamos en el headers tambien el authorization, valor del token
			//Hasta ahora solo lo haciamos con el postam escribiendo:, para el tema del backend
			// authorization : valor_token(del usuario que nos interesaba)

			if(userId != null){

				return this._http.get(this.url+'/counters/'+userId,{headers: headers});
			}else {

				return this._http.get(this.url+'/counters/',{headers: headers});
			}

}

//Actualizar usuario:

updateUser(user: User):Observable<any>{
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type','application/json') //forma en que se envian los datos
								    	.set('Authorization',this.getToken()); 	//sacamos el token del localStorage

		return this._http.put(this.url+'/update-user/'+user._id, params, {headers: headers});


}
	//Listado de usuarios
 getUsers(page = null):Observable<any>{

	let headers = new HttpHeaders().set('Content-Type','application/json') //forma en que se envian los datos
								    	.set('Authorization',this.getToken()); 	//sacamos el token del localStorage

		return this._http.get(this.url+'/users/'+page, {headers: headers});

 }

 //Lo usaremos en el Perfil de usuario: nos muestra solo un usuario
getUser(id):Observable<any>{

	let headers = new HttpHeaders().set('Content-Type','application/json') //forma en que se envian los datos
								    	.set('Authorization',this.getToken()); 	//sacamos el token del localStorage

		return this._http.get(this.url+'/user/'+id, {headers: headers});

 }




}