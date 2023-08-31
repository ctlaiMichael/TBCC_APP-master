/**
 * 額度調整服務選單
 */
import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
  selector: 'app-card-quota-menu',
  templateUrl: './card-quota-menu.component.html',
  styleUrls: [],
  providers: []
})
export class CardQuotaMenuComponent implements OnInit {
  /**
   * 參數設定
   */

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService
  ) {
  }

  ngOnInit() {
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': '額度調整',
      'style': 'normal'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.navgator.push('web:card');

    });
  }
}
