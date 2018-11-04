import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css']
})
export class SendedComponent implements OnInit {
	public title: string;

  constructor() { 
 	this.title ='Enviar mensaje';
  }

  ngOnInit() {
  		console.log('sended.component.cargado');
  }

}
