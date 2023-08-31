/**
 * 外幣綜活存轉綜定存
 */
import { Component, OnInit, transition, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { TimeDepositTerminateService } from '../shared/service/time-deposit-terminate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
	selector: 'app-time-deposit-terminate-result',
	templateUrl: './time-deposit-terminate-result-page.component.html',
	styleUrls: [],
})



export class TimeDepositTerminateResultComponent implements OnInit {
	/**
	 *參數設定
	 */
	@Input() resultObj;
	// resultObj:{
	//     custId:'',
	//     hostCode:'',
	//     trnsNo:'',
	//     trnsDateTime:'',
	//     hostCodeMsg:'',
	//     xFaccount:'',
	//     currencyName:'',
	//     amount:'',
	//     trnsfrRate:'',
	//     startDate:'',
	//     maturityDate:'',
	//     interestRate:'',
	//     cancelRate:'',
	//     margin:'',
	//     tax: '',
	//     profit:'',
	//     total:'',
	//     destAccount:'',
	//     taxTW:'',
	//     intTW:'',
	//     trnsRsltCode:'',
	//     interestIncome:'',
	//     midInt:'',
	//     insuAmt:'',
	//     insuAmtTw:'',
	//     insuRate:'',

	// };//取得交易結果電文
	constructor(
		private _logger: Logger
		, private _mainService: TimeDepositTerminateService
		, private _handleError: HandleErrorService
		, private _headerCtrl: HeaderCtrlService
		, private navgator: NavgatorService
	) {
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu',
			'title': '交易結果'
		});
	}
	goMenu() {
		this.navgator.push('foreign-exchange', {});
	}
	ngOnInit() {
	}
}
