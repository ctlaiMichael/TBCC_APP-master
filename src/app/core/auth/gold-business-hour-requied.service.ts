import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { FB000701ApiService } from '@api/fb/fb000701/fb000701-api.service';
import { FB000701ReqBody } from '@api/fb/fb000701/fb000701-req';
import { GoldCheck } from './gold-composite.guard';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';

@Injectable()
export class GoldBusinessHourRequied implements CanActivate {

  constructor(
    private fb000701: FB000701ApiService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const url: string = state.url; // 來源url

    return this.checkGoldBusinessHour(url);
  }

  async checkGoldBusinessHour(url: string): Promise<GoldCheck> {
    try {
      const form = new FB000701ReqBody();
      const fb000701res = await this.fb000701.getData(form);
      if (url === '/financial/goldPrice/gold' || this.inServiceTime()) {
        return { valid: true };
      } else {
        return {
          valid: false,
          title: 'GOLD.NOT_BUSINESS_HOUR.TITLE',
          content: 'GOLD.NOT_BUSINESS_HOUR.NOT_BUSINESS_HOUR'
        };
      }
    } catch (error) {
      // 未開市
      let err = {
        title: 'GOLD.NOT_BUSINESS_HOUR.TITLE',
        content: 'GOLD.NOT_BUSINESS_HOUR.CONTENT'
      };
      if (error instanceof HandleErrorOptions && error.resultCode !== 'K521') {
        err.content = error.content;
      }
      return {
        valid: false,
        ...err
      };
    }

  }

  inServiceTime(): boolean {
    const now = new Date();
    if (now.getUTCHours() + 8 > 15) {
      return false;
    } else if (now.getUTCHours() + 8 === 15) {
      return now.getUTCMinutes() < 30;
    } else {
      return true;
    }
  }
}
