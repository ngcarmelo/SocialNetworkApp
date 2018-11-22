import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//Importacion del modelo de usuario: (Importacion de la clase user)
import { User } from '../../models/user';
import { Follow } from '../../models/follow';

//Importamos el servicio, donde están los metodos
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';

import {GLOBAL} from '../../services/global';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  providers: [UserService, FollowService]  //Declaramos el servicio
})
export class ProfileComponent implements OnInit {
	public title: string;
	public user: User;
	public status: string;
	public identity;
	public token;
	public stats;
	public url;
	public following; 
	public followed;


  constructor(
  	private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService) {

  	this.title = 'Perfil';
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
  	this.url = GLOBAL.url;

  	 this.following = false; 
  	 this.followed = false;

     }

  ngOnInit() {
  	console.log('profile.component cargado correctamente!!');
  	this.loadPage();
  }

  
  loadPage(){
  	//capturamos el id de la url
  	this._route.params.subscribe(params =>{
  		let id = params['id'];

  		this.getUser(id);
  		this.getCounters(id);
  	});

  	
  }

  getUser(id){
  	this._userService.getUser(id).subscribe(
  		response =>{

  			if(response.user){
  				console.log(response);
  				this.user = response.user;

  				if(response && response.following && response.following._id){
  					this.following = true;
  				}
  				else {
  					this.following = false;
  				}

  				if(response &&  response.followed &&  response.followed._id){
  				this.followed = true;
  				}
  				else {
  					this.followed = false;
  				}


  			}else{
  				this.status ='error';
  								
  			}
  		},
  		error =>{
  			console.log(<any> error);
  			this._router.navigate(['/perfil', this.identity._id]);
  		}
  		);
  }


  getCounters(id){
  	this._userService.getCounters(id).subscribe(
  		response =>{
  			console.log(response);
  			//valor equivocado??
  			this.stats = response;

  		},
  		error =>{
  				console.log(<any>error);

  		});
  }

  //boton de seguir
  followUser(followed){
  	//introducios nuestro id y al que vamos a seguir
  	var follow = new Follow('', this.identity._id, followed);

  	this._followService.addFollow(this.token, follow).subscribe(
  		response =>{
  			this.following = true;

  		},
  		error =>{

  			console.log(<any> error);
  		}
  		);


  }

  unfollowUser(followed){
  	this._followService.deleteFollow(this.token, followed).subscribe(
  		response =>{
  			this.following = false;
  		},
  		error =>{
  			console.log(<any>error);
  		}

  		);


  }
  //Efecto botones
  public followUserOver;
  mouseEnter(user_id){
  	this.followUserOver = user_id;
  	  }

  mouseLeave(){
  	 this.followUserOver = 0;
  }


}
