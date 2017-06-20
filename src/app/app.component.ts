import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationStart }   from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor(private router: Router, private activeRoute:  ActivatedRoute) {
		// nop
  	}

	public showMenu(): void {
		location.hash = "#nav-wrap";
		event.preventDefault();
	}

	public hideMenu(): void {
		location.hash = "";
		event.preventDefault();
	}

}