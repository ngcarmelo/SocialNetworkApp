//Modulos
import { NgModule } from '@angular/core'; 
import { Routes, RouterModule} from '@angular/router';

//Componentes
import { MainComponent } from './main/main.component';
import { AddComponent } from './add/add.component';
import { ReceivedComponent } from './received/received.component';
import { SendedComponent } from './sended/sended.component';

//Importamos el guard
import { UserGuard } from  '../services/user.guard';



const messagesRoutes: Routes = [
	{
		path: 'mensajes',
		 component: MainComponent,
		 children: [
		 		{ path: '', redirectTo: 'recibidos', pathMatch: 'full'}, //para que haga la redirección completa
		 		{path: 'enviar', component: AddComponent,  canActivate:[UserGuard]},
		 		{path: 'recibidos', component: ReceivedComponent,  canActivate:[UserGuard]},
		 		{path: 'recibidos/:page', component: ReceivedComponent,  canActivate:[UserGuard]},
		 		{path: 'enviados', component: SendedComponent,  canActivate:[UserGuard]},
		 		{path: 'enviados/:page', component: SendedComponent,  canActivate:[UserGuard]}
		 ]	

		}
	
];

@NgModule({
	imports: [
		RouterModule.forChild(messagesRoutes)
	],

	exports: [
	 RouterModule
	]
})

 export class MessagesRoutingModule{}