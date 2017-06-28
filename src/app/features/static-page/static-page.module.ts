import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

// shared
import { SharedModule } from '../../shared/shared.module';

// pages
import { StaticPageComponent } from './static-page.component'; 

//
// Affiche une page statique.
//

@NgModule({
  imports:      [ CommonModule, SharedModule ],
  declarations: [ StaticPageComponent ],
  exports:      [ StaticPageComponent ]
})
export class StaticPageModule { 
	// nop
}
