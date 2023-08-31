/**
 * Header
 * 健保/勞保/國民年金費
 * 
 * 國民年金  F7000501
 * 條碼一長度為9 條碼二長度為16 條碼三長度為15
 * 勞保     F7000601 
 * 條碼一長度為9 條碼二長度為16 條碼三長度為15
 * 健保     F7000701
 * 條碼一長度為9 條碼二長度為16 條碼三長度為15
 * 
 * 勞保/健保/國民年金
 * 該費用檢核碼在條碼三的第五碼與第六碼
 * 
 */
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { LaborHealthNationalService } from '../shared/service/labor-health-national.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ActivatedRoute } from '@angular/router';
import { FormateService } from '@shared/formate/formate.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';



@Component({
	selector: 'app-labor-health-national-page',
	templateUrl: './labor-health-national-page.component.html',
	styleUrls: [],
	providers: [LaborHealthNationalService]
})
export class LaborHealthNationalPageComponent implements OnInit, OnDestroy {
	/**
	 * 參數設定
	 * 
	 */

	info_data = {};            // F7000104所有資料
	acctNo = [];               // 轉出帳號
	trnsfrAmount = '';         // 繳款金額
	defaultAcctNoFlag = true ; // 轉出帳號預設判斷

	// 繳費頁面切換 ('original':原始繳費頁，'confirm':確認頁)
	showPage = 'original';

	// 頁面切換 ('health'：健保，'labor'：勞保，'national'：國民年金)
	changePage = 'health';
	type_name = '';

	// 編輯頁全部資料送至確認頁
	allLaborHealthNationalData = {
		account: '',
		barcode1: '',
		barcode2: '',
		barcode3: '',
		businessType: '',
		trnsToken: '',
		SEND_INFO: '',
		USER_SAFE: ''
	};
	// 結果頁全部資料
	laborHealthNationalResultData = {};

	// 將所有的錯誤資訊存入
	errorMsg = {
		account: '',
		barcode1: '',
		barcode2: '',
		barcode3: '',
	};

	// 安控機制
	transactionObj = {
		serviceId: 'f7000501',  // f7000501 勞保 f7000601 國民年金 f7000701 健保
		categoryId: '2',
		transAccountType: '2'
	};

	scanObjectSubscription: any;
	routeQueryParamsSubscription: any;
	displayScanBoxSubscription: any;

	constructor(
		private _mainService: LaborHealthNationalService,
		private _headerCtrl: HeaderCtrlService,
		private confirm: ConfirmService,
		private alert: AlertService,
		private navgator: NavgatorService,
		private _handleError: HandleErrorService,
		private route: ActivatedRoute,
		private _formateService: FormateService,
		private systemParameterService: SystemParameterService,
		private authService: AuthService,
		private _uiContentService: UiContentService,
		private zone: NgZone
	) { }

	ngOnInit() {
		this._reset();
		//取得帶過來的參數(url)
		this.routeQueryParamsSubscription = this.route.queryParams.subscribe(params => {
			this.type_name = this._formateService.checkField(params, "type");
			if (this.type_name == 'labor') {
				this.changePage = 'labor';
			} else if (this.type_name == 'national') {
				this.changePage = 'national';
				this.transactionObj.serviceId = 'f7000601'; // f7000501 勞保 f7000601 國民年金 f7000701 健保
			} else {
				this.changePage = 'health';
				this.transactionObj.serviceId = 'f7000701'; // f7000501 勞保 f7000601 國民年金 f7000701 健保
			}
		});
		this.scanObjectSubscription = this.navgator.scanObj.subscribe((obj) => {
			// 掃描三個條碼自動回來
			let code1 = (!!obj.barCodeOne) ? obj.barCodeOne.toString().toLocaleUpperCase() : '';
			let code2 = (!!obj.barCodeTwo) ? obj.barCodeTwo.toString().toLocaleUpperCase() : '';
			let code3 = (!!obj.barCodeThird) ? obj.barCodeThird.toString().toLocaleUpperCase() : '';
			this.allLaborHealthNationalData.barcode1 = code1;
			this.allLaborHealthNationalData.barcode2 = code2;
			this.allLaborHealthNationalData.barcode3 = code3;
			this.restartScroll();
		});
		this.displayScanBoxSubscription = this.navgator.displayScanBoxSubject.subscribe((display: boolean) => {
			if (!display) { // 從掃描回來編輯
				this.restartScroll();
			}
		});
		if (this.authService.getUserInfo().isTax != '1') {
			this.alert.show('TRANS_SECURITY.ERROR.201', {
				title: '提醒您'
			}).then(
				() => {
					//確定
					this.navgator.push('taxes-fees');
				}
			);
			return;
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
		if (this.allLaborHealthNationalData['account'] != '') {
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
				}else if (this.acctNo.length == 1) {
					this.allLaborHealthNationalData.account = this.acctNo[0].acctNo;
					this.defaultAcctNoFlag = false;
					this.onChangeType(this.allLaborHealthNationalData.account);
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
	 * 前往確認頁
	 * @param payNo 
	 * @param payEndDate 
	 * @param trnsfrAmount 
	 * 
	 */

	goConfirm() {
		this.allLaborHealthNationalData['barcode1'] = this.allLaborHealthNationalData['barcode1'].toLocaleUpperCase();
		this.allLaborHealthNationalData['barcode2'] = this.allLaborHealthNationalData['barcode2'].toLocaleUpperCase();
		this.allLaborHealthNationalData['barcode3'] = this.allLaborHealthNationalData['barcode3'].toLocaleUpperCase();

		const check_account = this.allLaborHealthNationalData['account'];     // 轉出帳號(扣款帳號)
		const check_barcode1 = this.allLaborHealthNationalData['barcode1'];  // barcode1
		const check_barcode2 = this.allLaborHealthNationalData['barcode2'];  // barcode2
		const check_barcode3 = this.allLaborHealthNationalData['barcode3'];  // barcode3
		const checkNumber = this.genCheckCode(check_barcode1,check_barcode2,check_barcode3); // 送入三條碼可算出檢查碼
		const final_check = check_barcode3.substring(4, 6);

		if (check_account != '') {
			this.errorMsg['account'] = '';
		} else {
			this.errorMsg['account'] = 'PG_TAX.ERROR.TRNSFROUTACCNT';
		}

		if (check_barcode1 != '' && check_barcode1.length == 9) {
			this.errorMsg['barcode1'] = '';
		}  else if (check_barcode1.length != 9) {
			this.errorMsg['barcode1'] = 'PG_TAX.ERROR.ERROR_BARCODE_1';
		} else {
			this.errorMsg['barcode1'] = 'PG_TAX.LABORHEALTHNATIONAL.BARCODE_1';
		}

		if (check_barcode2 != ''&& check_barcode2.length == 16) {
			this.errorMsg['barcode2'] = '';
		} else if (check_barcode2.length != 16) {
			this.errorMsg['barcode2'] = 'PG_TAX.ERROR.ERROR_BARCODE_2';
		}  else {
			this.errorMsg['barcode2'] = 'PG_TAX.LABORHEALTHNATIONAL.BARCODE_2';
		}

		if (check_barcode3 != ''  && check_barcode3.length == 15) {
			this.errorMsg['barcode3'] = '';
		} else if (check_barcode3.length != 15) {
			this.errorMsg['barcode3'] = 'PG_TAX.ERROR.ERROR_BARCODE_3';
		}  else {
			this.errorMsg['barcode3'] = 'PG_TAX.LABORHEALTHNATIONAL.BARCODE_3';
		}


		if (check_account != '' && this.errorMsg['barcode1'] == '' && 
			this.errorMsg['barcode2'] == '' && this.errorMsg['barcode3'] == '' && 
			(checkNumber == final_check)) {
			this.allLaborHealthNationalData = {
				account: this.allLaborHealthNationalData['account'],
				barcode1: this.allLaborHealthNationalData['barcode1'],
				barcode2: this.allLaborHealthNationalData['barcode2'],
				barcode3: this.allLaborHealthNationalData['barcode3'],
				businessType: this.info_data['businessType'],
				trnsToken: this.info_data['trnsToken'],
				SEND_INFO: this.allLaborHealthNationalData.SEND_INFO,
				USER_SAFE: this.allLaborHealthNationalData.USER_SAFE
			};
			this.trnsfrAmount = this.allLaborHealthNationalData.barcode3.substring(6, this.allLaborHealthNationalData.barcode3.length);
			this.showPage = 'confirm';
		} else if(checkNumber != final_check){
			this._handleError.handleError({
				type: 'dialog',
				title: '提醒您',
				content: 'PG_TAX.ERROR.CHECKNUMBER'
			});
		} else {
			this._handleError.handleError({
				type: 'dialog',
				title: '提醒您',
				content: "輸入項目有誤，請再次確認輸入欄位。"
			});
			// 當使用者輸入有誤時，將頁面拉回最上方。
			this._uiContentService.scrollTop();
			this.barCodeTable();
		}

	}


	/**
	 * 	安控選擇
	 * @param e 
	 */
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.allLaborHealthNationalData.SEND_INFO = e.sendInfo;
			this.allLaborHealthNationalData.USER_SAFE = e.sendInfo.selected;
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
			this.showPage = 'original';
		}
	}

	/**
	 * 帳單範例說明
	 */

	billExample(type: any) {
		if (type == 'health') {
			let purchaseUse = this.systemParameterService.get('EXMP_F7000701_URL');
			this.navgator.push(purchaseUse);
		} else if (type == 'labor') {
			let purchaseUse = this.systemParameterService.get('EXMP_F7000501_URL');
			this.navgator.push(purchaseUse);
		} else {
			let purchaseUse = this.systemParameterService.get('EXMP_F7000601_URL');
			this.navgator.push(purchaseUse);

		}
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
		// 繳勞保費
		if (this.type_name == 'labor') {
			this._mainService.sendLaborData(this.allLaborHealthNationalData, security).then(
				(result) => {
					if (result.status) {
						this.showPage = 'result';
						this.laborHealthNationalResultData = result.data;
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
				});
			// 繳國民年金費
		} else if (this.type_name == 'national') {
			this.transactionObj.serviceId = 'F7000601';
			this._mainService.sendNationalData(this.allLaborHealthNationalData, security).then(
				(result) => {
					if (result.status) {
						this.showPage = 'result';
						this.laborHealthNationalResultData = result.data;
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
				});
			// 繳健保費
		} else {
			this.transactionObj.serviceId = 'F7000701';
			this._mainService.sendHealthData(this.allLaborHealthNationalData, security).then(
				(result) => {
					if (result.status) {
						this.showPage = 'result';
						this.laborHealthNationalResultData = result.data;
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
				});
		}
	}

	private _reset() {
		this.allLaborHealthNationalData = {
			account: '',
			barcode1: '',
			barcode2: '',
			barcode3: '',
			businessType: '',
			trnsToken: '',
			SEND_INFO: '',
			USER_SAFE: ''
		};
	}

	/**
	 * 重設捲動
	 */
	restartScroll() {
		const sections = document.getElementsByTagName('section');
		for (let i = 0; i < sections.length; i++) {
			sections[i].style.overflowY = 'auto';
		}
	}

	ngOnDestroy() {
		this.scanObjectSubscription.unsubscribe();
		this.displayScanBoxSubscription.unsubscribe();
		this.routeQueryParamsSubscription.unsubscribe();
	}

	/**
	 * 20191017 Boy  勞保/健保/國民年金 三段條碼檢核
	 * @param barCodeOne 
	 * @param barCodeTwo 
	 * @param barCodeThird 
	 */

	private genCheckCode(barCodeOne: string, barCodeTwo: string, barCodeThird: string) {
		barCodeOne = barCodeOne.toUpperCase();
		barCodeTwo = barCodeTwo.toUpperCase();
		barCodeThird = barCodeThird.toUpperCase();

		let realChekCodeOne = '';
		let realChekCodeTwo = '';

		/********** 條碼一 ***********/
		let barCodeOneEventsValues = parseInt(this.getEvensAndOdd(barCodeOne)[0]);
		let barCodeOneOddValues = parseInt(this.getEvensAndOdd(barCodeOne)[1]);
		/********** 條碼一 ***********/

		/********** 條碼二 ***********/
		let barCodeTwEventsValues = parseInt(this.getEvensAndOdd(barCodeTwo)[0]);
		let barCodeTwoOddValues = parseInt(this.getEvensAndOdd(barCodeTwo)[1]);
		/********** 條碼二 ***********/

		/********** 條碼三 ***********/
		let fetchBarCodeThird = barCodeThird.substring(0, 4) + barCodeThird.substring(6, barCodeThird.length);
		let barCodeThirdEventsValues = parseInt(this.getEvensAndOdd(fetchBarCodeThird)[0]);
		let barCodeThirdOddValues = parseInt(this.getEvensAndOdd(fetchBarCodeThird)[1]);
		/********** 條碼三 ***********/

		/**
		 * 檢查碼第一碼產生規則: (條碼1奇數位值總和 + 條碼2奇數位值總和 + 條碼3去掉檢查碼(條碼3的第5碼及第6碼)後之奇數位值總和)
		 * **/
		if ((barCodeOneEventsValues + barCodeTwEventsValues + barCodeThirdEventsValues) % 11 == 0) {
			realChekCodeOne = "A";
		} else if ((barCodeOneEventsValues + barCodeTwEventsValues + barCodeThirdEventsValues) % 11 == 10) {
			realChekCodeOne = "B";
		} else {
			realChekCodeOne = ((barCodeOneEventsValues + barCodeTwEventsValues + barCodeThirdEventsValues) % 11).toString();
		}
		/**
		 * 檢查碼第二碼產生規則: (條碼1偶數位值總和 + 條碼2偶數位值總和 + 條碼3去掉檢查碼(條碼3的第5碼及第6碼)後之偶數位值總和)
		 **/

		if ((barCodeOneOddValues + barCodeTwoOddValues + barCodeThirdOddValues) % 11 == 0) {
			realChekCodeTwo = "X";
		} else if ((barCodeOneOddValues + barCodeTwoOddValues + barCodeThirdOddValues) % 11 == 10) {
			realChekCodeTwo = "Y";
		} else {
			realChekCodeTwo = ((barCodeOneOddValues + barCodeTwoOddValues + barCodeThirdOddValues) % 11).toString();
		}
		return (realChekCodeOne + realChekCodeTwo);

	}


	// return 純數字陣列
	private getEvensAndOdd(barCode: string) {
		barCode = barCode.toUpperCase();
		let pAlphabet = /^[A-Za-z]+$/;   // 判斷是否為數字
		let pNumber = /^[0-9]$/;         // 檢查純數值
		let evensAndOdd = [];
		let barCodeOneOddValues = 0;
		let barCodeOneEventsValues = 0;


		for (let i = 0; i < barCode.length; i++) {
			let odd = "";
			let events = "";
			if (i % 2 == 1) {
				odd = (barCode.charAt(i));// 偶數因為字元排列index是從0開始
			} else if (i % 2 == 0) {
				events = (barCode.charAt(i));// 奇數因為字元排列index是從0開始
			}

			if (pAlphabet.test(odd)) { // 是英文字母
				barCodeOneOddValues = barCodeOneOddValues + parseInt(this.barCodeTable()[odd]);
			} else if (pNumber.test(odd)) {// 是數字
				barCodeOneOddValues = barCodeOneOddValues + parseInt(odd);
			}
			if (pAlphabet.test(events)) {// 是英文字母
				barCodeOneEventsValues = barCodeOneEventsValues + parseInt(this.barCodeTable()[events]);
			} else if (pNumber.test(events)) { // 是數字
				barCodeOneEventsValues = barCodeOneEventsValues + parseInt(events);
			}
		}
		evensAndOdd[0] = barCodeOneEventsValues;
		evensAndOdd[1] = barCodeOneOddValues;
		return evensAndOdd;
	}


	/**
	 * 20191017 Boy  勞保/健保/國民年金 三段條碼檢核
	 * 條碼長度限制: 條碼一 : 9 條碼二 : 16 條碼三 : 15
	 * 
	 * 條碼資料檢核 檢查碼第一碼產生規則: (條碼1奇數位值總和 + 條碼2奇數位值總和 +
	 * 條碼3去掉檢查碼(條碼3的第5碼及第6碼)後之奇數位值總和) 除以11所得之餘數，如果餘數為0，則放A；餘數為10，則放B。
	 * 檢查碼第二碼產生規則: (條碼1偶數位值總和 + 條碼2偶數位值總和 + 條碼3去掉檢查碼(條碼3的第5碼及第6碼)後之偶數位值總和)
	 * 除以11所得之餘數，如果餘數為0，則放X；餘數為10，則放Y
	 */
	private barCodeTable() {
		let barCodeTableList = {};
		barCodeTableList['A'] = '1';
		barCodeTableList['B'] = '2';
		barCodeTableList['C'] = '3';
		barCodeTableList['D'] = '4';
		barCodeTableList['E'] = '5';
		barCodeTableList['F'] = '6';
		barCodeTableList['G'] = '7';
		barCodeTableList['H'] = '8';
		barCodeTableList['I'] = '9';
		barCodeTableList['J'] = '1';
		barCodeTableList['K'] = '2';
		barCodeTableList['L'] = '3';
		barCodeTableList['M'] = '4';
		barCodeTableList['N'] = '5';
		barCodeTableList['O'] = '6';
		barCodeTableList['P'] = '7';
		barCodeTableList['Q'] = '8';
		barCodeTableList['R'] = '9';
		barCodeTableList['S'] = '2';
		barCodeTableList['T'] = '3';
		barCodeTableList['U'] = '4';
		barCodeTableList['V'] = '5';
		barCodeTableList['W'] = '6';
		barCodeTableList['X'] = '7';
		barCodeTableList['Y'] = '8';
		barCodeTableList['Z'] = '9';
		barCodeTableList['+'] = '1';
		barCodeTableList['%'] = '2';
		barCodeTableList['-'] = '6';
		barCodeTableList['.'] = '7';
		barCodeTableList[' '] = '8';
		barCodeTableList['$'] = '9';
		return barCodeTableList;
	}






}