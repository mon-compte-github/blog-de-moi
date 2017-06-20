import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { PostDetailsComponent } from './post-details.component'; 

//
// routes
//

const appRoutes: Routes = [
	{	
		path: 'published/:yyyy/:mm/:dd',
		component: PostDetailsComponent
	}
];

//
// module def
//

@NgModule({
	imports: [ RouterModule.forChild(appRoutes) ],
	exports: [ RouterModule ]
})
export class PostDetailsRoutingModule { 
	// nop
}
