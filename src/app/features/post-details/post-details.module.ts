import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// routing
import { PostDetailsRoutingModule } from './post-details-routing.module';

// pages
import { PostDetailsComponent } from './post-details.component'; 

// shared modules
import { ArticleModule } from '../article/article.module';
import { SharedModule } from '../../shared/shared.module';

//
// Affiche les posts les plus récents récents.
//

@NgModule({
  imports:      [ CommonModule, FormsModule, PostDetailsRoutingModule, ArticleModule, SharedModule ],
  declarations: [ PostDetailsComponent ]
})
export class PostDetailsModule {
	// nop
}
