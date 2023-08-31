import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Injectable()
export class LogoutRequired implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private navigator: NavgatorService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    return this.checkNotLogin(url);
  }

 checkNotLogin(url: string): boolean {
    if (!this.authService.isLoggedIn()) { return true; }
      if (this.authService.checkUserType('card')) {
        // this.navigator.push('epay');
        this.authService.setUserInfo_card();
        // this.navigator.push('pay-va-card');
        this.navigator.push('epay-card');
      } else {
        // 導回登入頁面
        this.navigator.push('user-home');    
      } 
    // this.router.navigate(['/user-home']);
    return false;
  }

}
