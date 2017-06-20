import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ArchivedPostsComponent } from './archived-posts.component';

//
// routes
//

const appRoutes: Routes = [
	{	
		path: 'archives',
		component: ArchivedPostsComponent
	},
	{	
		path: 'archives/:year',
		component: ArchivedPostsComponent
	}
];

//
// module def
//

@NgModule({
	imports: [ RouterModule.forChild(appRoutes) ],
	exports: [ RouterModule ]
})
export class ArchivedPostsRoutingModule { 
	// nop
}
