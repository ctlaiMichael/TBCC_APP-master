import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  title: string;
  content: string;
  btnTitle: string;

  promise: Promise<any>;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.ok = () => {
        resolve();
      };

    });
  }

  ngOnInit() {
  }

  ok() { }

}
