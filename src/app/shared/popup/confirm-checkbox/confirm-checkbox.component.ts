import { Component, OnInit } from '@angular/core';
import { logger } from '@shared/util/log-util';
@Component({
  selector: 'app-confirm-checkbox',
  templateUrl: './confirm-checkbox.component.html',
  styleUrls: ['./confirm-checkbox.component.css']
})
export class ConfirmCheckBoxComponent implements OnInit {
  promise: Promise<any>;
  title: string;
  content: string;
  btnYesTitle: string;
  btnNoTitle: string;
  param: any;
  checkbox:any;
  checkStatus:any=false;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.yes = () => {
        resolve({
          checked:this.checkStatus
        });
      };

      this.no = () => {
        reject({
          checked:this.checkStatus
        });
      };
    });
  }

  ngOnInit() {
  }

  yes() {}
  no() {}
}
