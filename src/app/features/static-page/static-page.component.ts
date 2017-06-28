import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'app-page',
	templateUrl: './static-page.component.html'
})
export class StaticPageComponent implements OnInit {

	@Input()
	public page: string = null

	public content: string = null;

	constructor(private http: Http) { }

	ngOnInit() {
		// nop
	}

	public ngOnChanges(changes: SimpleChanges) {
		if(changes['page']) {
			return this.http.get('pages/' + changes['page'].currentValue + '/page.md').toPromise()
				.then(response => response.text() as string)
		    	.then(content => this.content = content);
		}
	}	

}
