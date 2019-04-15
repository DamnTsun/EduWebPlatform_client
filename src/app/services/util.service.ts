// Declare DOMPurify (non-angular JS library used).
// *Technically* not necessary, however the text-editor will complain if not included.
declare var DOMPurify: any;

import { Injectable } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private mdService: MarkdownService
  ) { }

  /**
   * Gets route param without the ':' at the start. ':subjectid' => 'subjectid', etc.
   */
  public getRouteParamName(param: string): string {
    if (param.charAt(0) !== ':') { return param; }
    return param.substring(1, param.length);
  }


  /**
   * Get ISO time for given timestamp and converts it to format that api accepts (yyyy-mm-dd hh:mm:ss).
   * @param date - timestamp.
   */
  public getIsoTimeFormatted(date: Date) {
    // JS method gives format yyyy-mm-ddThh:mm:ss.xxxZ
    // Split on 'T'
    let isoTimeFrags = date.toISOString().split('T');
    // Split 2nd frag on '.'.
    let time = isoTimeFrags[1].split('.')[0];
    return `${isoTimeFrags[0]} ${time}`;
  }



  /**
   * Converts incoming markdown into HTML, then sanitizes it.
   * @param markdown - Markdown to be sanitized.
   */
  public sanitizeMarkdown(markdown: string): string {
    // Parse markdown into potentially unsafe HTML.
    let html = this.mdService.compile(markdown);
    // Sanitize the HTML and return it.
    return DOMPurify.sanitize(html);
  }
}
