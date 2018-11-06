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
  		this.getMessages();
  }

  getMessages(){

  	this._messageService.getEmmitMessages(this.token, 1).subscribe(

  		response => {
  			if(response.message){
  				console.log(response);
  				this.messages = response.messages;
  			}
  		},
  		error =>{
  			
  			console.log(<any>error);
  		}
  		);

  }




}
