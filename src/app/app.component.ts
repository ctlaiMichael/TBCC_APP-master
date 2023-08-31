import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, NgZone } from '@angular/core';
// For Test
// import { Observable } from 'rxjs/Observable';
import { Logger } from '@core/system/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';


// import { F1000101ApiService } from '@api/f1/f1000101/f1000101-api.service';
// import { F1000101ReqBody } from '@api/f1/f1000101/f1000101-req';
import { SplashScreenService } from '@lib/plugins/splash-screen.service';
import { InitService } from '@core/system/init/init.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { A11yService } from '@lib/plugins/a11y.service';

import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { logger } from '@shared/util/log-util';
import { LoadingSpinnerService } from '@core/layout/loading/loading-spinner.service';
import { UrlSchemeHandlerService } from '@core/system/init/url-scheme-handler.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';
// import { DeviceService } from '@lib/plugins/device.service';
// import { CryptoService } from '@lib/plugins/crypto.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { AuthService } from '@core/auth/auth.service';

(window as any).handleOpenURL = (url: string) => {
  (window as any).handleOpenURL_LastURL = url;
};
(window as any).onShortcutEvent = (url) => {
  (window as any).onShortcutEvent_LastURL = url.data;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @ViewChild('bodyBox', { read: ElementRef }) bodyBox: ElementRef; // body區塊
  @ViewChild('cloneBox', { read: ElementRef }) cloneBox: ElementRef; // body區塊
  @ViewChild('scanBox', { read: ElementRef }) scanBox: ElementRef; // body區塊
  // For Test
  title = 'app';
  appMode = { isA11y: false, backNormal: false };
  isA11y = false;
  // For Test
  // data$: Observable<any>;
  urlParams = {}; // 頁面轉換之網址
  constructor(
    private ngZone: NgZone,
    private log: Logger,
    private translate: TranslateService,
    private splashScreen: SplashScreenService,
    private initService: InitService,
    private a11yservice: A11yService,
    private systemparameter: SystemParameterService,
    private urlSchemeHandler: UrlSchemeHandlerService,
    private navCtrl: NavgatorService,
    private loading: LoadingSpinnerService,
    private sessionStorageService: SessionStorageService,
    private _localStorage: LocalStorageService,
    private auth: AuthService
    // private testApi: F1000101ApiService
    // private deviceInfo: DeviceService,
    // private crypto: CryptoService,
  ) {
    translate.setDefaultLang('zh-tw');
    (window as any).handleOpenURL = (url: string) => {
      // this context is called outside of angular zone!
      setTimeout(() => {
        // so we need to get back into the zone..
        this.ngZone.run(() => {
          // this is in the zone again..
          this.sessionStorageService.set('UrlSheme', url);
          this.urlSchemeHandler.executeScheme(url);
        });
      }, 0);
    };
    (window as any).onShortcutEvent = (url) => {
      // this context is called outside of angular zone!
      setTimeout(() => {
        // so we need to get back into the zone..
        this.ngZone.run(() => {
          // this is in the zone again..
          this.urlSchemeHandler.executeScheme(url.data);
        });
      }, 0);
    };
  }

  /**
   * 設定顯示Clone畫面
   * @param display 是否顯示
   */
  displayCloneBox(display: boolean) {
    logger.log('clone view');
    if (display) {
      this.cloneBox.nativeElement.appendChild(this.bodyBox.nativeElement.cloneNode(true));
      this.cloneBox.nativeElement.style.display = 'inherit';
      this.bodyBox.nativeElement.style.display = 'none';
      this.loading.show('pageInit');
    } else {
      if (typeof this.cloneBox.nativeElement.childNodes[0] !== 'undefined') {
        this.cloneBox.nativeElement.removeChild(this.cloneBox.nativeElement.childNodes[0]);
      }
      this.bodyBox.nativeElement.style.display = 'inherit';
      this.cloneBox.nativeElement.style.display = 'none';
      this.loading.hide('pageInit');
    }
  }

/**
   * 設定顯示Barcode scan畫面
   * @param display 是否顯示
   */
  displayBodyBox(display: boolean) {
    if (display) {
      // this.scanBox.nativeElement.appendChild(this.bodyBox.nativeElement.cloneNode(true));
      this.bodyBox.nativeElement.style.visibility = 'visible';
    } else {
      // this.scanBox.nativeElement.removeChild(this.scanBox.nativeElement.childNodes[0]);
      this.bodyBox.nativeElement.style.visibility = 'hidden';
    }
  }

  /**
   * 設定顯示Barcode scan畫面
   * @param display 是否顯示
   */
  displayScanBox(display: boolean) {
    logger.log('scan view');
    if (display) {
      // this.scanBox.nativeElement.appendChild(this.bodyBox.nativeElement.cloneNode(true));
      this.scanBox.nativeElement.style.display = 'inherit';
      this.bodyBox.nativeElement.style.display = 'none';
    } else {
      // this.scanBox.nativeElement.removeChild(this.scanBox.nativeElement.childNodes[0]);
      this.bodyBox.nativeElement.style.display = 'inherit';
      this.scanBox.nativeElement.style.display = 'none';
    }
  }

  ngOnInit() {

    if (!this._localStorage.getObj('appMode')) {
      logger.debug('Fisrt start to setting default appMode...');

       this.a11yservice.isA11yTurnOn().then((resObj) => {
         if (resObj) {
           logger.debug('Accessibility is Enable');
           this.appMode.isA11y = true;
           this.isA11y = true;
           this._localStorage.setObj('appMode', this.appMode);
           logger.debug('Default appMode is ', this.appMode);
           this.navCtrl.push('a11yhomekey');

         } else {
           logger.debug('Default appMode is ', this.appMode);
           this._localStorage.setObj('appMode', this.appMode);
         }
	   });

    } else {
      logger.debug('Setting appMode...');
      this.appMode = this._localStorage.getObj('appMode');
      logger.debug('AppMode is ', this.appMode);

      this.isA11y = this.appMode.isA11y;
      logger.debug('A11y falg is', this.isA11y);
    }

    if (this.appMode.isA11y) {
      logger.debug('Redirect to Accessibility Mode...');
      this.navCtrl.push('a11yhomekey');

    } else if (!this.appMode.isA11y && this.appMode.backNormal) {
      this.appMode.backNormal = false;
      this._localStorage.setObj('appMode', this.appMode);
      this.navCtrl.push('home');
    }

    this.splashScreen.hide();
    this.initService.init();
    this.navCtrl.displayScanBoxSubject.subscribe((display: boolean) => {
      this.displayScanBox(display);
    });
    this.navCtrl.displayCloneBoxSubject.subscribe((display: boolean) => {
      this.displayCloneBox(display);
    });
    this.navCtrl.displayBodyBoxSubject.subscribe((display: boolean) => {
      this.displayBodyBox(display);
    });
    

    // 補切換功能時登入資訊miss
    if (this.auth.isLoggedIn()) {
      this.auth.tmpUserInfoInit();
    }
    // For Test
    // const form = new F1000101ReqBody();
    // this.testApi.send(form).then((res) => console.log('res', res)).catch(err => console.error(err));
    // this.data$ = this.httpClient.get('https://jsonplaceholder.typicode.com/posts/1');

    // // plugin test
    // this.deviceInfo.devicesInfo().then(
    //   (res) => { console.log('deviceinfo:' + JSON.stringify(res)); }
    //   , (err) => { console.log(err); }
    // );
    // // plugin test
    // this.crypto.AES_Encrypt('session', '123ABC456abc').then(
    //   (res) => { console.log('AES_Encrypt:' + JSON.stringify(res)); }
    //   , (err) => { console.log(err); }
    // );
  }
}
