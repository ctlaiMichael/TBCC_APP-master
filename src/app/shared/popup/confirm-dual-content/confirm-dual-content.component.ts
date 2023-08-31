import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm-dual-content.component.html',
  styleUrls: ['./confirm-dual-content.component.css']
})
export class ConfirmDualContentComponent implements OnInit {
  promise: Promise<any>;
  title: string;
  content: string;
  btnYesTitle: string;
  btnNoTitle: string;
  param: any;
  titleSecond: string;
  contentSecond: string;
  paramSecond: string;

  constructor() {
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
  }

  yes() {}
  no() {}
}
