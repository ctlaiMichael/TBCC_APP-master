/**
 * 繳納借款本息逾期明細頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';


@Component({
	selector: 'app-payment-overdue',
	templateUrl: './payment-overdue-page.component.html',
	styleUrls: [],
})



export class PaymentOverduePageComponent implements OnInit {
	/**
	 *參數設定
	 */
	@Input() info_data;
	//302
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();


	constructor(
		private _logger: Logger
		, private _checkSecurityService: CheckSecurityService
		, private _headerCtrl: HeaderCtrlService
		, private confirm: ConfirmService
		, private navgator: NavgatorService

	) {
	}

	ngOnInit() {
		this._headerCtrl.setLeftBtnClick(() => {
			this.goBack();
		});
	};

	/**
	 * 
	 *選擇完欲繳資料 帶回edit
	 */
	selectItem(item, i) {
		this.backPageEmit.emit({
			money: item.sumAmount,
			i: i
		});
	}
	/**
	 * 左上角返回
	 */
	goBack() {
		this.backPageEmit.emit({
			money: '',
			i: '',
			back: true
		});
	}
}
