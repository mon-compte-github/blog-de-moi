import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  templateUrl: './tell-me-why.component.html'
})
export class TellMeWhyComponent implements OnInit {

	public content: string = null;

	constructor(private http: Http) { }

	ngOnInit() {
		console.log('TellMeWhy');
		return this.http.get('pages/tell-me-why/page.md').toPromise()
			.then(response => response.text() as string)
		    .then(content => this.content = content);
		    // TODO catch(error)
	}

}
