import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';

//
// Helpers
//

function twoDigits(num: number): string {
  let str = '' + num;
  while(str.length < 2) {
        str = '0' + str;
      }
    return str;
}

//
// Classes
//

/**
 * Contient les détails sur post précédent ou suivant.
 * Permettent de naviguer vers ce post.
 */
export class PostReference {
	// date au format yyyy-mm-dd
	readonly published: Date;
	readonly title: string;

	constructor(published: Date, title: string) {
		this.published = published;
		this.title = title;
	}

}

/**
 * Contient les informations minimales sur un article.
 * Permet de les afficher en liste.
 */
export class PostSummary extends PostReference {
	
	readonly excerpt: string;
	readonly image: string;
	readonly category: string;
	readonly tags: string[];
	
	constructor(published: Date, title: string, excerpt: string, image: string, category: string, tags: string[]) {
		super(published, title);
		this.excerpt = excerpt;
		this.category = category;
		this.image = image;
		this.tags = tags;
	}

}

/**
 * Contient les infos complètes sur un article.
 * Permet un affichage détaillé avec navigation.
 */
export class PostDetails extends PostSummary {

	// TODO ces attributs devraient être readonly
	public next: PostReference = null;
	public previous: PostReference = null;

}

//
// Service definition
// 


@Injectable()
export class BlogService {

	private categories: { [name: string] : number } = null;

	private postsList: PostSummary[] = null;

	constructor(private http: Http) { }

	/*
	 * API
	 */

	// en cas d'erreur http, on récupère une instance de Reponse avec
    // un boolean (ok) qui indique si la requête est un succès,
    // le code de statut http (status), le contenu de la réponse (_body)
    // et les headers (headers)

	/**
	 * Renvoie la liste des catégories avec pour
	 * chacune le nombre de posts attachés.
	 * Les stocke en cache pour les appels suivants.
	 * @return La liste des catégories
	 */
	getCategories(): Promise<{ [name: string] : number }> {
		// déjà en cache ?
		if(this.categories) {
			return Promise.resolve(this.categories);
		}

		let temp: { [name: string] : number } = {};
		
		const url = this.getDatastoreUrl('categories.json');
		return this.http.get(url).toPromise()
			.then(response => response.json() as any[])
			.then(items => {
				items.forEach(item => { temp[item['cat']] = +item['nb'] });
				return temp;
			});
	}

	/**
	 * TBD
	 */ 
	getRecentPosts(): Promise<PostSummary[]> {
		return this.load('/recent.json');
	}

	/**
	 * TBD
	 */
	/*
	getPopularPosts(): Promise<PostSummary[]> {
		return Promise.resolve([]);
	}
	*/

	/**
	 * TBD
	 */ 
	getCategorizedPosts(category: string): Promise<PostSummary[]> {
		return this.load('/categories/' + category + '.json');
	}

	/**
	 * TBD
	 */ 
	getTaggedPosts(tag: string): Promise<PostSummary[]> {
		return this.load('/tags/' + tag + '.json');
	}

	/**
	 * TBD
	 */
	/*
	getArchiveIndex(): Promise<{[year: number] : number}> {
		return Promise.resolve({});
	}
	*/

	/**
	 * TBD
	 */
	/*
	getArchivedPosts(year: number): Promise<PostSummary[]> {
		return Promise.resolve([]);
	}
	*/
	
	/**
	 * TBD
	 */
	public getPost(year: number, month: number, day: number): Promise<PostDetails> {
		// récupère les infos détaillées sur l'article
		// pour pouvoir réutiliser l'UrlService, on doit
		// construire une mytho instance de PostReference
		// TODO reconstituer les liens next/previous
		let ref: PostReference = new PostReference(new Date(year, (month - 1), day), 'dummy');
		const url = this.getPostResourceUrl(ref, 'metas.json');
		return this.http.get(url).toPromise()
			.then(response => this.toPostDetails(response.json()))
			.then(post => this.setNavigationLinks(post));
	}

	/*
	 * TBD
	 */
	public sendMessage(name: string, email: string, message: string) : Promise<any> {
		return new Promise(resolve => {
			setTimeout(resolve, 500);
		}).then(() => {});
	}

	/**
	 * Construit l'url permettant d'accéder à un article.
	 * C'est une url de navigation, contrairement aux autres.
	 * @param post L'article concerné.
	 * @return L'url relative.
	 */
	public getPostUrl(post: PostReference): string {
		return `/published/${this.yymmdd(post)}`;
	}

	/**
	 * Renvoie l'url permettant d'accéder à un fichier de données.
	 * @param filename Le nom du fichier (json).
	 * @return L'url d'accès au fichier.
	 */
	public getDatastoreUrl(filename: string): string {
		// window.location.protocol !== 'https:'
		return this.getBaseUrl() + `/articles/${filename}`;
	}

	/**
	 * Renvoie l'url permettant d'accéder aux ressources d'un article.
	 * @param post L'article conerné par la demande.
	 * @param res Le nom de la ressource (peut être un chemin relatif).
	 * @return L'url complète vers la ressource.
	 */
	public getPostResourceUrl(post: PostReference, ressource: string): string {
		return this.getBaseUrl() + `/articles/${this.yymmdd(post)}/${ressource}`;
	}

	/**
	 * Charge un article.
	 */
	 public loadArticle(post: PostSummary | PostDetails) : Promise<string> {
	 	let url = this.getPostResourceUrl(post, 'article.md');
	 	return this.http.get(url).toPromise()
       		.then(response => response.text() as string);
	} 

	//
	// Helpers
	//

	private getBaseUrl() : string {
		// on gère à l'arrache les deux protocoles (http et https)
		return environment.baseUrl.replace(/^http:/, window.location.protocol);
	}

	/**
	 * Charge une liste d'articles.
	 */
	private load(filename: string): Promise<PostSummary[]> {
		const url = this.getDatastoreUrl(filename);
		return this.http.get(url).toPromise()
			.then(response => response.json() as any[])
			.then(instances => instances.map(instance => this.toPostSummary(instance)))
			// TODO n'afficher que les publiés
		    // .then(instances => instances.filter(instance => instance.published <= new Date()))
		    // on mméorise la liste en cache pour pouvoir
		    // rétablir les liens next/previous lors du
		    // chargment de détail d'un post 
		    .then(instances => this.postsList = instances);
	}

	/**
	 * Met en place les lien next/previous
	 * en fonction de la liste active (aucune
	 * si on arrive diorectement sur le post).
	 */
	private setNavigationLinks(post: PostDetails): PostDetails {

		// les posts sont ordonnés par ordre chronologique
		// les plus récents en premiers, les plus vieux ensuite
		if(this.postsList) {
			// recherche du post dans la list
			// merci les pollyfills es6 :-)
			// mais en cas d'échec la fonction
			// renvoie -1 au lieu de undefined
			// et la comparaison des deux dates
			// avec === renvoie false ?!?
			var index: number = this.postsList.findIndex(item => (item.published.getTime() == post.published.getTime()));
			if(index > 0) {
				post.next = new PostReference(this.postsList[index-1].published, this.postsList[index-1].title);
			}
			if(index != -1 && index < this.postsList.length - 1) {
				post.previous = new PostReference(this.postsList[index+1].published, this.postsList[index+1].title);
			}
		}
		return post;
	}

	/**
	 * Renvoie la date du post au format « yyyy/mm/dd ».
	 */
	private yymmdd(post: PostReference): string {
		const d = post.published;
		const year = d.getFullYear();
		const month = d.getMonth();
		const day = d.getDate();

		return `${year}/${twoDigits(month+1)}/${twoDigits(day)}`;
	}

	//
	// Marshallers
	//

	private parseLocalDatetime(s) {
		// le constructeur « new Date(format_iso) »
		// peut renvoyer de l'UTC ou pas selon
		// la version de js et/ou le navigateur
		let ds = s.split(/\D/).map(s => parseInt(s));
		return new Date(ds[0], ds[1]-1, ds[2], ds[3], ds[4], ds[5]);
	}

	private toPostReference(obj: any) : PostReference {
		return new PostReference(
			this.parseLocalDatetime(obj['published']), obj['title']
		);
	}

	/**
	 * Déserialise les infos réduites sur un article.
	 * @param obj L'objet à déserialiser.
	 * @return une instance de PostSummary.
	 * 
	 */
	private toPostSummary(obj: any) : PostSummary {
		return new PostSummary(
			this.parseLocalDatetime(obj['published']),
			obj['title'],
			obj['excerpt'],
			obj['image'],
			obj['category'],
			obj['tags']
		);
	}

	private toPostDetails(obj: any) : PostDetails {
		const post: PostDetails = new PostDetails(
			this.parseLocalDatetime(obj['published']),
			obj['title'],
			obj['excerpt'],
			obj['image'],
			obj['category'],
			obj['tags']
		);
		if(obj['previous']) {
			post.previous = this.toPostReference(obj['previous']);
		}
		if(obj['next']) {
			post.next = this.toPostReference(obj['next']);
		}
		return post;
	}

}
