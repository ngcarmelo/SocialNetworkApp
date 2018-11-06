'use strict'

import { Injectable } from '@angular/core'; //definir servicios e inyectarlos
import { HttpClient, HttpHeaders } from '@angular/common/http'; // para hacer las peticiones ajax y cabeceras
import { Observable } from 'rxjs/Observable'; // para recoger las respuestas del api **posible problema segun version
import { GLOBAL } from '../services/global';
import { Message } from '../models/message';



@Injectable() //Decorador
export class MessageService{
	public url: string;


constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
		
	}


	addMessage(token, message):Observable<any>{
		let params = JSON.stringify(message); //json(objeto) convertido a string
		let headers = new HttpHeaders().set('Content-type', 'application/json') //en php el application/json seria diferente
										.set('Authorization',token);
		//Peticion al API:
		return this._http.post(this.url+'/message', params, {headers: headers});

	}

	//Listar mensajes recibidos
	getMyMessages(token, page =1):Observable<any>{
				let headers = new HttpHeaders().set('Content-type', 'application/json') //en php el application/json seria diferente
										.set('Authorization',token);
		//Peticion al API:
		return this._http.get(this.url+'/my-messages/'+page,  {headers: headers});

	}
	//Listar mensajes enviados:
	getEmmitMessages(token, page =1):Observable<any>{
				let headers = new HttpHeaders().set('Content-type', 'application/json') //en php el application/json seria diferente
										.set('Authorization',token);
		//Peticion al API:
		return this._http.get(this.url+'/messages/'+page,  {headers: headers});

	}



	
}