import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { FB000705ApiService } from '@api/fb/fb000705/fb000705-api.service';
import { FB000705ReqBody } from '@api/fb/fb000705/fb000705-req';
import { GoldCheck } from './gold-composite.guard';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
// 檢查黃金買入/定期定額是否有台幣扣款帳號
@Injectable()
export class GoldbuyacctRequired implements CanActivate {

  constructor(
    private fb000705: FB000705ApiService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const url: string = state.url;

    return this.checkGoldAcct(url);
  }

  async checkGoldAcct(url: string): Promise<GoldCheck> {

    try {
      const form = new FB000705ReqBody();
      form.queryType = '2';
      const fb000705res = await this.fb000705.getData(form);
      if (!(!!fb000705res.body && !!fb000705res.body.trnsfrAccts &&
        !!fb000705res.body.trnsfrAccts.detail && fb000705res.body.trnsfrAccts.detail.length > 0)) {
        return {
          valid: false,
          title: 'POPUP.ALERT.TITLE',
          content: 'PG_TRANSFER.ERROR.TRNSOUTACCT_2' // 您尚未設定約定轉出帳號，請洽本行營業單位辦理。
        };
      }
      return { valid: true };
    } catch (error) {
      if (error instanceof HandleErrorOptions && !(!!error.resultCode && error.resultCode === '112A')) {
        return {
          valid: false,
          title: error.title,
          content: error.content
        };
      }
      return {
        valid: false,
        title: 'GOLD.NO_GOLDACCT.TITLE',
        content: 'PG_TRANSFER.ERROR.TRNSOUTACCT_2' // 您尚未設定約定轉出帳號，請洽本行營業單位辦理。
      };
    }
  }

}
