import { Component, OnInit } from '@angular/core';

import { BlogService } from '../../services/blog.service';


// modélise le formulaire
class Form {
	// fields
	public name: string = null;
	public email: string = null;
	public message: string = null;
	// state 
	public success: boolean = null;
	public disabled: boolean = false;
}

@Component({
  selector: 'app-contact-me',
  templateUrl: './contact-me.component.html'
})
export class ContactMeComponent implements OnInit {

	public form: Form = new Form();

	constructor(private blogService: BlogService) { }

	ngOnInit() {
		// nop
	}

	public onSubmit(): void {
		this.form.disabled = true;
		this.blogService.sendMessage(this.form.name, this.form.email, this.form.message)
			.then(() => {
				// on ne réactive pas le bouton
				// pour éviter le spam :-p
				this.form.success = true;
			})
			.catch(reason => {
				this.form.success = false;
				this.form.disabled = false;
				/* TODO */
			})
	}

}
