/**
 * 基本Date常用pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';



/**
 * HTML處理 (可加style)
 */
@Pipe({
    name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}

