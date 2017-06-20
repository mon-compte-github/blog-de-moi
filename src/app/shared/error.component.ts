
import { Component, OnChanges, Input, SimpleChanges} from '@angular/core';

import { Response } from '@angular/http';

@Component({
  selector: 'app-error',
  styles: [`
	.error {
		text-align: center;
	}

	.error > h1 {
		font-size: 180pt;
		line-height: 200pt;
	}

	.error > p {
		font-size: 2em;
	}
  `],
  template: `
  	<div *ngIf="message" class="error">
	<h1>Oups!</h1>
	<p>{{ message }}</p>
	<p><a style="cursor: pointer;" routerLink="/recent">Retour à l'accueil ?</a></p>
	</div>`
})
export class ErrorComponent implements OnChanges {

	@Input()
	public reason: any = null;

	public message: string = null;

	ngOnChanges(changes: SimpleChanges) : void {
		if(changes['reason'].currentValue == null) {
			this.message = null;
		} else if(changes['reason'].currentValue instanceof Response) {
			const status = (changes['reason'].currentValue as Response).status;
			if(status == 404) {
				this.message = 'La page demandée n\'existe pas ...';
			} else {
				this.message = 'Le serveur n\'a pas répondu (' + status + ')';
			}
		} else if(changes['reason'].currentValue instanceof String) {
			this.message = (changes['reason'].currentValue as string);
		} else {
			this.message = 'Une erreur est survenue lors du chargement de la page :-S';
		}
	}

}
