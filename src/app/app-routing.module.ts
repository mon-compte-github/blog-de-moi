import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

// pages
//import { NotFoundComponent } from './xxx/not-found.component';

//
// routes
//

const appRoutes: Routes = [
	{
		path: '',
		redirectTo: 'recent',
		pathMatch: 'full'
	}
	/*
	{
	  path: '**',
	  component: NotFoundComponent
	}
	*/
];

//
// module def
//

@NgModule({
	imports: [ RouterModule.forRoot(appRoutes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { 
	// nop
}
