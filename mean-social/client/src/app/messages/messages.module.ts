//Modulos necesarios
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Para utilizar formularios y el  data binding:
import { FormsModule} from '@angular/forms';

//Para que funcionen las rutas importamos: (abajo tambien)
import { MessagesRoutingModule} from './messages-routing.module';


//Componentes
import { MainComponent } from './main/main.component';
import { AddComponent } from './add/add.component';
import { ReceivedComponent } from './received/received.component';
import { SendedComponent } from './sended/sended.component';

import { MomentModule} from 'angular2-moment';   //modulo para las fechas

//Servicios  **necesarios para utilizar guards
import { UserService } from '../services/user.service';
import { UserGuard } from  '../services/user.guard';


@NgModule({

 declarations: [
   MainComponent,
   AddComponent, 
   ReceivedComponent,
   SendedComponent
   ],

  imports: [
    CommonModule,
    FormsModule,
    MessagesRoutingModule, //rutas
    MomentModule,  // Modulo para las fechas
  ],
   exports: [
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SendedComponent
  ],
    providers: [  //cargar servicios de forma global
    UserService,
    UserGuard
    ]
 
})
export class MessagesModule { }
