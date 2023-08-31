/**
 * 存款查詢選單
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-deposit-menu',
  templateUrl: './deposit-menu-page.component.html',
  styleUrls: [],
  providers: []
})
export class DepositMenuComponent implements OnInit {
  /**
   * 參數設定
   */
  // menuData = []; //存款查詢選單

  constructor(
    private _logger: Logger
  ) {
    // this._logger.step('depositInquiry', 'hi');
  }

  ngOnInit() {

  }

}
