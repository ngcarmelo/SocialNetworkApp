import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Para utilizar formularios y el  data binding:
import { FormsModule} from '@angular/forms';
//Para poder hacer peticiones ajax -antiguo
//import { HttpModule } from '@angular/http';

//Para poder hacer peticiones ajax -Actual
import { HttpClientModule } from '@angular/common/http';


//Para que funcionen las rutas importamos: (abajo tambien)
import { routing, appRoutingProviders} from './app.routing';

import { MomentModule} from 'angular2-moment';   //modulo para las fechas


import { AppComponent } from './app.component';
//Importamos componentes:
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { ProfileComponent } from './components/profile/profile.component';

//Aqui tambien indicamos los componentes, directivas, pipes:
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    PublicationsComponent,
    ProfileComponent
  ],
  imports: [     //cargar modulos
    BrowserModule,
    routing, 
    FormsModule, //
    HttpClientModule, //
    MomentModule  // Modulo para las fechas
  ],
  providers: [  //cargar servicios de forma global
  appRoutingProviders
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
