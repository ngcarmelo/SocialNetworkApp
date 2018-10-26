import { Component, OnInit, DoCheck } from '@angular/core';
//Importamos el Servicio para toda la aplicacion
import { UserService } from './services/user.service';
//para poder acceder a los parametros que recibamos de esta url y redirecciones: e inyectarlos en el contructor
import { Router, ActivatedRoute, Params } from '@angular/router';

import {GLOBAL} from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService] //Añadimos el servicio
})
export class AppComponent implements OnInit, DoCheck {
  public title: string;
  public identity;
  public url;

  constructor(
  	private _userService: UserService, //
    private _route: ActivatedRoute, //
    private _router: Router
  	){
  	this.title = 'NGSOCIAL';
    this.url = GLOBAL.url;

  }

  ngOnInit(){

  	this.identity = this._userService.getIdentity();
  	console.log(this.identity);

  }
  //al haber algun cambio en este componente actualiza el valor de la variable identity
  ngDoCheck(){
  	
  	  	this.identity = this._userService.getIdentity();
  		
  }

 logout(){

   localStorage.clear();
   this.identity =null;
   this._router.navigate(['/']);  //redireccion

 }


}
