import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @ViewChild('alertTitle', {read: ElementRef}) private alertElementRef: ElementRef;

  title: string;                   
  content: string;
  btnTitle: string;

  promise: Promise<any>;
  
  u = navigator.userAgent;
  isAndroid = this.u.indexOf('Android') > -1 || this.u.indexOf('Adr') > -1;
  constructor(
    private navgatorService:NavgatorService
  ) {
    this.promise = new Promise((resolve, reject) => {
      this.ok = () => {
        this.navgatorService.displayBodyBox(true);
        resolve();
      };

    });
  }

  ngOnInit() {
    if(!this.title || this.title==''){
      this.title = 'POPUP.CONFIRM.TITLE';
    }
  }

  ngAfterViewInit() {
    this.navgatorService.displayBodyBox(false);
    setTimeout(
      () => {
        this.alertElementRef.nativeElement.focus();
      },
      1000
    );
  }

  ok() { }

}
