import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';

@Component({
  selector: 'app-qrcode-pay-terms',
  templateUrl: './qrcode-pay-terms.component.html',
  styleUrls: ['./qrcode-pay-terms.component.css']
})
export class QrcodePayTermsComponent implements OnInit {
  popup_open = true;
  popupheight = window.screen.height - 440;
  constructor(
    private navgator: NavgatorService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
    if (this.popupheight >= 380) {
      this.popupheight = 380;
    }
  }

  /**
   * 點選同意
   */
  clickAgree() {
    this.popup_open = false;
    this.localStorage.set('firstAggreCard', '1');
    this.navgator.push('cardAdd');
  }

  /**
	 * 點選不同意
	 */
  clickDisAgree() {
    this.navgator.push('epay');
  }

}
