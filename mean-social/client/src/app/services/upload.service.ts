import { Injectable } from '@angular/core';
import {GLOBAL} from './global';

@Injectable()
export class UploadService{
	public url: string;

	constructor(){
		this.url = GLOBAL.url;
	}
	//Peticion Ajax Clasica
	//Parametros de peticion:
	//1º Url del metodo del api 3º Array con los archivos que vamos a tener 4º token aunticacion 5º nombre del fichero o del campo
	makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string ){
		//Realizar peticion: con una promesa
		return new Promise(function(resolve, reject){
			//Definir o simular un formulario:
			var formData: any = new FormData();
			var xhr =  new XMLHttpRequest(); //Nos permite realizar peticiones ajax en javascript puro
			for(var i =0; i<files.length; i++){
				//en el append: nombre--> image (en este caso), el propio fichero, el nombre del fichero 
				formData.append(name, files[i], files[i].name); //añades al formulario un nuevo fichero
			}
			//Ahora ya tendrias el formulario con los ficheros adjuntos, arriba
			//Ahora si, peticion ajax:
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else {
						reject(xhr.response);
					}
				}
			}
			//Despues de comprobaciones, la peticion en si: 
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization',token);
			xhr.send(formData);


		});

		
	}

		//Inicio
// makeFilesRequest(url: string, params:Array<string>, files:Array<File>, token: string, name: string): Observable<any>{
// const formData: FormData = new FormData();

// for(var i=0; i <files.length; i++){
// formData.append(name, files[i], files[i].name);
// }
// let headers = new HttpHeaders().set('Authorization', token);
// return this._http.post(url, formData, {headers: headers});

// }
		//Fin









}
