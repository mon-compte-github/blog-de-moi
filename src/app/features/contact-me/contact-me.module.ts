import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';

// routing
import { ContactMeRoutingModule } from './contact-me-routing.module';

// pages
import { ContactMeComponent } from './contact-me.component'; 

//
// Affiche le formulaire de contact.
//

@NgModule({
  imports:      [ CommonModule, FormsModule, ContactMeRoutingModule ],
  declarations: [ ContactMeComponent ],
  exports:      [  ]
})
export class ContactMeModule { 
	// nop
}
