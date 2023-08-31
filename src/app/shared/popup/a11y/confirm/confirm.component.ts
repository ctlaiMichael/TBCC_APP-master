import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
  // providers:[NavgatorService]
})
export class ConfirmComponent implements OnInit {

  @ViewChild('confirmTitle', {read: ElementRef}) private confirmElementRef: ElementRef;

  promise: Promise<any>;
  title: string;
  content: string;
  btnYesTitle: string;
  btnNoTitle: string;
  param: any;

  u = navigator.userAgent;
  isAndroid = this.u.indexOf('Android') > -1 || this.u.indexOf('Adr') > -1;
  constructor(
    private elementRef: ElementRef,
    private navgatorService:NavgatorService
    
    ) {
    // let bodyEle = this.elementRef.nativeElement.querySelector('#bodyBox');
    // bodyEle.style.display="none";
    this.promise = new Promise((resolve, reject) => {
      this.yes = () => {
        // bodyEle.style.display="block";
        this.navgatorService.displayBodyBox(true);
        resolve();
      };

      this.no = () => {

        this.navgatorService.displayBodyBox(true);
        // bodyEle.style.display="block";
        reject();
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
        this.confirmElementRef.nativeElement.focus();
      },
      1000
    );
  }

  yes() {}
  no() {}
}
