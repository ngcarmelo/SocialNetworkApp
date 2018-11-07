'use strict'

//Puedo usar este guard en cada una de las rutas (rutas privadas)
//Nota: hay que impportarlos en el app.module
// import { UserService } from './services/user.service';
// import { UserGuard } from  './services/user.guard';
// y luego en providers
 // providers: [  
 //  appRoutingProviders,
 //  UserService,
 //  UserGuard
 //    ],

 // y luego en el routing importarlo tambien:
// import { UserGuard } from  './services/user.guard';

// y añadiendo la propiedad siguiente en cada ruta que queremos usarlo:
 // canActivate:[UserGuard]


import { Injectable } from '@angular/core'; //definir servicios e inyectarlos
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {
	constructor(
	 private _router: Router,
     private _userService: UserService
		){}


	canActivate(){

		let identity = this._userService.getIdentity();
		if(identity && (identity.role == 'ROLE_USER'  || identity.role == 'ROLE_ADMIN')){
			return true;
		}else{
			this._router.navigate(['/login']);
			return false;
		}

	}


}