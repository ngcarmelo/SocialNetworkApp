'use strict'

import { Injectable } from '@angular/core'; //definir servicios e inyectarlos
import { HttpClient, HttpHeaders } from '@angular/common/http'; // para hacer las peticiones ajax y cabeceras
import { Observable } from 'rxjs/Observable'; // para recoger las respuestas del api **posible problema segun version
import { GLOBAL } from '../services/global';
import { Follow } from '../models/follow';
@Injectable() //Decorador
export class FollowService{
	public url:string; //url del backend
	
	

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
		//console.log(this.url);
	}
	//Metodo de registro


	addFollow(token, follow):Observable<any>{
		let params = JSON.stringify(follow);
		let headers = new HttpHeaders().set('Content-Type','application/json') //forma en que se envian los datos
								    	.set('Authorization',token); 	//sacamos el token 

				return this._http.post(this.url+'/follow/', params, {headers: headers});
				    	

	}
		// id es el usuario seguido
	deleteFollow(token, id):Observable<any>{
		
		let headers = new HttpHeaders().set('Content-Type','application/json') //forma en que se envian los datos
								    	.set('Authorization',token); 	//sacamos el token 

				return this._http.delete(this.url+'/follow/'+id, {headers: headers});

	}


	getFollowing(token, userId = null, page =1):Observable<any>{
			
			let headers = new HttpHeaders().set('Content-Type','application/json') //forma en que se envian los datos
								    	.set('Authorization',token); 	//sacamos el token 

			var url =  this.url+'/following';
			if(userId != null){
				url =  this.url+'/following/'+userId+'/'+page;
			}
				return this._http.get(url, {headers: headers});
			}


	


}