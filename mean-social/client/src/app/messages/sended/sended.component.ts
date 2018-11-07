import { Component, OnInit } from '@angular/core';
//para poder acceder a los parametros que recibamos de esta url y redirecciones:
import { Router, ActivatedRoute, Params } from '@angular/router';

//Importacion del modelo de usuario: (Importacion de la clase user)
import { Follow } from '../../models/follow';
import { Message } from '../../models/message';
import { User } from '../../models/user';

//Importamos el servicio, donde están los metodos
import { FollowService } from '../../services/follow.service';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';

import {GLOBAL} from '../../services/global';
@Component({
  selector: 'sended',
  templateUrl: './sended.component.html',
  providers: [FollowService, MessageService, UserService ]
})
export class SendedComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public messages: Message[]; 
  public pages;
  public total;
  public page;
  public next_page;
  public prev_page; 


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService, //Variable del servicio MessageService
    private _followService: FollowService,
    private _userService: UserService
  	) { 
 	this.title ='Mensajes Enviados';

  	 this.identity = this._userService.getIdentity();
 	 this.token = this._userService.getToken();
 	 this.url = GLOBAL.url;
 	
  }

  ngOnInit() {
  		console.log('sended.component.cargado');
  		this.actualPage();
  }

  getMessages(token, page){
  		
  	this._messageService.getEmmitMessages(token, page).subscribe(

  		response => {
  			if(response.messages){
  				this.messages = response.messages;
  				//paginacion
  				this.total = response.total;
  				this.pages = response.pages;
  			}
  		},
  		error =>{
  				console.log(<any>error);
  		}
  		);
  }


actualPage(){
    //Así lo hacemos para recoger los parametros recibidos por url de la propia pagina
    this._route.params.subscribe(params =>{

     
      let page = +params['page'];  //Convertimos a entero con el ->  " + "
      this.page = page;

      if(!params['page']){
        page =1;
      }

      if(!page) {
        page =1
      }else{
        this.next_page = page+1;
        this.prev_page = page+1;

        if(this.prev_page <=0){
          this.prev_page =1;
        }
      }
     //Devolver listado de  usuarios
     this.getMessages(this.token, this.page);


    });

  }











}
