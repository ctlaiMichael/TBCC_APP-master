/**
 * Header
 * 台北自來水費
 * barCode 1: 9碼
 * barCode 2: 16碼
 * barCode 3: 15碼
 */
import { Component, OnInit, NgZone } from '@angular/core';
import { TaipeiWaterService } from '@pages/taxes/shared/service/taipei-water.service.ts';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckService } from '@shared/check/check.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { CommonUtil } from '@shared/util/common-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { ReplaceUtil } from '@shared/util/formate/string/replace-util';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { FormateService } from '@shared/formate/formate.service';



@Component({
	selector: 'app-taipei-water-page',
	templateUrl: './taipei-water-page.component.html',
	styleUrls: [],
	providers: [TaipeiWaterService]
})
export class TaipeiWaterPageComponent implements OnInit {
	/**
	 * 參數設定
	 */

	info_data = {};            // F7000104所有資料
	acctNo = [];               // 轉出帳號
	defaultAcctNoFlag = true; // 轉出帳號預設判斷


	// 繳費頁面切換 ('original':原始繳費頁，'confirm':確認頁)
	showPage = 'original';

	// 編輯頁全部資料送至確認頁
	allTaipeiWaterData = {
		account: '',
		barcode1: '',      // 代收期限YYMMDD (6) + 代收項目168(3)
		barcode2: '',      // 水單類別(2) +分單序號(1) +序號(1) +抄表日(dd)(2) +水號(10)
		barcode3: '',      // 抄表日yymm(4) + 檢查碼(2) + 帳單金額(9)
		waterNumber: '',   // 水號
		payAmount: '',
		businessType: '',
		trnsToken: '',
		SEND_INFO: '',
		USER_SAFE: ''
	};

	// 結果頁全部資料
	taipeiWaterResultData = {};

	// 將所有的錯誤資訊存入
	errorMsg = {
		account: '',
		barcode1: '',
		barcode2: '',
		barcode3: '',
		waterNumber: '',
		payAmount: ''
	};

	// 安控機制
	transactionObj = {
		serviceId: 'F7001001',
		categoryId: '2',
		transAccountType: '2'
	};

	// 金額檢核必要參數
	currency = {
		currency: 'TWD'
	};

	constructor(
		private _mainService: TaipeiWaterService,
		private _headerCtrl: HeaderCtrlService,
		private confirm: ConfirmService,
		private alert: AlertService,
		private navgator: NavgatorService,
		private _errorCheckService: CheckService,
		private _handleError: HandleErrorService,
		private systemParameterService: SystemParameterService,
		private authService: AuthService,
		private _uiContentService: UiContentService,
		private zone: NgZone,
		private _formateService: FormateService
	) { }

	ngOnInit() {
		this._reset();
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
				this.getData();
				this._headerCtrl.setLeftBtnClick(() => {
					this.cancelEdit();
				});
				this.navgator.scanObj.subscribe((obj) => {
					let code1 = (!!obj.barCodeOne) ? obj.barCodeOne.toString().toLocaleUpperCase() : '';
					let code2 = (!!obj.barCodeTwo) ? obj.barCodeTwo.toString().toLocaleUpperCase() : '';
					let code3 = (!!obj.barCodeThird) ? obj.barCodeThird.toString().toLocaleUpperCase() : '';
					this.allTaipeiWaterData.barcode1 = code1;
					this.allTaipeiWaterData.barcode2 = code2;
					this.allTaipeiWaterData.barcode3 = code3;
					this.allTaipeiWaterData.waterNumber = this.allTaipeiWaterData.barcode2.substring(6);  // 放入水號
					let output = ReplaceUtil.baseSymbol(this.allTaipeiWaterData.barcode3.substring(6));   // 放入應繳總金額
					output = ReplaceUtil.replaceLeftStr(output);
					this.allTaipeiWaterData.payAmount = output;
				});
			}
		}
	}
	// 跳出popup是否返回
	cancelEdit() {
		this.zone.run(() => {
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
		});
	}


	/**
	 * 改變select選擇時
	 * @param menu
	 */
	onChangeType(menu?: any) {
		// if (typeof menu !== 'undefined') {
		// 	this.acctNo = menu;
		// }
		if (this.allTaipeiWaterData['account'] != '') {
			this.errorMsg['account'] = '';
		}
	}

	getData(): Promise<any> {
		return this._mainService.getData().then(
			(result) => {
				this.info_data = result.info_data;
				//----20190907 Boy 判斷是否有扣款帳號-----//
				this.acctNo = result.data;
				this.onChangeType(this.acctNo[0]);
				if (this.acctNo.length <= 0) {
					this._handleError.handleError({
						type: 'message',
						title: 'POPUP.NOTICE.TITLE',
						content: "PG_TAX.ERROR.TRNSFROUTACCNT_2",
						classType: "warning"
					});
					return false;
				} else if (this.acctNo.length == 1) {
					this.allTaipeiWaterData.account = this.acctNo[0].acctNo;
					this.defaultAcctNoFlag = false;
					this.onChangeType(this.allTaipeiWaterData.account);
				}
				//------------------------------------//

			},
			(errorObj) => {
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
			}
		);
	}

	/**
	 * 銷帳編號檢核
	 * @param bussNO 
	 */

	bussNOCheck(bussNO: string) {
		let data = {
			status: false,
			msg: 'CHECK.PAYMENT_ID', // 請輸入銷帳編號
			data: '',
			data_formate: ''
		};
		// == 參數處理 == //
		let return_type = false;
		let not_zero = true;
		let maxIntNum = 14; // 銷帳編號最長為14碼
		let check_str = bussNO.toString();
		const checkEmptyError = ObjectCheckUtil.checkEmpty(check_str, false, not_zero);
		if (!checkEmptyError.status) {
			return CommonUtil.modifyReturn(data, return_type);
		}
		check_str = checkEmptyError.data_trim;
		check_str = check_str.replace(/,/g, ''); // 清除格式化資訊

		if (not_zero && parseFloat(check_str) === 0) {
			// 不可為0
			return CommonUtil.modifyReturn(data, return_type);
		}

		const number_list = check_str.split('.');
		let check_length = StringCheckUtil.checkLength(number_list[0], maxIntNum, 'min');
		if (!check_length.status) {
			data.msg = '銷帳編號最少為%0碼'.replace('%0', maxIntNum.toString()); // 銷帳編號最少為%0位
			return CommonUtil.modifyReturn(data, return_type);
		}
		data.status = true;
		data.msg = '';
		data.data_formate = AmountUtil.amount(check_str);
		if (/\.(|0(|0)|[1-9]{1}0)$/.test(data.data_formate)) {
			data.data_formate = data.data_formate.replace(/(\.0(|0)$|0$|\.$)/, ''); // 強制去除.00或.X0的0
		}
		return CommonUtil.modifyReturn(data, return_type);
	}

	/**
	 * 由條碼二與三帶入水號及繳納總金額
	 * @param str 
	 */

	waterNumber(str: string) {
		let check_data: any;
		let check_str = this._formateService.checkField(this.allTaipeiWaterData, str);
		check_str = check_str.toLocaleUpperCase();
		switch (str) {
			case 'barcode1':
				check_data = this._mainService.checkBarcode1(check_str);
				if (!check_data.status) {
					this.errorMsg['barcode1'] = check_data.msg;
				} else {
					this.allTaipeiWaterData[str] = check_str;
					this.errorMsg['barcode1'] = '';
				}
				break;
			case 'barcode2':
				check_data = this._mainService.checkBarcode2(check_str);
				if (!check_data.status) {
					this.errorMsg['barcode2'] = check_data.msg;
					this.allTaipeiWaterData.waterNumber = '';
				} else {
					this.allTaipeiWaterData[str] = check_str;
					this.errorMsg['barcode2'] = '';
					this.errorMsg['waterNumber'] = '';
					this.allTaipeiWaterData.waterNumber = check_data.waterNumber;
				}
				break;
			case 'barcode3':
				check_data = this._mainService.checkBarcode3(check_str);
				if (!check_data.status) {
					this.errorMsg['barcode3'] = check_data.msg;
					this.allTaipeiWaterData.payAmount = '';
				} else {
					this.allTaipeiWaterData[str] = check_str;
					this.errorMsg['barcode3'] = '';
					this.errorMsg['payAmount'] = '';
					this.allTaipeiWaterData.payAmount = check_data.amount;
				}
				break;
			default:
				// nodo
				break;
		}
	}

	/**
	 * 前往確認頁
	 * bussNO 銷帳編號14碼 目前只判斷不為空，未送進service檢查。
	 */

	goConfirm() {
		// const check_account = this.allTaipeiWaterData['account'];     // 轉出帳號(扣款帳號)
		// const check_payAmount = this._errorCheckService.checkMoney(this.allTaipeiWaterData['payAmount'], this.currency);  // 應繳總金額
		// const check_barcode1 = this.allTaipeiWaterData['barcode1'];  // barcode1
		// const check_barcode2 = this.allTaipeiWaterData['barcode2'];  // barcode2
		// const check_barcode3 = this.allTaipeiWaterData['barcode3'];  // barcode3
		// const check_waterNumber = this.allTaipeiWaterData['waterNumber'];  // 水號

		let check_data = this._mainService.checkData(this.allTaipeiWaterData);
		this.errorMsg = check_data.error;
		if (!check_data.status) {
			this._handleError.handleError({
				type: 'dialog',
				title: '提醒您',
				content: '輸入項目有誤，請再次確認輸入欄位。'
			});
			// 當使用者輸入有誤時，將頁面拉回最上方。
			this._uiContentService.scrollTop();
		} else {
			let output = ReplaceUtil.baseSymbol(this.allTaipeiWaterData.barcode3.substring(6));
			output = ReplaceUtil.replaceLeftStr(output);
			this.allTaipeiWaterData = {
				account: this.allTaipeiWaterData['account'],
				barcode1: this.allTaipeiWaterData['barcode1'],
				barcode2: this.allTaipeiWaterData['barcode2'],
				barcode3: this.allTaipeiWaterData['barcode3'],
				waterNumber: this.allTaipeiWaterData['barcode2'].substring(6),
				payAmount: output,
				businessType: this.info_data['businessType'],
				trnsToken: this.info_data['trnsToken'],
				SEND_INFO: this.allTaipeiWaterData.SEND_INFO,
				USER_SAFE: this.allTaipeiWaterData.USER_SAFE
			};
			this.showPage = 'confirm';
		}
	}


	/**
	 * 	安控選擇
	 * @param e 
	 */
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.allTaipeiWaterData.SEND_INFO = e.sendInfo;
			this.allTaipeiWaterData.USER_SAFE = e.sendInfo.selected;
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
			this.showPage = 'original'
		}
	}


	/**
	 * 帳單範例說明
	 */

	billExample() {
		let purchaseUse = this.systemParameterService.get('EXMP_F7001001_URL');
		this.navgator.push(purchaseUse);
	}


	/**
	 * barcode plugin
	 */
	scanningBarcode() {
		this.navgator.displayScanBox(true);
	}


	/**
	 * 	送電文
	 * @param security 
	 * 
	 */

	public finalCheckData(security) {
		this.allTaipeiWaterData.account = this.allTaipeiWaterData.account.replace(/-/g, '');
		this._mainService.sendData(this.allTaipeiWaterData, security).then(
			(result) => {
				if (result.status) {
					this.showPage = 'result';
					this.taipeiWaterResultData = result.data;
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

	private _reset() {
		this.allTaipeiWaterData = {
			account: '',
			barcode1: '',      // 代收期限YYMMDD (6) + 代收項目168(3)
			barcode2: '',      // 水單類別(2) +分單序號(1) +序號(1) +抄表日(dd)(2) +水號(10)
			barcode3: '',      // 抄表日yymm(4) + 檢查碼(2) + 帳單金額(9)
			waterNumber: '',   // 水號
			payAmount: '',
			businessType: '',
			trnsToken: '',
			SEND_INFO: '',
			USER_SAFE: ''
		};
	}

}

