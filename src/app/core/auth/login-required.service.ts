import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { logger } from '@shared/util/log-util';

@Injectable()
export class LoginRequired implements CanActivate {

  constructor(
    private authService: AuthService,
    private headerCtrl: HeaderCtrlService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn()||sessionStorage.getItem("login_method")=='2') { return true; }

    // 儲存現在的 URL，這樣登入後可以直接回來這個頁面
    this.authService.redirectUrl = url;
    this.localStorageService.set('redirectUrl', url);
    // 導回登入頁面
    this.headerCtrl.setOption({
      'style': 'login',
      'leftBtnIcon': ''
    });
    this.router.navigate(['/login']);
    return false;
  }

}
