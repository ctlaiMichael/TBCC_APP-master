/**
 * 線上簽約對保-查詢頁
 * 20191123 
 * 未完成項目
 * 1. 期間與利率目前未接上電文
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { SignProtectService } from '@pages/online-loan/shared/service/sign-protect.service';
import { SignProtectSaveService } from '@pages/online-loan/shared/service/sign-protect-save.service';
import { MortgageIncreaseService } from '@pages/online-loan/shared/service/mortgage-increase.service';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
	selector: 'app-sign-protect-search',
	templateUrl: './sign-protect-search-page.component.html',
	styleUrls: [],
	providers: [SignProtectService, SignProtectSaveService, MortgageIncreaseService]
})

export class SignProtectSearchPageComponent implements OnInit {


	@Input() page: number = 1;
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();   // 列表回傳
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();  // 失敗回傳

	queryData = [];     // 申請進度查詢資料
	custInfo = {};      // 個人基本資料

	/**
	 * 因應f9000501 request欄位caseStatus
	 * 故先使用下方reqData物件寫法
	 * 待欄位caseStatus確定後，再修改。
	 */
	reqData = {
		custId: '',
		caseStatus: '5'
	};

	/**
	 * f9000504requestData
	 */
	otherReqData = {
		custId: '',
		ebkCaseNo: ''
	};

	constructor(
		private _logger: Logger,
		private _mainService: SignProtectService,
		private signProtectSaveService: SignProtectSaveService,
		private mortgageIncreaseService: MortgageIncreaseService,
		private _authService: AuthService,
		private alert: AlertService,
		private navgator: NavgatorService,
		private _handleError: HandleErrorService
	) { }

	ngOnInit() {
		if (typeof this.page === 'undefined') {
			this.page = 1;
		} else {
			this.page = parseInt(this.page.toString(), 10);
		}
		/** 判斷有無OTP或憑證，兩者皆無時無法進行簽約對保。 */
		let CAInfo = this._authService.checkAllowOtpAndCA();
		let OTPInfo = this._authService.checkAllowOtp();
		if (OTPInfo == false && CAInfo == false) {
			this.alert.show('TRANS_SECURITY.ERROR.200', {
				title: '提醒您'
			}).then(
				() => {
					//確定
					this.navgator.push('sign-protection');
				}
			);
		} else {
			this.signProtectSaveService.resetApplyData();
			this.mortgageIncreaseService.resetPersonalData();
			this.getCustInfo();
			this.getData();
		}
	}


	// 取得案件進度
	getData(): Promise<any> {
		return this._mainService.getQuery(this.reqData, this.page).then(
			(success) => {
				this._logger.error("F9000501successful data", success);
				this.queryData = success.data;
				this.queryData.forEach(element => {
					if (typeof element.branch_nam == 'object') {
						element.branch_nam = '--';
					}
					if (typeof element.apraprde == 'object') {
						element.apraprde = '--';
					}
					if (typeof element.aprfee == 'object') {
						element.aprfee = '--';
					}
					if (typeof element.aprJcIcFee == 'object') {
						element.aprJcIcFee = '--';
					}
				});
				// 暫存申請進度查詢
				this.signProtectSaveService.setJApplyData(this.queryData);
				this.onBackPageData(success);
			},
			(errorObj) => {
				this._logger.error('is this coming?');
				this.onErrorBackEvent(errorObj, 'list-item');
			}
		);
	}

	// 取得個人基本資料
	getCustInfo(): Promise<any> {
		return this._mainService.getCustInfo().then(
			(success) => {
				this._logger.error("success.info_data:", success.info_data);
				this.custInfo = success.info_data;
			},
			(error) => {
				this._logger.error("error:", error);
				this.onErrorBackEvent(error, 'list-item');
			}
		);
	}


	/**
	 * 點擊簽約對保
	 * @param setData 
	 */
	onSign(setData) {
		this.otherReqData.custId = this.custInfo['id_no'];
		this.otherReqData.ebkCaseNo = setData.ebkCaseNo;
		this.onBackPageData(setData, 'goSign', this.custInfo,this.otherReqData);
	}

	/**
	 * 重新設定page data
	 * @param item
	 */

	onBackPageData(item: any, setype?: string, custInfo?: any ,otherReqData?:any ) {
		let output = {
			'page': 'list-item',
			'type': 'page_info',
			'data': item,
			'custInfo': custInfo,
			'otherReqData':otherReqData
		};
		// 點擊簽約對保(返回父層sign-main)
		if (setype == 'goSign') {
			this._logger.log("into go sign back");
			output.page = 'sign-search';
			output.type = 'go-sign';
		}
		this.backPageEmit.emit(output);
	}

	/**
	* 失敗回傳
	* @param error_obj 失敗物件
	*/
	onErrorBackEvent(error_obj, page) {
		let output = {
			'page': 'list-item',
			'type': 'error',
			'data': error_obj
		};
		switch (page) {
			case 'query-edit':
				output.page = page;
				break;
		}
		this._logger.error('onErrorBackEvent-output', output);
		this.errorPageEmit.emit(output);
	}
	
}