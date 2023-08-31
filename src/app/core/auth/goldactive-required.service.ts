import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { FB000703ApiService } from '@api/fb/fb000703/fb000703-api.service';
import { FB000703ReqBody } from '@api/fb/fb000703/fb000703-req';
import { GoldCheck } from './gold-composite.guard';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';

@Injectable()
export class GoldactiveRequired implements CanActivate {

  constructor(
    private authService: AuthService,
    private fb000703: FB000703ApiService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const url: string = state.url;

    return this.checkGoldActive(url);
  }

  async checkGoldActive(url: string): Promise<GoldCheck> {
    const userData = this.authService.getUserInfo();

    try {
      const form = new FB000703ReqBody();
      form.custId = userData.custId;
      const fb000703res = await this.fb000703.send(form);
      if (!!fb000703res.body.goldTxFlag && fb000703res.body.goldTxFlag === '1') {
        return {
          valid: true
        };
      } else {
        return {
          valid: false,
          title: 'GOLD.ACTIVATION_STATUS.TITLE',
          content: 'GOLD.ACTIVATION_STATUS.NOT_ACTIVE'
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
        title: 'GOLD.ACTIVATION_STATUS.TITLE',
        content: 'GOLD.ACTIVATION_STATUS.NOT_ACTIVE'
      };
    }
  }

}
