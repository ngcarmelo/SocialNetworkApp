//Modulos necesarios

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { MainComponent } from './main/main.component';
import { AddComponent } from './add/add.component';
import { ReceivedComponent } from './received/received.component';
import { SendedComponent } from './sended/sended.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MainComponent, AddComponent, ReceivedComponent, SendedComponent]
})
export class MessagesModule { }
