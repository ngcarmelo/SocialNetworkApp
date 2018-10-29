'use strict'

import { Injectable } from '@angular/core'; //definir servicios e inyectarlos
import { HttpClient, HttpHeaders } from '@angular/common/http'; // para hacer las peticiones ajax y cabeceras
import { Observable } from 'rxjs/Observable'; // para recoger las respuestas del api **posible problema segun version
import { GLOBAL } from '../services/global';
import { Publication } from '../models/publication';


@Injectable() //Decorador
export class PublicationService{
	public url: string;


constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
		
	}

	addPublication(token, publication):Observable<any>{
		let params = JSON.stringify(publication); //json(objeto) convertido a string
		let headers = new HttpHeaders().set('Content-type', 'application/json') //en php el application/json seria diferente
										.set('Authorization',token);
		//Peticion al API:
		//Parametros: 1º url 2º params(el objeto que enviamos) 3º headers
		return this._http.post(this.url+'/publication/', params, {headers: headers});

	}

	getPublications(token, page =1):Observable<any>{

		let headers = new HttpHeaders().set('Content-type', 'application/json') //en php el application/json seria diferente
										.set('Authorization',token);

	return this._http.get(this.url+'/publications/'+page, {headers: headers});
	}

	//Publicaciones de un solo usuario
	getPublicationsUser(token, user_id, page =1):Observable<any>{

		let headers = new HttpHeaders().set('Content-type', 'application/json') //en php el application/json seria diferente
										.set('Authorization',token);

	return this._http.get(this.url+'/publications-user/'+ user_id + '/'+ page, {headers: headers});
	}

		// id de la publicacion a eliminar 
	deletePublication(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-type', 'application/json') //en php el application/json seria diferente
										.set('Authorization',token);

	return this._http.delete(this.url+'/publication/'+id, {headers: headers});

	}	
}