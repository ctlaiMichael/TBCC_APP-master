import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { InAppBrowserOption } from './in-app-browser-option';
import { InAppBrowserConfirm } from './in-app-browser-confirm';
import { Sites } from '@conf/external-web';
import { environment } from '@environments/environment';
declare var cordova: any;

import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { logger } from '@shared/util/log-util';

@Injectable()
export class InAppBrowserService extends CordovaService {

  constructor(
    private confirm: ConfirmService
  ) {
    super();
  }

  isLoggedIn() {
    if (!!sessionStorage.userInfo) {
      const userInfo = JSON.parse(sessionStorage.userInfo);
      return !!userInfo.custId && !!userInfo.userId;
    }
    return false;
  }

  /**
   * 以設定方式開啟網頁
   * @param web 網頁設定檔
   */
  openWeb(sitesName: string) {
    const web = Sites[sitesName];
    if (!web) {
      logger.debug('sitesName not find:' + sitesName);
      return false;
    }
    if (!!web.loginRequired && !this.isLoggedIn()) {
      return 'loginRequired';
    }
    logger.debug('open site:' + sitesName);
    if (environment.NATIVE) {
      return this.open(web.url, web.target, web.option, web.confirmOptions);
    } else {
      window.open(web.url);
      return true;
    }


  }

  private showConfirm(confirmPopup: InAppBrowserConfirm): Promise<any> {
    const confirmOpt = new ConfirmOptions();
    confirmOpt.btnNoTitle = '取消';
    confirmOpt.btnYesTitle = '確認';
    confirmOpt.title = (!!confirmPopup.title) ? confirmPopup.title : 'POPUP.NOTICE.TITLE';
    return this.confirm.show(confirmPopup.context, confirmOpt).then(() => {
      return;
    }).catch(() => {
      return Promise.reject('');
    });
  }

  /**
   * 開啟網址
   * @param url 開啟網址
   * @param target 開啟方式_self(本身)/_blank(InApp)/_system(系統)
   * @param options 其他設定
   */
  open(url: string, target: string, options?: InAppBrowserOption, confirmPopup?: InAppBrowserConfirm) {
    if (target === '_self') {
      window.location.replace(url);
      return Promise.resolve();
    }
    return this.onDeviceReady
      .then(() => {
        if (!!confirmPopup && !!confirmPopup.context) {
          return this.showConfirm(confirmPopup);
        } else {
          return;
        }
      })
      .then(() => {
        logger.debug('open :', url, target);
        if (environment.NATIVE) {
          return cordova.InAppBrowser.open(url, target, 'enableViewportScale=yes,closebuttoncaption=X');
        } else {
          window.open(url);
          return true;
        }
      }).catch(() => {
        return;
      });
  }

  /**
   * InApp方式開啟網址
   * @param url 開啟網址
   * @param options 其他設定
   */
  innAppOpen(url: string, options?: InAppBrowserOption) {
    return this.open(url, '_blank', options);
  }

  /**
   * oout App方式開啟網址
   * @param url 開啟網址
   * @param options 其他設定
   */
  outAppOpen(url: string, options?: InAppBrowserOption) {
    return this.open(url, '_system', options);
  }

}
