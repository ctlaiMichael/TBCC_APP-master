import { Injectable } from '@angular/core';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { BannerDetail, Fb000503ResBody } from '@api/fb/fb000503/fb000503-res';
import { BannerDetails, Fb000503Req } from '@api/fb/fb000503/fb000503-req';
import { Fb000503ApiService } from '@api/fb/fb000503/fb000503-api.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { CommonUtil } from '@shared/util/common-util';

@Injectable()
export class BannerService {
  banners: BannerDetail[];
  bannerKey = 'banners';

  constructor(
    private localStorage: LocalStorageService,
    private sysParam: SystemParameterService,
    private fb000503: Fb000503ApiService
  ) {
    // 由localStorage取得已下載的banner;
    this.banners = localStorage.getObj(this.bannerKey) || [];

  }

  /**
   * 由SystemParameterService取得最新的Banner資訊
   */
  getServerBanners() {
    const details = this.sysParam.get('BannerDetails');
    if (!!details) {
      return details['BannerDetail'];
    }
  }

  /**
   * 取得預設Banner資訊
   */
  getBanners(): BannerDetail[] {
    return this.banners;
  }

  /**
   * 檢查Banner更新
   */
  checkBannerUpdate(): Promise<BannerDetail[]> {
    const serverBannerIds = this.getServerBanners();
    if (!serverBannerIds) {
      return CommonUtil.wait(1000)
        .then(() => this.checkBannerUpdate());
    }
    const newBannerIds = new BannerDetails();
    const updateBanner = [];
    for (let banner of serverBannerIds) {
      let ori = this.banners.find(b => b.BANNER_ID === banner.BANNER_ID);
      if (!!ori && !!ori.BANNER_IMG && !!ori.IMG_TYPE) {
        // 200323 修正連結更新
        ori['BANNER_URL'] = banner['BANNER_URL'];
        updateBanner.push(ori);
      } else {
        newBannerIds.addBanner(banner.BANNER_ID);
      }
    }
    // 有新的先取回資料
    if (!!newBannerIds.detail.length) {
      let form = new Fb000503Req();
      form.BannerDetails = newBannerIds;
      return this.fb000503.getData(form)
        .then(res => {
          for (let newBanner of res) {
            let target = serverBannerIds.find(b => b.BANNER_ID.indexOf(newBanner.BANNER_ID) == 0);
            target.BANNER_IMG = 'data:image/jpg;base64,' + newBanner.BANNER_IMG;
            target.IMG_TYPE = newBanner.IMG_TYPE;
            updateBanner.push(target);
          }
          this.localStorage.setObj(this.bannerKey, updateBanner);
          this.banners = updateBanner;

          return Promise.resolve(this.banners);
        });
    } else {
      this.localStorage.setObj(this.bannerKey, updateBanner);
      this.banners = updateBanner;
      return Promise.resolve(this.banners);
    }

    // this._logger.log('newBannerIds:', newBannerIds);
    // return Promise.resolve(this.banners);
  }



}
