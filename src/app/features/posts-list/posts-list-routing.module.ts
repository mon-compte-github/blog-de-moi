import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { PostsListComponent } from './posts-list.component';

//
// routes
//

const appRoutes: Routes = [
	{	
		path: 'recent',
		component: PostsListComponent
	},
	/*{	
		path: 'popular',
		component: PostsListComponent
	},*/
	{	
		path: 'categorized/:category',
		component: PostsListComponent
	},
	{	
		path: 'tagged/:tag',
		component: PostsListComponent
	}
];

//
// module def
//

@NgModule({
	imports: [ RouterModule.forChild(appRoutes) ],
	exports: [ RouterModule ]
})
export class PostsListRoutingModule { 
	// nop
}
