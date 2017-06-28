import { NgModule, Pipe, PipeTransform } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';

import { MarkdownService, MarkdownComponent } from './markdown.component';

import { ErrorComponent } from './error.component';

//
// shared stuff
//

@Pipe({ name: 'kebabCase' })
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    if(!value || value.length == 0) {
      return '';
    }

    value = value.toLowerCase().replace(/\s+/g, '-');

    if(!String.prototype.normalize) {
      // normalize n'est pas supporté sous IE :'(
      value = this.plainAscii(value);
    } else {
      value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    return value;
  }

  // http://stackoverflow.com/a/17017595
  private plainAscii(str: string) : string {
    let r = str.toLowerCase();
    let non_asciis = {'a': '[àáâãäå]', 'ae': 'æ', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'oe': 'œ', 'u': '[ùúûűü]', 'y': '[ýÿ]'};
    for (let i in non_asciis) { r = r.replace(new RegExp(non_asciis[i], 'g'), i); }
    return r;
  }

}


@Pipe({ name: 'mapToIterable' })
export class MapToIterablePipe  implements PipeTransform {
  transform(dict: any): any[] {
    var a = [];
    Object.keys(dict).forEach((value, index) => {
      a.push({key: value, val: dict[value]});
    })
    return a;
  }
}


@NgModule({
  declarations: [
    MarkdownComponent,
    ErrorComponent,
    MapToIterablePipe,
    KebabCasePipe
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
  providers: [
    MarkdownService
  ],
  exports: [
    MarkdownComponent,
    ErrorComponent,
    MapToIterablePipe,
    KebabCasePipe
  ],
})
export class SharedModule {
  // nop
}
