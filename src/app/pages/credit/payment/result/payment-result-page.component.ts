/**
 * 繳納借款本息-結果頁
 */
import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
	selector: 'app-payment-result',
	templateUrl: './payment-result-page.component.html',
	styleUrls: [],
})



export class PaymentResultComponent implements OnInit {
	/**
	 *參數設定
	 */

	@Input() success_data;
	constructor(
		private _logger: Logger
		, private navgator: NavgatorService


	) {
	}

	ngOnInit() {
	}
	goMenu() {
		this.navgator.push('credit', {});
	}

}
