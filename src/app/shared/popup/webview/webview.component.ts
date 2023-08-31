import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-webview',
  templateUrl: './webview.component.html',
  styleUrls: ['./webview.component.css']
})
export class WebviewComponent implements OnInit {

  frameUrl: SafeResourceUrl;
  promise: Promise<any>;
  btnYesTitle: string;
  btnNoTitle: string;
  url: string;
  title: string;

  constructor(private sanitizer: DomSanitizer) {
    this.promise = new Promise((resolve, reject) => {
      this.yes = () => {
        resolve();
      };
      this.no = () => {
        reject();
      };
    });
  }

  ngOnInit() {
    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  yes() { }
  no() { }

}
