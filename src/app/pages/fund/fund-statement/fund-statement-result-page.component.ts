/**
 * 信託對帳單結果頁
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';


@Component({
  selector: 'app-fund-statement-result',
  templateUrl: './fund-statement-result-page.component.html',
  styleUrls: [],

})
export class FundStatementResultPageComponent implements OnInit {
  @Input() mailOut;
  constructor(
    private _logger: Logger
    , private router: Router
    , private navgator: NavgatorService
    , private _headerCtrl: HeaderCtrlService

  ) {
  }

  ngOnInit() {
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'menu',
      'title': '交易結果'
    });
  }

  goMenu() {
    this.navgator.push('fund', {});
  }
}
