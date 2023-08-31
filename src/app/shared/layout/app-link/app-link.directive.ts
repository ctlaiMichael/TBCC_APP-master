import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';

@Directive({
  selector: '[appLink]'
})
export class AppLinkDirective {

  constructor(
    private navgator: NavgatorService,
    private auth: AuthService
    ) { }

  @Input('appLink') appLink: string;
  /**
   * 當appLink = back, params為目標路徑
   * 若其他路徑則為參數傳入下一頁
   */
  @Input() params: any;
  @Input() urlParams: any;

  @HostListener('click', ['$event']) onClick($event) {
    if (this.appLink === '/home' || this.appLink === 'home') {
      this.navgator.home(); // 回首頁
    } else if (this.appLink === 'logout') {
      this.auth.logout(); // 登出
    } else if (this.appLink === 'back') {
      this.navgator.pop(); // 回上一頁
    } else if (this.appLink === 'backTo') {
      this.navgator.popTo(this.params); // 回到某頁(若此路徑末在history則會回到首頁)
    } else {
      this.navgator.push(this.appLink, this.params, this.urlParams); // 前往某頁
    }
  }
}
