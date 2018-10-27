//Añadimos EventEmitter, Input...para la comunicación  entre componentes
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core'; 
import { Router, ActivatedRoute, Params } from '@angular/router';

//Importamos el servicio, donde están los metodos
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';

import {GLOBAL} from '../../services/global';
import { Publication } from '../../models/publication';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  providers: [UserService, PublicationService]  //Declaramos el servicio

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
          this.status ='success';
          form.reset();
          this._router.navigate(['/timeline/']);  //redireccionamos
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

  // Output
  //Decorador Output y crear la propiedad  que será el evento --> "sended"
  @Output() sended = new EventEmitter();
  sendPublication(event){
    console.log(event);
    this.sended.emit({send: 'true'});  //emito el evento
  }


}
