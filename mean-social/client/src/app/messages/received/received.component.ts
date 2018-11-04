import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css']
})
export class ReceivedComponent implements OnInit {
	public title: string;

  constructor() { 
   this.title ='Mensajes Recibidos';
}

  ngOnInit() {
  	console.log('received.component.cargado');
  }

}
