import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

// routing
import { TellMeWhyRoutingModule } from './tell-me-why-routing.module';

// shared
import { SharedModule } from '../../shared/shared.module';
import { StaticPageModule } from './../static-page/static-page.module'; 

// pages
import { TellMeWhyComponent } from './tell-me-why.component'; 

//
// Affiche le formulaire de contact.
//

@NgModule({
  imports:      [ CommonModule, TellMeWhyRoutingModule, SharedModule, StaticPageModule ],
  declarations: [ TellMeWhyComponent ]
})
export class TellMeWhyModule { 
	// nop
}
