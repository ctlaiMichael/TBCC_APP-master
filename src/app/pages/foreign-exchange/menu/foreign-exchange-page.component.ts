/**
 * 外匯業務選單
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-foreign-exchange',
  templateUrl: './foreign-exchange-page.component.html',
  styleUrls: [],
  providers: []
})
export class ForeignExchangeComponent implements OnInit {
  /**
   * 參數設定
   */
  menuData = []; // 外匯業務選單

  constructor(
    private _logger: Logger
  ) {
  }

  ngOnInit() {
  }

}
