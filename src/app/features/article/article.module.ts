import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }  from '@angular/router';

// pages
import { ArticleComponent } from './article.component'; 

// shared
import { SharedModule } from '../../shared/shared.module';

//
// Affiche un article
//

@NgModule({
  imports:      [ CommonModule, RouterModule, SharedModule ],
  declarations: [ ArticleComponent ],
  exports:      [ ArticleComponent ]
})
export class ArticleModule { 
	// nop
}
