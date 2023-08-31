/**
 * Header
 * 台灣自來水費
 *
 */
import { Component, OnInit } from '@angular/core';
import { WaterService } from '@pages/taxes/shared/service/water.service.ts';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckService } from '@shared/check/check.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { CommonUtil } from '@shared/util/common-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { PadUtil } from '@shared/util/formate/string/pad-util';



@Component({
	selector: 'app-water-page',
	templateUrl: './water-page.component.html',
	styleUrls: [],
	providers: [WaterService]
})
export class WaterPageComponent implements OnInit {
	/**
	 * 參數設定
	 */

	info_data = {};            // F7000104所有資料
	acctNo = [];               // 轉出帳號
	defaultAcctNoFlag = true; // 轉出帳號預設判斷

	// 繳費頁面切換 ('original':原始繳費頁，'confirm':確認頁，'result':結果頁)
	showPage = 'original';

	// 編輯頁全部資料送至確認頁
	allWaterData = {
		account: '',
		dueDate: '',
		bussNO: '',
		payAmount: '',
		chkcode: '',
		businessType: '',
		trnsToken: '',
		SEND_INFO: '',
		USER_SAFE: ''
	};

	// 結果頁全部資料
	waterResultData = {};

	// 將所有的錯誤資訊存入
	errorMsg = {
		account: '',
		dueDate: '',
		bussNO: '',
		payAmount: '',
		chkcode: ''
	};

	// 安控機制
	transactionObj = {
		serviceId: 'F7000201',
		categoryId: '2',
		transAccountType: '2'
	};

	// 金額檢核必要參數
	currency = {
		currency: 'TWD'
	}

	constructor(
		private _mainService: WaterService,
		private _headerCtrl: HeaderCtrlService,
		private confirm: ConfirmService,
		private alert: AlertService,
		private navgator: NavgatorService,
		private _errorCheckService: CheckService,
		private _handleError: HandleErrorService,
		private systemParameterService: SystemParameterService,
		private authService: AuthService,
		private _uiContentService: UiContentService) { }

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
				this.getData();
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
		if (this.allWaterData['account'] != '') {
			this.errorMsg['account'] = '';
		}
		if (this.allWaterData['dueDate'] != '') {
			this.errorMsg['dueDate'] = '';
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
				}else if (this.acctNo.length == 1) {
					this.allWaterData.account = this.acctNo[0].acctNo;
					this.defaultAcctNoFlag = false;
					this.onChangeType(this.allWaterData.account);
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
	 * 代收期限檢核
	 * 最多7位'數字'
	 * @param str 
	 */

	checkDueDate(str: string) {
		let data = {
			status: false,
			msg: 'PG_TAX.ERROR.DUEDATE_1',
			data: ''
		};

		if (typeof str !== 'string') {
			return data;
		}

		let res = /^\d{7}$/; // 檢查7碼純數值
		if (str.length < 7 && str != '' && !res.test(str)) {
			data.msg = 'PG_TAX.ERROR.DUEDATE_2'
		}
		if (res.test(str)) {
			data.status = true;
			data.msg = '';
			return data;
		}
		data.data = str;
		return data;
	}

	/**
	 * 前往確認頁
	 * @param payNo 
	 * @param payEndDate 
	 * @param trnsfrAmount 
	 * 
	 */

	goConfirm() {
		const check_account = this._errorCheckService.checkActNum((this.allWaterData['account'].replace(/-/g, '')));     // 轉出帳號(扣款帳號)
		const check_dueDate = this.checkDueDate(this.allWaterData['dueDate']);       // 代收期限
		const check_bussNO = this.bussNOCheck(this.allWaterData['bussNO']);                          // 銷帳編號
		const check_payAmount = this._errorCheckService.checkMoney(this.allWaterData['payAmount'], this.currency);  // 應繳總金額
		const check_chkcode = 
		this.checkWaterFeeNumber(this.allWaterData['dueDate'],
		this.allWaterData['bussNO'],this.allWaterData['payAmount']); 
		const check_chkcode_2 = (check_chkcode.toString() ==this.allWaterData['chkcode']);
		const check_chkcode_3 = this.allWaterData['chkcode'];

		if (check_account.status) {
			this.errorMsg['account'] = '';
		} else {
			this.errorMsg['account'] = 'PG_TAX.ERROR.TRNSFROUTACCNT';
		}

		if (check_dueDate.status) {
			this.errorMsg['dueDate'] = '';
		} else {
			this.errorMsg['dueDate'] = check_dueDate.msg;
		}

		if (check_bussNO.status) {
			this.errorMsg['bussNO'] = '';
		} else {
			this.errorMsg['bussNO'] = check_bussNO.msg;
		}

		if (check_payAmount.status) {
			this.errorMsg['payAmount'] = '';
		} else {
			this.errorMsg['payAmount'] = check_payAmount.msg;
		}

		if (check_chkcode_3 != '') {
			this.errorMsg['chkcode'] = '';
		} else {
			this.errorMsg['chkcode'] = 'PG_TAX.WATER.CHKCODE';
		}

		if (!check_chkcode_2 && check_chkcode_3 != '') {
			this.errorMsg['chkcode'] = 'PG_TAX.WATER.CHKCODE_1';
		}


		if (check_account.status && check_dueDate.status && check_bussNO.status && check_payAmount.status && check_chkcode_2) {
			this.allWaterData = {
				account: this.allWaterData['account'],
				dueDate: this.allWaterData['dueDate'],
				bussNO: this.allWaterData['bussNO'],
				payAmount: this.allWaterData['payAmount'],
				chkcode: this.allWaterData['chkcode'],
				businessType: this.info_data['businessType'],
				trnsToken: this.info_data['trnsToken'],
				SEND_INFO: this.allWaterData.SEND_INFO,
				USER_SAFE: this.allWaterData.USER_SAFE
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


	/**
	 * 	安控選擇
	 * @param e 
	 */
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.allWaterData.SEND_INFO = e.sendInfo;
			this.allWaterData.USER_SAFE = e.sendInfo.selected;
		} else {
			// do errorHandle 錯誤處理 推業或POPUP
			let error_obj: any = (!!e.ERROR) ? e.ERROR : e;
			error_obj['type'] = 'message';
			this._handleError.handleError(error_obj);
		}
	}


	// 確認頁返回編輯頁
	toEditPage(e) {
		this.allWaterData.dueDate = DateUtil.transDate(this.allWaterData.dueDate, { 'formate': 'yyyMMdd', 'chinaYear': true });
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
		let purchaseUse = this.systemParameterService.get('EXMP_F7000201_URL');
		this.navgator.push(purchaseUse);
	}

	/**
	 * 20190906 Boy 加入水費檢核碼 
	 * @param dueDate    代收期限(1234567,固定7碼)  
	 * @param bussNO     銷帳編號(12345678901234,固定14碼)  
	 * @param payAmount  應繳金額(最多八碼)    
	 * 
	 * step1. (代收期限7+銷帳編號14+應繳金額8)共29位數
	 */
	checkWaterFeeNumber(dueDate: string, bussNO: string, payAmount: string) {

		const formateArray = [2, 3, 5, 7]; // 水費格式化資料--> 23572357.... 共有29位數
		const resultHaveToPay = PadUtil.padLeft(payAmount, 8); // 應繳金額共8碼

		// (共29碼): 代收期限+銷帳編號+應繳金額	        
		let formulateInput = dueDate.toString()
			+ bussNO.toString()
			+ resultHaveToPay.toString();

		let sum_data = 0;
		for (let i = 0; i < formulateInput.length; i++) {
			let originalInput = parseInt(formulateInput[i]);
			let tempResult = originalInput * formateArray[i % 4];
			sum_data += tempResult;
		}
		let real_checkcode = sum_data % 10;
		
		return real_checkcode;
	}





	/**
	 * 	送電文
	 * @param security 
	 * 
	 */

	public finalCheckData(security) {
		this._mainService.sendData(this.allWaterData, security).then(
			(result) => {
				if (result.status) {
					this.showPage = 'result';
					this.waterResultData = result.data;
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

