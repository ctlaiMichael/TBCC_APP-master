import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Timer } from '@shared/util/timer.class';

@Component({
  selector: 'app-auto-logout',
  templateUrl: './auto-logout.component.html',
})
export class AutoLogoutComponent implements OnInit {

  @ViewChild('autoLogoutTitle', {read: ElementRef}) private autoLogoutElementRef: ElementRef;

  promise: Promise<any>;
  timeBomb: Timer;
  deadline: number;
  remainingTime: number;
  param: any;

  u = navigator.userAgent;
  isAndroid = this.u.indexOf('Android') > -1 || this.u.indexOf('Adr') > -1;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.yes = () => {
        // 繼續使用
        this.timeBomb.stop();
        resolve();
      };

      this.no = () => {
        // 登出
        this.timeBomb.stop();
        reject();
      };
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(
      () => {
        this.autoLogoutElementRef.nativeElement.focus();
      },
      1000
    );
  }

  yes() { }
  no() { }

  start() {
    this.remainingTime = this.deadline;
    this.param = {
      second: this.remainingTime.toString()
    };
    const self = this;
    this.timeBomb = new Timer(this.deadline, function () {
      self.no();
    }, function (idle) {
      self.timeInterval(idle);
    });
  }

  timeInterval(idle: number) {
    this.remainingTime = this.deadline - idle;
    this.param = {
      second: this.remainingTime.toString()
    };
  }
}
