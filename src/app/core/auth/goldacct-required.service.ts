import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { FB000705ApiService } from '@api/fb/fb000705/fb000705-api.service';
import { FB000705ReqBody } from '@api/fb/fb000705/fb000705-req';
import { GoldCheck } from './gold-composite.guard';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';

@Injectable()
export class GoldacctRequired implements CanActivate {

  constructor(
    private authService: AuthService,
    private fb000705: FB000705ApiService,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const url: string = state.url;

    return this.checkGoldAcct(url);
  }

  async checkGoldAcct(url: string): Promise<GoldCheck> {
    const userData = this.authService.getUserInfo();
    if (!!userData.goldAcct && userData.goldAcct === 'Y') {
      this.authService.setGoldAcct('Y');
      return { valid: true };
    }

    try {
      const form = new FB000705ReqBody();
      form.queryType = '1';
      const fb000705res = await this.fb000705.getData(form);
      // if (!!fb000705res.body.goldAcctsList.detail && fb000705res.body.goldAcctsList.detail.length > 0) {
      if (!!fb000705res[1] && fb000705res[1].length > 0) {
        this.authService.setGoldAcct('Y');
        return { valid: true };
      } else {
        return {
          valid: false,
          title: 'GOLD.NO_GOLDACCT.TITLE',
          content: 'GOLD.NO_GOLDACCT.CONTENT'
        };
      }
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
        content: 'GOLD.NO_GOLDACCT.CONTENT'
      };
    }
  }

}
