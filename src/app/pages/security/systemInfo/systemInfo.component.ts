import { Component, OnInit } from '@angular/core';
import { DeviceService } from '@lib/plugins/device.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { logger } from '@shared/util/log-util';
import { environment } from '@environments/environment';
import { Tels } from '@conf/tel';
import { NavgatorService } from '@core/navgator/navgator.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
@Component({
  selector: 'app-system-info',
  templateUrl: './systemInfo.component.html',
  styleUrls: ['./systemInfo.component.css']
})
export class SystemInfoComponent implements OnInit {

  deviceInfo = {
    platform: '',
    appversion: '',
    name: '',
    udid: '',
    new_udid: '',
    server_path: ''
  };
  constructor(
    private _deviceService: DeviceService,
    private _handleError: HandleErrorService,
    private confirm: ConfirmService,
    private navgator: NavgatorService,
    private uiContentService: UiContentService
  ) { }

  ngOnInit() {

    this.getDeviceInfo();

  }

  getDeviceInfo() {
    if (!environment.PRODUCTION) {
      this.deviceInfo.server_path = environment.SERVER_URL;
    }

    this._deviceService.devicesInfo().then(
      (getInfo_S) => {

        if (getInfo_S.hasOwnProperty('appinfo') && !!getInfo_S.appinfo) {
          this.deviceInfo.appversion = getInfo_S.appinfo.version + '(' + getInfo_S.appinfo.subVersion + ')';
        }

        if (getInfo_S.hasOwnProperty('platform') && !!getInfo_S.platform) {
          this.deviceInfo.platform = getInfo_S.platform;
        }
        if (getInfo_S.hasOwnProperty('hostname') && !!getInfo_S.hostname) {
          this.deviceInfo.name = getInfo_S.hostname;
        }
        if (getInfo_S.hasOwnProperty('uuid') && !!getInfo_S.uuid) {
          this.deviceInfo.udid = getInfo_S.uuid;
        }
        if (getInfo_S.hasOwnProperty('udid') && !!getInfo_S.udid) {
          this.deviceInfo.new_udid = getInfo_S.udid;
        }

      },
      (getInfo_F) => {
        this._handleError.handleError(getInfo_F);
        logger.debug(getInfo_F);
      }

    );

  }

  callService() {
    let tel = {
      name: '',
      show_tel: '',
      tel: ''
    };
    if (!!Tels.custServiceTel) {
      tel = Tels.custServiceTel;
    }

    // this.confirm.show(msg,
    //   { title: '外撥提醒' }).then(
    //     () => {
    //       location.href = 'tel:+886-4-22273131';
    //     }, () => { });

    this.confirm.show('POPUP.TELPHONE.TEL_NOTICE', {
      title: 'POPUP.TELPHONE.TEL_TITEL',
      contentParam: {
        telName: tel.name,
        telnumber: tel.tel
      }
    }).then(
      (res) => {
        window.open('tel:' + tel.tel);
      },
      (error) => { });
  }

  //------------20190916 Boy 加入-----------//
  // 導覽說明
  goTour(type) {
    if (type !== 'guide') {
      this.uiContentService.setGuide('home', '0');
      this.uiContentService.setGuide('user-home', '0');
      this.navgator.push('home');
    } else {
      this.uiContentService.setGuide('guide', '0');
      this.navgator.push('guide');
    }
  }

}
