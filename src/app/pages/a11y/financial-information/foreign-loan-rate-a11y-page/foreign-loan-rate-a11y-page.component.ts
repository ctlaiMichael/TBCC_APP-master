/**
 * 外幣放款利率
 */

import { Component, OnInit } from '@angular/core';
import { ForeignLoanService } from '@pages/financial/shared/service/foreignLoan.service';
import { FB000105ApiService } from '@api/fb/fb000105/fb000105-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { DataExchange } from '../shared/Dataexchange';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { LoanService } from '@pages/a11y/loan/shared/loan.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-foreign-loan-rate-a11y-page',
  templateUrl: './foreign-loan-rate-a11y-page.component.html',
  styleUrls: [],
  providers: [ForeignLoanService, FB000105ApiService]
})
export class ForeignLoanRateA11yPageComponent implements OnInit {
  searchTime: string = ''; // 查詢時間
  data = [];
  showData: boolean; // 電文如有正常回傳則顯示
  constructor(
    private foreignLoanService: ForeignLoanService,
    private _handleError: HandleErrorService,
    private dataExchange: DataExchange,
    private headerCtrl: HeaderCtrlService,
    private loanService: LoanService,
    private _logger: Logger,
    private navgator: NavgatorService
  ) {
    this.headerCtrl.setLeftBtnClick(() => { // 左邊button
      this.gobackPage();
    });
  }

  ngOnInit() {
    this.foreignLoanService.getData().then(
      resObj => {
        this.searchTime = this.dataExchange.exchangeData(resObj.searchTime);
        this.data = resObj.data;
        this.showData = true;
        this._logger.debug(JSON.stringify(resObj));
      },
      errObj => {
        this.showData = false;
        errObj['type'] = 'message';
        this._handleError.handleError(errObj);
      }
    );
  }

  dateTitle(origin_date: string, prefix: string): string {
    return this.loanService.dateTitle(origin_date, prefix);
  }

  timeTitle(time: string): string {
    return this.loanService.timeTitle(time);
  }

  //  反回上一頁
  gobackPage() { // 左邊button
    this.navgator.push('a11yfinancialinfokey');
  }
}
