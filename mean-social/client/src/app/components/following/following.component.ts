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

//Clase para el listado de usuarios seguidos
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
	public following;
	public status: string;
	public userPageId;

  constructor(
  	private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService, //Variable del servicio UserService
    private _followService: FollowService

    ) {
    this.title ='Usuarios seguidos por';
    this.url = GLOBAL.url;
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
 }

  ngOnInit() {
  	  	console.log("following.component ha sido cargado");

  	  	this.actualPage();

  }


 actualPage(){
    //Así lo hacemos para recoger los parametros recibidos por url de la propia pagina
    this._route.params.subscribe(params =>{

      let user_id = params['id'];

      this.userPageId = user_id; //para la paginacion

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
     this.getUser(user_id, page);


    });

  }


  getFollows(user_id, page){
  	//id->id del usuario que queremos ver su listado de a quien sigue
    this._followService.getFollowing(this.token, user_id, page).subscribe(
      response =>{
      	  
        if(!response.follows){
          this.status='error';
        }else {
           console.log(response);
         this.total = response.total;
         this.following = response.follows;
         this.pages = response.pages;
         //a quienes seguimos:
         this.follows = response.users_following;
        // console.log(this.follows);
        
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
 
 	//de quien son los seguidores? --> entonces este metodo
  public user: User;
  getUser(user_id, page){

  	this._userService.getUser(user_id).subscribe(
  		response=>{
  			if(response.user){
  				this.user = response.user;
  				  //Devolver listado de  usuarios
  				   this.getFollows(user_id, page);
  			}else{

  				this._router.navigate(['/home']);
  			}
  			
  		},
  		error =>{
  			 var errorMessage = <any>error;
        console.log(errorMessage);

         if(errorMessage != null){
          this.status ='error';
        }
  		}


  		);
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
