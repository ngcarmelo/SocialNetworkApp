//Añadimos EventEmitter, Input...para la comunicación  entre componentes
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core'; 
import { Router, ActivatedRoute, Params } from '@angular/router';

//Importamos el servicio, donde están los metodos
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';

import {GLOBAL} from '../../services/global';
import { Publication } from '../../models/publication';

//Importar el servicio de subida de avatar, añadirlo tambien en provides abajo, y en el constructor:
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  providers: [UserService, PublicationService, UploadService]  //Declaramos el servicio

})
export class SidebarComponent implements OnInit {
	public identity;
	public token;
	public stats;
	public url;
	public status;
	public publication: Publication;

  
  constructor(
  	 private _userService: UserService, //Variable del servicio UserService
     private _publicationService: PublicationService,
     private _uploadService: UploadService, //Variable del servicio de UploadService, subida avatar
     private _route: ActivatedRoute,
     private _router: Router
  	) {
  		this.identity = this._userService.getIdentity();
  		this.token = this._userService.getToken();
  		this.stats = this._userService.getStats(); //valor estadisticas, usuario identificado
  		this.url =  GLOBAL.url;
  		this.publication = new Publication("","","","",this.identity._id); //id del usuario que va a crear la publicacion


  	 }

  ngOnInit() {
  	console.log('se ha cargado el compomente el sidebar');
  	console.log('stadisticas:');
  	console.log(this.stats);
  }

  onSubmit(form){
  	console.log(this.publication);
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response =>{
        if(response.publication){
        //  this.publication = response.publication;
        
        if(this.filesToUpload && this.filesToUpload.length){
            //Subir imagen 
          //**image es el nombre del campo del fichero que tiene que recoger el backend, en este caso "image"
          this._uploadService.makeFileRequest(this.url+'/upload-image-pub/'+response.publication._id, [], this.filesToUpload, this.token, 'image')

               .then((result: any) =>{
                  this.publication.file = result.image; //que es lo que nos va a devolver el api

                    this.status ='success';
                     form.reset();
                     this._router.navigate(['/timeline/']);  //redireccionamos
                  });


        }else{
          
            this.status ='success';
             form.reset();
             this._router.navigate(['/timeline/']);  //redireccionamos


        }

        



        }else {
            this.status ='error';
        }

      },
       error =>{
               var errorMessage = <any> error;
                console.log(errorMessage);

                if(errorMessage != null){
                this.status = 'error';
                }
      }
      );
  }
    // Para las subida de las imagenes, metodo para el input type file
  public filesToUpload: Array<File>; //array de ficheros
  //nos cogera los ficheros seleccionados en el input
  fileChangeEvent(fileInput: any){ 
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }





  // Output
  //Decorador Output y crear la propiedad  que será el evento --> "sended"
  @Output() sended = new EventEmitter();
  sendPublication(event){
    console.log(event);
    this.sended.emit({send: 'true'});  //emito el evento
  }

  
}
