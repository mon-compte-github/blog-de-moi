import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import { BlogService, PostReference, PostSummary, PostDetails } from '../../services/blog.service';

import 'rxjs/add/operator/switchMap';

@Component({
	templateUrl: './post-details.component.html'
})
export class PostDetailsComponent implements OnInit {

	public post: PostDetails = null;

	public error: any = null;

	constructor(private route: ActivatedRoute, private blogService: BlogService) { }

	ngOnInit() {
		// observe l'url et charge l'article 
		// associé à la date fournie en paramètre
		this.route.params
			.switchMap((params: Params, index: number) => {
				// TODO assert that argument is a valid date
				const year  = +params['yyyy'];
				const month = +params['mm'];
				const day   = +params['dd'];

				return this.blogService.getPost(year, month, day)
					.catch(reason => { this.error = reason; return null; });
			})
			.subscribe(post => this.post = post);
	}

}
