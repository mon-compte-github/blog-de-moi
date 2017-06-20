import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// routing
import { ArchivedPostsRoutingModule } from './archived-posts-routing.module';

// pages
import { ArchivedPostsComponent } from './archived-posts.component'; 

// shared modules
import { ArticleModule } from '../article/article.module';
import { SharedModule } from '../../shared/shared.module';

//
// Affiche les posts les plus récents récents.
//

@NgModule({
  imports:      [ CommonModule, FormsModule, ArchivedPostsRoutingModule, ArticleModule, SharedModule ],
  declarations: [ ArchivedPostsComponent ],
  exports:      [  ]
})
export class ArchivedPostsModule { 
	// nop
}
