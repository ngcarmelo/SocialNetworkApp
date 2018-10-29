import { Component, OnInit, Input } from '@angular/core';
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
  selector: 'publications',
  templateUrl: './publications.component.html',
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {
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
  //Porque vamos a recibir una propiedad desde fuera del componente:
  @Input() user: string;


  constructor(
  	private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
    ) { 
  			this.title ='Publications';
  			this.identity = this._userService.getIdentity();
  			this.token  = this._userService.getToken();
  			this.url = GLOBAL.url;
        this.page =1;
  		
  }

   ngOnInit() {
  	console.log('publications.component cargado correctamente');
    this.getPublications(this.user, this.page);
  }
    //el user se refiere al id
  getPublications(user, page, adding = false){
      this._publicationService.getPublicationsUser(this.token, user, page).subscribe(response =>{
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

             $("html,body").animate({scrollTop: $('html').prop('scrollHeight')}, 500);
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

    this.page += 1; // sumamos una pagina a la actual
   
    // Si la pagina actual es la ultima
      if(this.page == (this.page)){
        this.noMore = true; //significa que ya no podemos mostrar mas publicaciones (final del array)
      }

      this.getPublications(this.user, this.page, true);
  }


}
