import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ContactMeComponent } from './contact-me.component'; 

//
// routes
//

const appRoutes: Routes = [
	{	
		path: 'contact',
		component: ContactMeComponent
	}
];

//
// module def
//

@NgModule({
	imports: [ RouterModule.forChild(appRoutes) ],
	exports: [ RouterModule ]
})
export class ContactMeRoutingModule { 
	// nop
}
