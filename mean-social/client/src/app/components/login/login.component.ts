import { Component, OnInit } from '@angular/core';

//para poder acceder a los parametros que recibamos de esta url y redirecciones:
import { Router, ActivatedRoute, Params } from '@angular/router';
//Importacion del modelo de usuario: (Importacion de la clase user)
import { User } from '../../models/user';

//Importamos el servicio, donde están los metodos
import { UserService } from '../../services/user.service';



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]  //Declaramos el servicio
})
export class LoginComponent implements OnInit {
	public title:string;
  public user:User;  //hemos cambiado a any para evitar error del user
  public status: string;

  public identity; // va a tener objeto del usuario identificado
  public token;  // va a tener el token de identificacion

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService //Variable del servicio UserService

    ) {
  this.title ='Identificate';
  this.user = new User("", "","","","","","ROLE_USER",""); // no es necesario indicar el rol, se encargará el backend
   }


  ngOnInit() {
  	console.log('Componente de login cargado');
  }

  onSubmit(){

    //****Realizamos 2 peticiones http, una para obtener el usuario y otra para obtener el token

    // console.log(this.user);
    // alert(this.user.password);
    //  alert(this.user.email);


//Logear al usuario y conseguir sus datos
    this._userService.signup(this.user).subscribe(
      response =>{
        this.identity = response.user; //contendra el usuario logeado
          // console.log(this.identity); //usuario en la consola
      
           
      if(!this.identity  || !this.identity._id){
        this.status = 'error';
      }else {
           //this.status ='success';
           //Persistir datos del usuario, localstorage
           //hace falta guardarlo en forma de string el objeto:
           localStorage.setItem('identity', JSON.stringify(this.identity));

           //Conseguir el token
           this.getToken();

      }          


      },
      error =>{
          var errorMessage = <any> error;
          console.log(errorMessage);
         
          if(errorMessage != null){
            this.status = 'error';
          }


      });
   


  }





getToken(){


 //Logear al usuario y conseguir sus datos
    this._userService.signup(this.user, 'true').subscribe(
      response =>{
        this.token = response.token; //contendra el usuario logeado
        
        console.log(this.token); //token en la consola
           
      if(this.token.length <= 0){
        this.status = 'error';

      }else {
          
           //Persistir Token, localstorage
           localStorage.setItem('token', this.token);


           //Conseguir contadores o estadisticas del usuario
           this.getCounters();

          
      }          


      },
      error =>{
          var errorMessage = <any> error;
          console.log(errorMessage);
          if(errorMessage != null){
            this.status = 'error';
          }


      });


 


}




 getCounters(){
      this._userService.getCounters().subscribe(
        response =>{
         localStorage.setItem('stats', JSON.stringify(response));  //objeto con los 3 contadores 
          this.status = 'success';
         console.log(response); //objeto con los 3 contadores 
          //**Mejora añadida: Redireccion a la home:
           this._router.navigate(['/']);
          


        },
        error =>{
          console.log(<any> error);

        }

        )
      

    }


}
