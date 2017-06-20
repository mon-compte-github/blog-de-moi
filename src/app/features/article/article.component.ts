import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { BlogService, PostSummary, PostDetails } from '../../services/blog.service';

import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const UNSPLASH_BASE_URL = 'https://unsplash.com/photos/';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit {

	@Input()
	public post: PostSummary | PostDetails = null

	public content: string = null;

	constructor(private http: Http, private blogService: BlogService) { }

	public ngOnInit() {
		// nop
	}

	public ngOnChanges(changes: SimpleChanges) {
		if(changes['post']) {
			this.blogService.loadArticle(this.post)
				.then(content => { this.content = content; })
				.catch(error => { this.content = 'Erreur de chargement :-S' });
		}
	}	

	public isFull(): boolean {
		return (this.post instanceof PostDetails);
	}

	public howManyDays(d: Date): string | Date {
		let today: number = Date.now();
		let millis = (today - d.getTime());
		if(millis > 0) {
			let days = Math.floor(millis / (24*60*60*1000));
			if(days == 0) {
				return 'aujourd\'hui';
			} else if(days == 1) {
				return 'hier';
			} else if(days == 2) {
				return 'avant hier';
			} else if(days < 15) {
				return `il y a ${days} jours`;
			}
		}
		return 'le ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() ;
	}

	// renvoie le lien vers l'image unsplash originale
	// son nom local est l'id de la photo sur le site
	public unsplashUrl() {
		return UNSPLASH_BASE_URL + this.post.image;
	}

	// renvoie le lien pour naviguer vers l'article
	// (celui fourni en param ou celui en variable membre)
	public link(post?: PostSummary) : string {
		return this.blogService.getPostUrl(post ? post : this.post);
	}

	// renvoie le lien pour accéder à une ressource de l'article
	// si pas de ressource demandée, renvoie l'url racine d'accès
	public res(ressource?: string): string {
		return this.blogService.getPostResourceUrl(this.post, ressource || '');
	}

}
