import { Component, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';

import * as marked from 'marked';

declare var Prism: any;
import 'prismjs/prism';

import 'prismjs/components/prism-bash.min';
import 'prismjs/components/prism-c.min';
import 'prismjs/components/prism-java.min';
import 'prismjs/components/prism-cpp.min';
import 'prismjs/components/prism-http.min';
import 'prismjs/components/prism-php.min';
import 'prismjs/components/prism-css.min';
import 'prismjs/components/prism-sql.min';
import 'prismjs/components/prism-json.min';
import 'prismjs/components/prism-typescript.min';

//
// Internal stuff
//

@Injectable()
export class MarkdownService {

  // marked renderer
  private renderer: any;

  // base for telative urls
  private baseUrl: string;

  // http://stackoverflow.com/a/19709846
  private absoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
  
  constructor() {

    // capture this
    const thiz = this;

    this.renderer = new marked.Renderer();

    this.renderer.image = function (href, title, text) {
      // /!\ "this" is the renderer, not the angular component
      if(thiz.baseUrl != null) {
        if(thiz.absoluteUrl.test(href) === false) {
          href = thiz.baseUrl + href;
        }
      }
      // call initial implementation
      return marked.Renderer.prototype.image.call(this, href, title, text);
    }

    this.renderer.listitem = function(text:string) {
      if (/^\s*\[[x ]\]\s*/.test(text)) {
      text = text
        .replace(/^\s*\[ \]\s*/, '<input type="checkbox" style=" vertical-align: middle; margin: 0 0.2em 0.25em -1.6em; font-size: 16px; " disabled> ')
        .replace(/^\s*\[x\]\s*/, '<input type="checkbox" style=" vertical-align: middle; margin: 0 0.2em 0.25em -1.6em; font-size: 16px; " checked disabled> ');
          return '<li style="list-style: none">' + text + '</li>';
        } else {
          return '<li>' + text + '</li>';
        }
      };

    // https://www.npmjs.com/package/marked
    marked.setOptions({
       renderer: this.renderer,
       gfm: true,
       tables: true,
       breaks: false,
       pedantic: false,
       sanitize: false,
       smartLists: true,
       smartypants: false
     });

  }

  /**
   * Set base url for relative image location.
   * @param url The base url.
   */
  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Compile markdown to html.
   */
  public compile(data:string) {
    return marked(data);
  }

}

//
// Component
//

@Component({
  selector: 'markdown',
  template: '<ng-content></ng-content>',
  styles: [
    /*`.token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
      background: none;
    }`*/
  ]
})
export class MarkdownComponent {
    
  constructor(private el: ElementRef, private service: MarkdownService) {
    // nop
  }

  /**
   * Must be defined before data.
   */
  @Input()
  set base(value: string) {
    this.service.setBaseUrl(value);
    // should recompile template ...
  }

  @Input()
  set data(value: string) {
    this.el.nativeElement.innerHTML = this.service.compile(value);
    // le highlighting asynchrone ne semble pas fonctionner ?!?
    Prism.highlightAll(false);
  }

  /**
   *  After view init
   */
  ngAfterViewInit() {
    let md = this.el.nativeElement.innerHTML;
    this.el.nativeElement.innerHTML = this.service.compile(md);
    Prism.highlightAll(false);
  }

}

// EOF
