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
  selector: 'add',
  templateUrl: './add.component.html',
  providers: [FollowService, MessageService, UserService ]
})
export class AddComponent implements OnInit {
	public title: string;
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status: string;
  public follows;  //coleccion (array) de documentos de usuarios que nos siguen,
                    // para poder enviarles un mensaje

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService, //Variable del servicio MessageService
    private _followService: FollowService,
    private _userService: UserService
    ) {

  this.title ='Enviar mensaje';
  
  this.identity = this._userService.getIdentity();
  this.token = this._userService.getToken();
  this.url = GLOBAL.url;
  this.message = new Message('','','','', this.identity._id,'');
  //el emitter (nosotros) -> identity._id y el receiver al que enviamos el mensaje
   }

  ngOnInit() {
  	console.log('add.component.cargado');
  }

}
