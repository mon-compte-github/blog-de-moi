import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';

import { BlogService, PostSummary } from '../../services/blog.service';

@Component({
	templateUrl: './archived-posts.component.html'
})
export class ArchivedPostsComponent implements OnInit {

	// la liste des années d'archivage avec
	// pour chacune le nombre d'articles
	public archives: { [year : number] : number};

	// la liste des articles
	public posts: PostSummary[] = [];

	// l'année "active"
	public currentYear: number = 0;

	constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService) { }

	ngOnInit() {

		/*
		// chargement de la liste des catégories
		this.blogService.getArchiveIndex()
			.then(archives => this.archives = archives);
			// TODO .catch(e => ...) 

		this.route.url.subscribe((segments) => {
			
			// l'année a changé ...
			let year = (new Date()).getFullYear();
			if(segments.length == 2) {
				year = +segments[1].path;
			}

			this.blogService.getArchivedPosts(year)
				.then(posts => this.posts = posts);
				// TODO .catch(e => ...)
		});

		// ... et des post les + récents
		this.blogService.getArchivedPosts(year)
			.then(posts => this.posts = posts);
			// TODO .catch(e => ...)
		*/

	}

}
