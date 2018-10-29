import { Component, OnInit } from '@angular/core';
//para poder acceder a los parametros que recibamos de esta url y redirecciones:
import { Router, ActivatedRoute, Params } from '@angular/router';
//Importacion del modelo de usuario: (Importacion de la clase user)
import { Publication } from '../../models/publication';
import {GLOBAL} from '../../services/global';
//Importamos el servicio, donde están los metodos
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
//Declarar variables para usar jquery
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  providers: [UserService, PublicationService]  //Declaramos el servicio
  
})
export class TimelineComponent implements OnInit {
	public identity;
	public token;
	public title: string;
	public url: string;
  public status: string;
  public page; //pagina actual
  public total;  //total de elementnos
  public pages;   //numero de paginas
  public itemsPerPage;
  public publications:Publication[];



  constructor(
  	private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
    ) { 
  			this.title ='Timeline';
  			this.identity = this._userService.getIdentity();
  			this.token  = this._userService.getToken();
  			this.url = GLOBAL.url;
        this.page =1;
  		
  }

  ngOnInit() {
  	console.log('timeline.component cargado correctamente');
    this.getPublications(this.page);
  }

  // getPublications(page){
  //     this._publicationService.getPublications(this.token, page).subscribe(response =>{
  //        console.log(response);
  //        if(response.publications){
  //          this.total = response.total_items;
  //          this.pages = response.pages;
  //          //Listado de publicaciones: (array)
  //          this.publications = response.publications;
  //          if(page > this.pages){
  //            this._router.navigate(['/home']);
  //          }
  //        }else{
  //          this.status ='error';
  //        }
  //     },
  //     error=>{
  //          var errorMessage = <any> error;
  //               console.log(errorMessage);

  //               if(errorMessage != null){
  //                this.status = 'error';
  //               }
  //     });
  // }


getPublications(page, adding = false){
      this._publicationService.getPublications(this.token, page).subscribe(response =>{
         console.log(response);
         if(response.publications){
           this.total = response.total_items;
           this.pages = response.pages;
           this.itemsPerPage = response.items_per_page;
           //Listado de publicaciones: (array)
           
           if(!adding){
           this.publications = response.publications;
           }else{
             var arrayA = this.publications; //array de publicaciones con lo que tenga
             var arrayB = response.publications; //nuevo array que me devuelve el api
             this.publications = arrayA.concat(arrayB);

             $("html,body").animate({scrollTop: $('body').prop('scrollHeight')}, 500);
           }
                    


           if(page > this.pages){
            // this._router.navigate(['/home']);
           }


         }else{
           this.status ='error';

         }

      },
      error=>{
           var errorMessage = <any> error;
                console.log(errorMessage);

                if(errorMessage != null){
                 this.status = 'error';
                }


      });

  }
  public noMore = false;
  viewMore(){
    // Hasta que llegemos a la ultima pagina, final del array
    
       this.page += 1; // le sumamos una pagina a la actual
      if(this.page == (this.pages)){ //pagina actual es la ultima
               this.noMore = true; //significa que ya no podemos mostrar mas publicaciones (final del array)
      }
      this.getPublications(this.page, true);
  }

  //Evento output del sidebar
  refresh(event){
   // console.log(event);
   this.getPublications(1);
  }










}
