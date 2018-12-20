import { Component, OnInit } from '@angular/core';
//para poder acceder a los parametros que recibamos de esta url y redirecciones:
import { Router, ActivatedRoute, Params } from '@angular/router';
//Importacion del modelo de usuario: (Importacion de la clase user)
import { User } from '../../models/user';

//Importamos el servicio, donde están los metodos
import { UserService } from '../../services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService] // Declaramos el servicio aquí tambien
})
export class RegisterComponent implements OnInit {
	public title:string;
	public user: User;
	public status:string;

	//Ademas de importar debemos incluirlo en el contructor las 2 variables para las rutas y parametros url
  constructor(
  	private _route: ActivatedRoute,
  	private _router: Router,
  	private _userService: UserService //Variable del servicio UserService
  	) { 
  	this.title ='Registrate';
  	this.user = new User("",
		"",
		"",
		"",
		"",
		"",
		"ROLE_USER", //pero no es necesario, se encargará el backend
		"");
  	}

  ngOnInit() {
  	  	console.log('Componente de registro cargado');

  }
  //Le pasamos esta variable para dejar en blanco el formulario
  //Mirar html que le hemos pasado el "registerForm" pero para abreviar ahora como form
  onSubmit(form){
  	//Metodo del Sercivio userService:
  	//Como nos devuelve un observable utilizamos subscribe
  	this._userService.register(this.user).subscribe(
  		response => {
  			if(response.user && response.user._id){
  				//console.log(response.user);

  				this.status = 'success';
  				form.reset(); //reseteamos el formulario

  			}else {
				this.status ='error';  				
  			}
  		},
  		error => {
  			console.log(<any>error);

  		}

  		);

  }

}
