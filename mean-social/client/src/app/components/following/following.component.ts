import { Component, OnInit } from '@angular/core';
//para poder acceder a los parametros que recibamos de esta url y redirecciones:
import { Router, ActivatedRoute, Params } from '@angular/router';

//Importacion del modelo de usuario: (Importacion de la clase user)
import { User } from '../../models/user';
import { Follow } from '../../models/follow';

//Importamos el servicio, donde están los metodos
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';

import {GLOBAL} from '../../services/global';

@Component({
  selector: 'following',
  templateUrl: './following.component.html',
  providers: [UserService, FollowService]  //Declaramos el servicio

})
export class FollowingComponent implements OnInit {
	public url: string;
	public title: string;
	public identity;
	public token;

	public page;
	public next_page;
	public prev_page;
	public total;
	public pages;
	public users: User[]; //array de objetos usuario
	public follows; //usuarios que nosostros estamos siguiendo
	public status: string;

  constructor(
  	private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService, //Variable del servicio UserService
    private _followService: FollowService

    ) {
    this.title ='Following';
    this.url = GLOBAL.url;
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
 }

  ngOnInit() {
  	  	console.log("following.component ha sido cargado");

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
     //this.getUsers(page);

    });

  }


  getFollows(page){
    this._userService.getUsers(page).subscribe(
      response =>{
        if(!response.users){
          this.status='status';
        }else {
          console.log(response);
         this.total = response.total;
         this.users = response.users;
         this.pages = response.pages;
         //a quienes seguimos:
         this.follows = response.users_following;
         console.log(this.follows);
         if(page > this.pages){
           this._router.navigate(['/gente',1]); //redirección sino existe la pagina a la primera pagina
         }

        }

    },error =>{
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status ='error';
        }
    });

  }
  //Efecto de los botones a mostrar
    public followUserOver;
    mouseEnter(user_id){
      this.followUserOver = user_id;
         }

    mouseLeave(user_id){
      this.followUserOver = 0; //para que no me marque ningún boton
         }

         //id del usuario seguido al que vamos a seguir --> followed
         followUser(followed){
           //1º id --> vacio 2º -> usuario logeado 3º --> usuario a seguir
           var follow = new Follow('', this.identity._id, followed);

           this._followService.addFollow(this.token, follow).subscribe(
             response =>{

               if(!response.follow){
                 this.status ='error';
                 }else {
                   this.status ='success';
                   this.follows.push(followed); //añadimos un nuevo id a este array 
                                       //y de forma reactiva se cambian los botones
                                       //por en en el html tenemos un bucle del "follows"    
                 }

           },
           error =>{
                  var errorMessage = <any>error;
                  console.log(errorMessage);

                  if(errorMessage != null){
                  this.status ='error';
                }

           });

         }

         unfollowUser(followed){
           this._followService.deleteFollow(this.token, followed).subscribe(
             response =>{
               var search = this.follows.indexOf(followed);
                           
               if(search != -1){               
                 this.follows.splice(search, 1); //eliminamos el elemento encontrado del front
               }

             },
             error =>{
                  var errorMessage = <any>error;
                  console.log(errorMessage);

                  if(errorMessage != null){
                  this.status ='error';
                }
             });
         }



















}
