import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { logger } from '@shared/util/log-util';
import { GoldBusinessHourRequied } from './gold-business-hour-requied.service';
import { GoldacctRequired } from './goldacct-required.service';
import { GoldactiveRequired } from './goldactive-required.service';
import { GoldbuyacctRequired } from './goldbuyacct-required.service';

export interface GoldCheck {
  valid: boolean;
  title?: string;
  content?: string;
}

@Injectable()
export class GoldCompositeGuard implements CanActivate {
  constructor(
    private _handleError: HandleErrorService,
    private navigator: NavgatorService,
    private goldacctRequired: GoldacctRequired,
    private goldactiveRequired: GoldactiveRequired,
    private goldbuyacctRequired: GoldbuyacctRequired,
    private goldBusinessHourRequied: GoldBusinessHourRequied
  ) { }

  private route: ActivatedRouteSnapshot;
  private state: RouterStateSnapshot;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    this.route = route;
    this.state = state;

    if (!(!!route.data && !!route.data.guards)) {
      return Promise.resolve(true);
    }
    return this.executeGuards();
  }

  private async executeGuards(): Promise<boolean> {
    const guards: Array<Promise<GoldCheck>> = [];
    this.route.data.guards.forEach(guardKey => {
      guards.push(this.activateGuard(guardKey));
    });
    let value = await Promise.all(guards);
    logger.log(`gold guard result`, value);
    let ok = false;
    for (let i = 0; i < value.length; i++) {
      if (!value[i].valid) {
        await this._handleError.handleError(
          {
            title: value[i].title,
            content: value[i].content
          }
        );
        this.navigator.push('gold-business'); // 導回黃金存摺menu頁
        break;
      } else if (i == value.length - 1) {
        ok = true;
      }
    }
    logger.log(`ok`, ok);
    return ok;
  }

  private activateGuard(guardKey: string): Promise<GoldCheck> {
    switch (guardKey) {

      case 'GoldacctRequired':
        return this.goldacctRequired.canActivate(this.route, this.state);

      case 'GoldactiveRequired':
        return this.goldactiveRequired.canActivate(this.route, this.state);

      case 'GoldbuyacctRequired':
        return this.goldbuyacctRequired.canActivate(this.route, this.state);

      case 'GoldBusinessHourRequied':
        return this.goldBusinessHourRequied.canActivate(this.route, this.state);

      default:
        return Promise.resolve(
          {
            valid: false,
            title: 'ERROR.TITLE',
            content: 'ERROR.DEFAULT' // 很抱歉，發生未預期的錯誤！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。
          }
        );
    }
  }

}
