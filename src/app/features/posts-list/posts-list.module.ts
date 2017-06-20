import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// routing
import { PostsListRoutingModule } from './posts-list-routing.module';

// pages
import { PostsListComponent } from './posts-list.component'; 

// modules
import { ArticleModule } from '../article/article.module';
import { SharedModule } from '../../shared/shared.module';

//
// Affiche les posts les plus récents récents.
//

@NgModule({
  imports:      [ CommonModule, FormsModule, PostsListRoutingModule, ArticleModule, SharedModule ],
  declarations: [ PostsListComponent ]
})
export class PostsListModule { 
	// nop
}
