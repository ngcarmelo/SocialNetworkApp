import { Component, OnInit, DoCheck  } from '@angular/core';

@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
	public title: string;

  constructor() {
  this.title ='Enviar mensaje';
   }

  ngOnInit() {
  	console.log('add.component.cargado');
  }

}
