/**
 * 外幣綜活存轉綜定存
 */
import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { CreditPayService } from '@pages/credit/shared/service/credit-pay.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { CheckService } from '@shared/check/check.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';


@Component({
	selector: 'app-payment-edit',
	templateUrl: './payment-edit-page.component.html',
	styleUrls: [],
	providers: [CreditPayService]
})
export class PaymentEditPageComponent implements OnInit {
	/**
	 * 參數設定
	 */
	@Input() data;  //301 res
	showData = false;
	showNextPage = '';

	inputView = {          //頁面上的欄位
		trnsAcnt: '',     //轉出帳號
		money: '',        //繳納金額
		repayRadio: '1',  //還本息或還本金
		periods: '0',        //期數(由302逾期明細使用者所選帶回)
		USER_SAFE: "",     //安控
		SEND_INFO: ""     //安控
	};
	errorMsg: any = { 'trnsAcnt': '', 'money': '' };
	// 列表資訊
	datas = [];
	info_data: any = {};    //f9000302回傳res
	account_list = [];  //f9000302回傳之約定轉出帳號
	success_data = {};    //傳給結果頁

	showOverdue = false;
	hiddenFlag = false;
	disFlag = true;
	transactionObj = {
		serviceId: 'F9000303',
		categoryId: '3',
		transAccountType: '1',
	};
	constructor(
		private _logger: Logger
		, private router: Router
		, private _mainService: CreditPayService
		, private _handleError: HandleErrorService
		, private _errorCheck: CheckService
		, private _headerCtrl: HeaderCtrlService
		, private confirm: ConfirmService
		, private navgator: NavgatorService
	) {

	}

	ngOnInit() {
		//取得約定轉出帳號的req

		this.gettrnsfrAccount();
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	}

	//跳出popup是否返回
	cancelEdit() {
		this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
			title: '提醒您'
		}).then(
			() => {
				//確定
				this.navgator.push('credit');
			},
			() => {

			}
		);
	};
	//取得約定轉出帳號
	gettrnsfrAccount(): Promise<any> {
		let getAccReq = {};
		if (this.data.hasOwnProperty('borrowAccount')) {
			getAccReq = {
				"borrowAccount": this.data["borrowAccount"]
			}
		};
		this.data.totalAmount = AmountUtil.currencyAmount(this.data.totalAmount, 'TWD').replace('TWD', '').replace(',', '').trim();
		return this._mainService.gettrnsfrAccount(getAccReq).then(
			(result) => {
				//success
				this.info_data = result.info_data;
				this.datas = result.data;
				this.account_list = result.accounts;    //轉出帳號
				this.inputView.money = this.data.totalAmount;
				this.showData = true;
			}
			, (errorObj) => {
				errorObj['type'] = 'message';
				this._handleError.handleError(errorObj);
			}
		)
	}

	//前往確認頁
	onNextPage() {
		//檢查轉出帳號
		if (this.inputView.trnsAcnt == '') {
			this.errorMsg.trnsAcnt = "請選擇帳轉出帳號";
		} else {
			this.errorMsg.trnsAcnt = "";
		};
		//檢查金額欄位
		const check_obj = this._errorCheck.checkMoney(this.inputView.money, { 'currency': 'TWD' });

		if (check_obj.status) {
			this.errorMsg.money = '';
		} else {
			this.errorMsg.money = check_obj.msg;
		};
		if (this.inputView.trnsAcnt != '' && check_obj.status) {
			this.showNextPage = 'confirm';
		};
	}


	//切換還本息還本金按鈕
	radioChg() {
		if (this.inputView.repayRadio == '1') {
			this.inputView.money = this.data.totalAmount;
			this.disFlag = true;
		} else {
			this.inputView.money = '';
			this.disFlag = false;
		}
	}
	//安控
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.inputView.SEND_INFO = e.sendInfo;
			this.inputView.USER_SAFE = e.sendInfo.selected;
		} else {
			e['type'] = 'message';
			this._handleError.handleError(e.ERROR);
		}
	};

	//結果頁
	goResult(e) {

		if (e.securityResult.ERROR.status == true) {
			this.onSend(e);
		} else {

		}
		// this.onSend(e);
	};
	//逾期資訊頁
	goOverdue() {
		this.showOverdue = true;
		this.hiddenFlag = true;
	};
	//逾期選擇完將金額帶回來
	selectRepay(obj) {

		this.showOverdue = false;
		if (obj.hasOwnProperty('back')) {
			this.hiddenFlag = false;
			this.inputView.periods = '0';
		} else {
			this.inputView.money = obj.money;
			this.inputView.periods = obj.i;
			this.hiddenFlag = false;
		}
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	};
	onSend(security) {
		this._mainService.onSend(this.data, this.info_data, this.inputView, security).then(
			(res) => {
				if (res.hasOwnProperty('status') && res.status == true && res.hasOwnProperty('success_data')) {
					this.success_data = res.info_data;
					this.showNextPage = 'result';
				}
			},
			(errorObj) => {
				errorObj['type'] = 'message';
				this._handleError.handleError(errorObj);
			});
	}

	toEditPage(e) {
		if (e) {
			this._headerCtrl.setLeftBtnClick(() => {
				this.cancelEdit();
			});
			this.showNextPage = '';
		}
	}

}


