import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
	public title:string;
  public identity;


  constructor(
    private _userService: UserService
    ) {
  	this.title ='Bienvenido a NGSocial';
   }

  ngOnInit() {
  	console.log('El componente home se ha cargado!!');
    this.identity = this._userService.getIdentity();

  }

}
