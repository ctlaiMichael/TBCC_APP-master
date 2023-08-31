import { Component, OnInit } from '@angular/core';
import { LEFT_MENU } from '@conf/menu/left-menu';
import { AuthService } from '@core/auth/auth.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { DeviceService } from '@lib/plugins/device.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {
  menu = LEFT_MENU;
  version = '';
  isLogin: boolean;
  checkFinish: boolean;
  subscriptDisplayNavSliderFrame: any;
  subscriptSetCheckFinishStatus: any;
  constructor(
    private deviceInfo: DeviceService,
    public auth: AuthService,
    private headerCtrl: HeaderCtrlService
  ) {
    this.deviceInfo.devicesInfo().then(device => this.setVersion(device.appinfo));
    this.isLogin = this.auth.isLoggedIn();
  }

  ngOnInit() {
    this.subscriptDisplayNavSliderFrame = this.headerCtrl.displayNavSliderFrameSubject.subscribe((value: any) => {
      this.isLogin = this.auth.isLoggedIn();
    });
    this.subscriptSetCheckFinishStatus = this.headerCtrl.checkFinishSubject.subscribe((checkFinish: boolean) => {
      this.checkFinish = checkFinish;
    });
  }

  /**
   * 設定版號
   * @param version 版號
   */
  setVersion(appinfo: any) {
    this.version = appinfo.version + '(' + appinfo.subVersion + ')';
  }
}
