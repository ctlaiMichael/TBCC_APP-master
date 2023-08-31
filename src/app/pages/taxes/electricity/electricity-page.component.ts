/**
 * Header
 * 電費
 */
import { Component, OnInit } from '@angular/core';
import { ElectricityService } from '@pages/taxes/shared/service/electircity.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckService } from '@shared/check/check.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { PadUtil } from '@shared/util/formate/string/pad-util';


@Component({
	selector: 'app-electricity-page',
	templateUrl: './electricity-page.component.html',
	styleUrls: [],
	providers: [ElectricityService]
})
export class ElectricityPageComponent implements OnInit {
	/**
	* 參數設定
	*/

	info_data = {};            // F7000104所有資料
	acctNo = [];               // 轉出帳號
	defaultAcctNoFlag = true;  // 轉出帳號預設判斷


	// 繳費頁面切換 ('original':原始繳費頁，'confirm':確認頁)
	showPage = 'original';

	// 編輯頁全部資料送至確認頁
	allElectricityData = {
		account: '',
		dueDate: '',
		custNum: '',
		payAmount: '',
		chkcode: '',
		businessType: '',
		trnsToken: '',
		SEND_INFO: '',
		USER_SAFE: ''
	};

	// 結果頁全部資料
	electricityResultData = {};

	// 將所有的錯誤資訊存入
	errorMsg = {
		account: '',
		dueDate: '',
		custNum: '',
		payAmount: '',
		chkcode: ''
	};

	// 安控機制
	transactionObj = {
		serviceId: 'F7000301',
		categoryId: '2',
		transAccountType: '2'
	};

	// 金額檢核必要參數
	currency = {
		currency: 'TWD'
	}

	constructor(
		private _mainService: ElectricityService,
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
	 * @param menu
	 */
	onChangeType(menu?: any) {
		// if (typeof menu !== 'undefined') {
		// 	this.acctNo = menu;
		// }
		if (this.allElectricityData['account'] != '') {
			this.errorMsg['account'] = '';
		}
		if (this.allElectricityData['dueDate'] != '') {
			this.errorMsg['dueDate'] = '';
		}
	}


	getData(): Promise<any> {
		return this._mainService.getData().then(
			(result) => {
				this.info_data = result.info_data;
				//----20190906 Boy 判斷是否有扣款帳號-----//
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
					this.allElectricityData.account = this.acctNo[0].acctNo;
					this.defaultAcctNoFlag = false;
					this.onChangeType(this.allElectricityData.account);
				}
				//------------------------------------//
			},
			(errorObj) => {
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
			}
		);
	}

	// 前往確認頁

	goConfirm() {
		const check_account = this.allElectricityData['account'];                     // 扣款帳號
		const check_chkcode = this.checkChkcode(this.allElectricityData.chkcode);     // 查核碼
		const check_custNum = this.checkCustNum(this.allElectricityData['custNum']);  // 電號
		const check_dueDate = this.checkDueDate(this.allElectricityData['dueDate']);  // 代收期限
		const check_payAmount = this._errorCheckService.checkMoney(this.allElectricityData['payAmount'], this.currency);  // 應繳總金額
		
		//------20190906 Boy 加入電費檢核碼------/
		
		let real_chkcode = this.checkElectricityFeeNumber(
			this.allElectricityData['dueDate'],
			this.allElectricityData['custNum'],
			this.allElectricityData.chkcode,
			this.allElectricityData['payAmount']);

		//------------------------------------/


		if (check_account != '') {
			this.errorMsg['account'] = '';
		} else {
			this.errorMsg['account'] = 'PG_TAX.ERROR.TRNSFROUTACCNT';
		}

		if (check_dueDate.status) {
			this.errorMsg['dueDate'] = '';
		} else {
			this.errorMsg['dueDate'] = check_dueDate.msg;
		}

		if (check_custNum.status) {
			this.errorMsg['custNum'] = '';
		} else {
			this.errorMsg['custNum'] = check_custNum.msg;
		}

		if (check_payAmount.status) {
			this.errorMsg['payAmount'] = '';
		} else {
			this.errorMsg['payAmount'] = check_payAmount.msg;
		}

		if (check_chkcode.status) {
			this.errorMsg['chkcode'] = '';
		} else {
			this.errorMsg['chkcode'] = check_chkcode.msg;
		}

		if(!real_chkcode) {
			this.errorMsg['chkcode'] = 'PG_TAX.ELECTRICITY.CHKCODE_3';
		}


		if (check_account != '' && check_dueDate.status &&
			check_custNum.status && check_payAmount.status &&
			check_chkcode.status && real_chkcode
		) {
			this.allElectricityData = {
				account: this.allElectricityData['account'],
				dueDate: this.allElectricityData['dueDate'],
				custNum: this.allElectricityData['custNum'],
				payAmount: this.allElectricityData['payAmount'],
				chkcode: this.allElectricityData['chkcode'],
				businessType: this.info_data['businessType'],
				trnsToken: this.info_data['trnsToken'],
				SEND_INFO: this.allElectricityData.SEND_INFO,
				USER_SAFE: this.allElectricityData.USER_SAFE
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
			this.allElectricityData.SEND_INFO = e.sendInfo;
			this.allElectricityData.USER_SAFE = e.sendInfo.selected;
		} else {
			// do errorHandle 錯誤處理 推業或POPUP
			let error_obj: any = (!!e.ERROR) ? e.ERROR : e;
			error_obj['type'] = 'message';
			this._handleError.handleError(error_obj);
		}
	}


	// 確認頁返回編輯頁
	toEditPage(e) {
		this.allElectricityData.dueDate = DateUtil.transDate(this.allElectricityData.dueDate, { 'formate': 'yyyMMdd', 'chinaYear': true });
		if (e) {
			this._headerCtrl.setLeftBtnClick(() => {
				this.cancelEdit();
			});
			this.showPage = 'original'
		}
	}

	// 帳單範例說明
	billExample() {
		let purchaseUse = this.systemParameterService.get('EXMP_F7000301_URL');
		this.navgator.push(purchaseUse);
	}

	/**
	 * 20190906 Boy 加入電費檢核碼 
	 * @param dueDate    代收期限(1234567,固定7碼)  
	 * @param custNum    電號(12345678901,固定11碼)  
	 * @param chkcode    查核碼(123,固定3碼)         
	 * @param payAmount  應繳金額(最多九碼,且第一碼不得為零)    
	 * 
	 * step1. (代收期限7+電號11+查核碼2(取「後兩碼」)+應繳金額9)共29位數
	 */
	checkElectricityFeeNumber(dueDate: string, custNum: string,
		chkcode: string, payAmount: string) {

		const formateArray = [2, 1]; // 台電格式化資料--> 2121212.... 共有29位數
		const lastChecknumber = chkcode.toString().substr(1, 2); // 取得檢核碼第一位以後數值 '23'
		const resultHaveToPay = PadUtil.padLeft(payAmount, 9); // 應繳金額共9碼

		// (共29碼): 代收期限+電號+查核碼+金額	        
		let formulateInput = dueDate.toString()
			+ custNum.toString()
			+ lastChecknumber
			+ resultHaveToPay.toString();

		let sum_data = 0;
		for (let i = 0; i < formulateInput.length; i++) {
			let originalInput = parseInt(formulateInput[i]);
			let tempResult = originalInput * formateArray[i % 2];
			// --- 相乘結果 為10位數 要看作2個數字 --- //
			if (tempResult >= 10) {
				let decminal = Math.floor(tempResult / 10);// 十位數
				let units = tempResult % 10;// 個位數

				sum_data += decminal;
				sum_data += units;
			} else {
				sum_data += tempResult;

			}
		}
		let real_checkcode = sum_data;
		if (sum_data >= 10) {
			real_checkcode = sum_data % 10;
		}
		let output = false;
		if (real_checkcode.toString() == chkcode.toString().substring(0, 1)) {
			output = true;
		}
		return output;
	}



	/**
	 * 20190906 Boy 加入電號檢核
	 * 不為空值，長度不得小於11，要為數字
	 * @param custNum 
	 */
	checkCustNum(custNum: string) {
		let data = {
			status: false,
			msg: 'PG_TAX.ELECTRICITY.CUSTNUM_1',
			data: ''
		};

		if (typeof custNum !== 'string') {
			data.msg = 'PG_TAX.ELECTRICITY.CUSTNUM_3';
			return data;
		} else if(custNum == ''){
			return data;
		}

		let res = /^\d{11}$/; // 檢查11碼純數值
		if (custNum != '' && !res.test(custNum)) {
			data.msg = 'PG_TAX.ELECTRICITY.CUSTNUM_3';
		}

		if (custNum == '' || custNum.length != 11) {
			data.msg = 'PG_TAX.ELECTRICITY.CUSTNUM_2';
			return data
		}

		if (res.test(custNum)) {
			data.status = true;
			data.msg = '';
			return data;
		}
		data.data = custNum;
		return data;
	}


	/**
	 * 20190906 Boy 代收截止日檢核
	 * 最多7位數字
	 * @param str 
	 */

	checkDueDate(str: string) {
		let data = {
			status: false,
			msg: 'PG_TAX.ERROR.DUEDATE_3',
			data: ''
		};

		if (typeof str !== 'string') {
			return data;
		}

		let res = /^\d{7}$/; // 檢查7碼純數值
		if (str.length < 7 && str != '' && !res.test(str)) {
			data.msg = 'PG_TAX.ERROR.DUEDATE_4'
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
	 * 20190906 Boy 加入檢核碼檢核
	 * 最多三碼且都要數字
	 * @param chkCode 
	 */

	checkChkcode(chkCode: string){

		let data = {
			status: false,
			msg: 'PG_TAX.ELECTRICITY.CHKCODE_3',
			data: ''
		};

		if (typeof chkCode !== 'string') {
			return data;
		} else if(chkCode == ''){
			data.msg = 'PG_TAX.ELECTRICITY.CHKCODE_1';
			return data;
		}


		let res = /^\d{3}$/; // 檢查3碼純數值
		if (chkCode.length < 3 && chkCode != '' && !res.test(chkCode)) {
			data.msg = 'PG_TAX.ELECTRICITY.CHKCODE_2'
		}
		if (res.test(chkCode)) {
			data.status = true;
			data.msg = '';
			return data;
		}
		data.data = chkCode;
		return data;


	}




	/**
	 * 	送電文
	 * @param security 
	 * 
	 */

	public finalCheckData(security) {
		this._mainService.sendData(this.allElectricityData, security).then(
			(result) => {
				if (result.status) {
					this.showPage = 'result';
					this.electricityResultData = result.data;
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

