import { Component, OnInit } from '@angular/core';

//para poder acceder a los parametros que recibamos de esta url y redirecciones:
import { Router, ActivatedRoute, Params } from '@angular/router';

//Importacion del modelo de usuario: (Importacion de la clase user)
import { User } from '../../models/user';

//Importamos el servicio, donde están los metodos
import { UserService } from '../../services/user.service';

//Importar el servicio de subida de avatar, añadirlo tambien en provides abajo, y en el constructor:
import { UploadService } from '../../services/upload.service';

import {GLOBAL} from '../../services/global';



@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]  //Declaramos el servicio
})
export class UserEditComponent implements OnInit {
	public title: string;
	public user: User;
	public identity;
	public token;
	public status: string;
  public url: string;




  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService, //Variable del servicio UserService
    private _uploadService: UploadService //Variable del servicio de UploadService, subida avatar
    ) { 
  	this.title ='Actualizar mis datos';
  	this.user = this._userService.getIdentity(); //obtenemos los datos usuario del local storage
  	this.identity = this.user; //es para rellenar el identity con lo que nos llega del localstorage
  	this.token = this._userService.getToken(); //obtenemos del localstorage
    this.url = GLOBAL.url;
  }

  ngOnInit() {

  	console.log('user-edit component se ha cargado!');
  	console.log(this.user);
  }

  onSubmit(){
  	console.log(this.user);
  	this._userService.updateUser(this.user).subscribe(
  		response =>{
  			if(!response){
  				this.status = 'error'; //mensaje de error en la vista
  			}else {
  				this.status = 'success';
  				localStorage.setItem('identity', JSON.stringify(this.user));  //act user en el localStorage
  				this.identity = this.user; //actualizar user a nivel de la clase

  				//SUBIDA DE IMAGEN DE USUARIO
          //1º parametro: url del api
          //2º parametro: nada, 3º parametro: array de ficheros a subir
          //4º parametro: token autentificacion
          //5º parametro: nombre del parametro del  backend que está esperando. 'image' es donde estan los files seleccionados.
                //***Atencion curso cambiado upload-image-user por update-image user
          this._uploadService.makeFileRequest(this.url+ '/update-image-user/'+this.user._id,[], this.filesToUpload, this.token, 'image')
            //.then para capturar la respuesta
                                  .then((result: any)=>{
                                    console.log(result);  // el resultado: nombre de la imagen guardada
                                    this.user.image = result.user.image; //guardar el nombre de la imagen
                                    localStorage.setItem('identity', JSON.stringify(this.user)); 
                                    //actualizamos el objeto user en el localStore porque el campo image ha cambiado 

                                  });
  			}

  		},
  		error =>{
  			var errorMessage = <any> error;
  			console.log(errorMessage);

  			//esto es para poder mostrar un mensaje de error en la vista:
  			//gracias a lavariable status
  			if(errorMessage != null){
  				this.status = 'error';
  			}

  		});
  }
    // **Con este metodo capturamos en la variable los ficheros seleccionados con el input
  public filesToUpload: Array<File>; //Array de objetos tipo fichero
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files; //guardamos los ficheros seleccionados en mi input
      console.log(this.filesToUpload);

  }

}
