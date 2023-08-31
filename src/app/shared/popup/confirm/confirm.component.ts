import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  promise: Promise<any>;
  title: string;
  content: string;
  btnYesTitle: string;
  btnNoTitle: string;
  param: any;

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
