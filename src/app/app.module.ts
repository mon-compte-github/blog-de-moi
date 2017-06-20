import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// app container
import { AppComponent } from './app.component';

// routes
import { AppRoutingModule } from './app-routing.module';

// features
import { PostsListModule } from './features/posts-list/posts-list.module';
import { PostDetailsModule } from './features/post-details/post-details.module';
//import { ArchivedPostsModule } from './features/archived-posts/archived-posts.module';
//import { ContactMeModule } from './features/contact-me/contact-me.module';
import { ArticleModule } from './features/article/article.module';
import { TellMeWhyModule } from './features/tell-me-why/tell-me-why.module';
import { SharedModule } from './shared/shared.module';

// services
import { BlogService } from './services/blog.service';

// https://blog.feedly.com/10-ways-to-optimize-your-feed-for-feedly/

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // core modules
    BrowserModule,
    RouterModule,
    FormsModule,
    HttpModule,
    // app modules
    PostsListModule,
    PostDetailsModule,
    //ArchivedPostsModule,
    //ContactMeModule,
    ArticleModule,
    TellMeWhyModule,
    SharedModule,
    // routes
    AppRoutingModule,
  ],
  providers: [
    BlogService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
