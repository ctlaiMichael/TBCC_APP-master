/**
 * Header
 * F7000401-中華電信欠費查詢
 * F7000402-繳納中華電信費
 * 
 */

import { Component, OnInit } from '@angular/core';
import { HinetFeeService } from '../shared/service/hinet-fee.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { DateUtil } from '@shared/util/formate/date/date-util';


@Component({
	selector: 'app-hinet-fee-page',
	templateUrl: './hinet-fee-page.component.html',
	styleUrls: [],
	providers: [HinetFeeService]
})
export class HinetFeePageComponent implements OnInit {
	/**
	 * 參數設定
	 */

	info_data = {};             // F7000401 所有資料
	infoFeedata = {};           // F7000104 所有資料
	hinetFeeData = [];          // F7000401 欠費列表
	trnsfrOutAccnt = [];        // 扣款帳號
	defaultAcctNoFlag = true ;  // 轉出帳號預設判斷

	// 繳費頁面切換 ('inquiry':查詢頁，'list':列表頁，'confirm':確認頁)
	showPage = 'inquiry';

	// 查詢頁資料發電文
	allHinetFeeData = {
		customerId: '',
		phone: ''
	};

	// 列表頁所選之帳單資料
	hinetFeeConfirmData = {
		customerId: '',
		areaBranchNo: '',
		phone: '',
		authCode: '',
		billDt: '',
		billType: '',
		accountType: '',
		payableAmount: '',
		checkCode: '',
		dueDt: '',
		trnsfrOutAccnt: '',
		trnsToken: '',
		SEND_INFO: '',   // 安控機制
		USER_SAFE: ''    // 安控機制
	}

	// 結果頁全部資料
	hinetFeeResultData = {};

	// 將所有的錯誤資訊存入
	errorMsg = {
		customerId: '',
		phone: '',
		trnsfrOutAccnt: ''
	};

	// 安控機制
	transactionObj = {
		serviceId: 'F7000402',
		categoryId: '2',
		transAccountType: '2'
	};

	// 金額檢核必要參數
	currency = {
		currency: 'TWD'
	}

	constructor(
		private _mainService: HinetFeeService,
		private _headerCtrl: HeaderCtrlService,
		private confirm: ConfirmService,
		private alert: AlertService,
		private navgator: NavgatorService,
		private _uiContentService: UiContentService,
		private _handleError: HandleErrorService,
		private authService: AuthService) {
	}

	ngOnInit() {
		if (this.authService.getUserInfo().isTax != '1') {
			this.alert.show('TRANS_SECURITY.ERROR.201', {
				title: '提醒您'
			}).then(
				() => {
					//確定
					this.navgator.push('taxes-fees');
				}
			);
		} else {
			// 判斷該使用者是否有憑證或OTP。
			let OTPInfo = this.authService.checkAllowOtp();
			let CAInfo = this.authService.checkAllowOtpAndCA();
			if (OTPInfo == false && CAInfo == false) {
				this.alert.show('TRANS_SECURITY.ERROR.200', {
					title: '提醒您'
				}).then(
					() => {
						//確定
						this.navgator.push('taxes-fees');
					}
				);
			} else {
				this._headerCtrl.setLeftBtnClick(() => {
					this.cancelEdit();
				});
			}
		}
	}

	// 跳出popup是否返回
	cancelEdit() {
		this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
			title: '提醒您'
		}).then(
			() => {
				//確定
				this.navgator.push('taxes-fees');
			},
			() => {
			}
		);
	}

	/**
	 * 改變select選擇時
	 * @param menu
	 */
	onChangeType(menu?: any) {
		// if (typeof menu !== 'undefined') {
		// 	this.acctNo = menu;
		// }
		if (this.hinetFeeConfirmData['trnsfrOutAccnt'] != '') {
			this.errorMsg['trnsfrOutAccnt'] = '';
		}
	}



	/**
	 * 發電文F7000104,F7000401
	 */
	getData(): Promise<any> {
		return this._mainService.getData(this.allHinetFeeData).then(
			(result) => {
				this.info_data = result.hinetFeeBill['info_data'];
				this.hinetFeeData = result.hinetFeeBill['data'];
				this.infoFeedata = result.account['info_data'];
				this.trnsfrOutAccnt = result.account['data'];
				// 扣款帳號一組時，預設該組帳號 20190903 Boy
				if(this.trnsfrOutAccnt.length == 1){
					this.hinetFeeConfirmData.trnsfrOutAccnt = this.trnsfrOutAccnt[0].acctNo;
					this.defaultAcctNoFlag = false;
				}
				// ---------------------------------
				this.onChangeType(this.trnsfrOutAccnt[0]);
			},
			(errorObj) => {
				errorObj['type'] = 'message';
				this._handleError.handleError(errorObj);
			}
		);
	}

	/**
	 * 前往列表頁
	 */

	goList() {
		const check_customerId = this.allHinetFeeData['customerId'];
		const check_phone = this.allHinetFeeData['phone'];

		if (check_customerId != '') {
			this.errorMsg['customerId'] = '';
		} else {
			this.errorMsg['customerId'] = 'PG_FEE.ERROR.ID';
		}

		if (check_phone != '') {
			this.errorMsg['phone'] = '';
		} else {
			this.errorMsg['phone'] = 'PG_FEE.ERROR.PHONENUM';
		}

		if (check_customerId != '' && check_phone != '') {
			this.allHinetFeeData = {
				customerId: this.allHinetFeeData['customerId'],
				phone: this.allHinetFeeData['phone']
			};
			this.showPage = 'list';
			this.getData();
		}
	}

	/**
	 * 	安控選擇
	 * @param e 
	 */
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.hinetFeeConfirmData.SEND_INFO = e.sendInfo;
			this.hinetFeeConfirmData.USER_SAFE = e.sendInfo.selected;
		} else {
			// do errorHandle 錯誤處理 推業或POPUP
			let error_obj: any = (!!e.ERROR) ? e.ERROR : e;
			error_obj['type'] = 'message';
			this._handleError.handleError(error_obj);
		}
	}


	// 確認頁返回編輯頁
	toEditPage(e) {
		if (e) {
			this._headerCtrl.setLeftBtnClick(() => {
				this.cancelEdit();
			});
			this.showPage = 'list'
		}
	}
	/**
	 * 前往確認頁
	 * @param data 
	 */

	goConfirmPage(data) {
		const check_trnsfrOutAccnt = this.hinetFeeConfirmData['trnsfrOutAccnt'];
		if (check_trnsfrOutAccnt != '') {
			this.errorMsg['trnsfrOutAccnt'] = '';
		} else {
			this.errorMsg['trnsfrOutAccnt'] = 'PG_TAX.ERROR.TRNSFROUTACCNT';
		}
		if (check_trnsfrOutAccnt != '') {
			this.hinetFeeConfirmData = {
				customerId: this.info_data['customerId'],
				//areaBranchNo: this.info_data['areaBranchNo'],
				areaBranchNo: data.areaBranchNo,
				phone: this.info_data['phone'],
				authCode: this.info_data['batchNo'],
				billDt: data.billDt,
				billType: data.billType,
				accountType: data.accountType,
				payableAmount: data.payableAmount,
				checkCode: data.checkCode,
				dueDt: data.dueDt,
				trnsfrOutAccnt: this.hinetFeeConfirmData.trnsfrOutAccnt,
				trnsToken: this.infoFeedata['trnsToken'],
				SEND_INFO: this.hinetFeeConfirmData.SEND_INFO,
				USER_SAFE: this.hinetFeeConfirmData.USER_SAFE
			};
			this.showPage = 'confirm';
		} else {
			this._handleError.handleError({
				type: 'dialog',
				title: '提醒您',
				content: "輸入項目有誤，請再次確認輸入欄位。"
			});
			// 當使用者輸入有誤時，將頁面拉回最上方。
			this._uiContentService.scrollTop();
		}
	}

	/** 20190903 Boy 
	 * 因無中華電信查詢測試資料，故使用下列資料為「查詢資料」，以
	 * 便開發並測試至繳交中華電信費。
	 * 資料於上傳前將註解。
	 */

	// fakeDatagoConfirmPage() {
	// 	this.hinetFeeConfirmData = {
	// 		customerId: 'A123456789',
	// 		areaBranchNo: '290',
	// 		phone: '0912345678',
	// 		authCode: '304353',
	// 		billDt: '10808',
	// 		billType: '02',
	// 		accountType: 'G8',
	// 		payableAmount: '499',
	// 		checkCode: 'A1',
	// 		dueDt: '1080826',
	// 		trnsfrOutAccnt: '0450677123456',
	// 		trnsToken: '1111111111111111111',
	// 		SEND_INFO: this.hinetFeeConfirmData.SEND_INFO,
	// 		USER_SAFE: this.hinetFeeConfirmData.USER_SAFE
	// 	};
	// 	this.showPage = 'confirm';
	// };

	/**--------20190903 Boy 修改完畢--------------------- */


	/**
	 * 	送電文
	 * @param security 
	 * 下面sendData()中的參數要在從新審視。
	 */

	public finalCheckData(security) {
		this._mainService.sendData(this.hinetFeeConfirmData, security).then(
			(result) => {
				if (result.status) {
					this.showPage = 'result';
					this.hinetFeeResultData = result.data;
				} else {
					result['type'] = 'message';
					this._handleError.handleError(result);
					this._headerCtrl.updateOption({
						'leftBtnIcon': 'menu'
					});
				}
			},
			(errorObj) => {
				errorObj['type'] = 'message';
				this._handleError.handleError(errorObj);
				this._headerCtrl.updateOption({
					'leftBtnIcon': 'menu'
				});
			})
	}
}
