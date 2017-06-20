import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { TellMeWhyComponent } from './tell-me-why.component'; 

//
// routes
//

const appRoutes: Routes = [
	{	
		path: 'tell-me-why',
		component: TellMeWhyComponent
	}
];

//
// module def
//

@NgModule({
	imports: [ RouterModule.forChild(appRoutes) ],
	exports: [ RouterModule ]
})
export class TellMeWhyRoutingModule { 
	// nop
}
