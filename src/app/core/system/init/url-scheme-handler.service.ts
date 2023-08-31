import { Injectable } from '@angular/core';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { CommonUtil } from '@shared/util/common-util';
import { NavgatorService } from '@core/navgator/navgator.service';
import { logger } from '@shared/util/log-util';

@Injectable()
export class UrlSchemeHandlerService {

  constructor(
    private session: SessionStorageService,
    private navCtrl: NavgatorService
  ) { }

  /**
   * 由外部呼叫執行uriScheme
   * @param url urlScheme
   */
  executeScheme(url: string) {
    const inited = this.session.get('init');
    // 等待初始完成
    if (!!inited && inited === 'Y') {
      logger.debug('execute scheme...');
      this.execute(url);
    } else {
      CommonUtil.wait(1000).then(() => {
        logger.debug('executeScheme waiting...');
        this.executeScheme(url);
      });
      return;
    }
  }

  /**
   * 執行url scheme處理
   * @param scheme
   */
  execute(scheme: string) {

    // modify chengwie for 投資了才導頁190916
    // TODO decode && redirect
    let schemeTitle = scheme.substr(0, scheme.indexOf(':'));
    let schemeData = scheme.substr(scheme.indexOf('?') + 1, scheme.length);
    logger.debug('schemeTitle', schemeTitle);
    logger.debug('schemeData', schemeData);
    let urlObj = {
      url: scheme,
      schemeData: schemeData
    };
    switch (schemeTitle) {
      case 'iTCBLaunchFromATM':
        this.navCtrl.push('matm-back', {}, urlObj);
        break;
      case 'iTCBMobileBank':
        let url = scheme.split('://');
        let nowPage = this.navCtrl.getHistory()[this.navCtrl.getHistoryLength() - 1];

        let nextUrlName = '';
        if (url[1] === 'qrcodeShowPayFromHome') {
          nextUrlName = 'qrcodeShowPay';
        } else {
          nextUrlName = url[1]; // qrcodeShowReceipt or epayscan
        }

        if (nowPage === 'epay' || nowPage === 'qrcodeShowPayFromHome') {
          this.navCtrl.push('user-home', { 'nextUrl': nextUrlName });
        } else {
          let paramData = this.navCtrl.getUriParams(scheme);
          //console.log('_Cheng_goPage_URL_1', paramData);
          if (paramData.param.hasOwnProperty('path')) {
            this.navCtrl.push(paramData.param['path'], paramData.param);
          } else {
            this.navCtrl.push(url[1], { 'nextUrl': nextUrlName });
          }
        }
        break;
      case 'twqrp-00601':
        const twqrpUrl = scheme.split('://')[1];
        this.navCtrl.push('epayscan', { urlParams: twqrpUrl, from: 'Url' });
        break;
    }
    logger.debug('scheme:', scheme);
    // return scheme;
  }
}
