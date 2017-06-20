import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';

import { BlogService, PostSummary } from '../../services/blog.service';

// TODO mutualiser avec le composant  qui affiche les archives

@Component({
	templateUrl: './posts-list.component.html'
})
export class PostsListComponent implements OnInit {

	// la liste des catégories
	public categories: { [name: string] : number };

	// la liste des articles
	public posts: PostSummary[] = [];

	public error: any = null;

	//
	//
	//

	constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService) { 
		// nop
	}

	public ngOnInit() {

		// chargement de la liste des catégories
		// seront affichées dans la barre latérale
		// en cas d'erreur ... ben on n'affiche rien
		this.blogService.getCategories()
			.then(categories => this.categories = categories)
			.catch(reason => { console.log(reason); });

		// ce composant gère plusieurs url
		// est-ce la bonne méthode ?!?

		let result: Promise<PostSummary[]> = null;

	    this.route.url.subscribe((segments) => {
	    	
	    	// segments est un tableau d'instances de UrlSegment
	    	// chaque élemente représente un segment de l'url
	    	// ex : /categorized/hacking -> [ 'categorized, hacking '] 

	    	if(segments[0].path == 'recent') {
	    		result = this.blogService.getRecentPosts();

	    	//} else if(segments[0].path == 'popular') {
	    	//	result = this.blogService.getPopularPosts();

	    	} else if(segments[0].path == 'categorized') {
	    		const category = segments[1].path;
	    		result = this.blogService.getCategorizedPosts(category);

	    	} else if(segments[0].path == 'tagged') {
	    		const tag = segments[1].path;
	    		result = this.blogService.getTaggedPosts(tag);

	    	} else {
	    		// on ne devrait pas pouvoir arriver ici ...
	    		this.router.navigate(['/recent']);
	    		return;
	    	}

	    	result.then(posts => this.posts = posts)
				.catch(reason => this.error = reason);
	        
	    });

	}

}
