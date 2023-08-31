/**
 * Epay 消費扣款
 * 
 */

import { Component, OnInit } from '@angular/core';
import { FQ000112ApiService } from '@api/fq/fq000112/fq000112-api.service';
import { FQ000114ApiService } from '@api/fq/fq000114/fq000114-api.service';
import { FQ000105ApiService } from '@api/fq/fq000105/fq000105-api.service';
import { FQ000112ReqBody } from '@api/fq/fq000112/fq000112-req';
import { QRTpyeCardService } from '@pages/epay-card/shared/qrocdeType-card.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { EPayCardService } from '@pages/epay-card/shared/epay-card.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckService } from '@shared/check/check.service';
import { ConfirmCheckBoxService } from '@shared/popup/confirm-checkbox/confirm-checkbox.service';
import { FQ000116ReqBody } from '@api/fq/fq000116/fq000116-req';
import { logger } from '@shared/util/log-util';

@Component({
	selector: 'app-edit-one-card',
	templateUrl: './edit-one-card.component.html',
	styleUrls: ['./edit-one-card.component.css']
})
export class EditOneCardComponent implements OnInit {

	isTwpay: any;
	trnsfrOutCard: any;
	getCardType = '';
	cardData: any;
	webToAppRes: FQ000116ReqBody;

	disableCardAmountInput: any;
	disablemobileNumberInput: any;
	mobileNumberDisply: any;
	disablebillNumberInput: any = true;
	billNumberDisply: any;
	selectedItem = '2';
	barcode = [];
	noBarcode: any;
	barcodeStyle: any;
	defaultBarcode: any;
	anotherBarcode: any;
	securityTypes: any;
	selectSecurityType: any;
	trnsLimitAmt: any;
	disableAmountInput: any = true;
	disableOrderNumberInput: any = true;

	/**
	 * 控制'類別',類別欄位是信用卡與金融卡的切換
	 * (不開啟)TWQRP只限金融卡(禁信用卡)
	 * (不開啟)EMV TransType:1(純信用卡)
	 * (開啟)EMV TransType:2(整合型,金融卡+信用卡)
	 * (不開啟)EMV TransType:3(金融卡)
	 * 所以預設false
	 */
	/**
	 * 控制'類別',類別欄位是信用卡與金融卡的切換
	 * (不開啟)TWQRP只限金融卡 --無法使用
	 * (不開啟)EMV TransType:1(純信用卡) --可以使用
	 * (開啟)EMV TransType:2(整合型,金融卡+信用卡)	--可以使用
	 * (不開啟)EMV TransType:3(金融卡)	--無卡使用
	 * 所以預設false
	 */
	isEmv: boolean = true;

	/**
	 * 切換信用卡或金融卡而變換logo
	 * CARD,VISA,MASTER,JOB
	 */

	iconFlag = 'CARD';


	/** 
	 * 金融卡區塊
	 * TWQRP
	 * EMV Type = 2
	 */
	meansTransactionMoney = true;

	/**
	 * 信用卡區塊
	 * EMV Type = 2,3
	 * 
	 */
	meansTransactionCard = false;

	// 交易帳號(金融卡)
	defaultTrnsOutAcct = '';

	// 交易卡號(信用卡)
	defaultTrnsCard = '';

	/**
	 * 信用卡金融卡image 切換
	 * 
	 */

	imageFlag = {
		trnsfrOutAcct: '',  // 金融卡
		trnsfrOutCard: ''   // 信用卡
	}

	// fq0000112 信用卡body資料 20190731 Boy
	creditCards = [];


	// 金額檢核必要參數
	currency = {
		currency: 'TWD'
	}

	// key:1,name:金融卡  ;  key:2,name:信用卡
	selectType = {
		name: '信用卡',
		acct: '',
		key: '2'
	};
	form: any = {
		trnsfrOutAcct: '',
		secureCode: '',
		acqInfo: '',
		trnsAmount: ''
	};
	transactionObj = {
		serviceId: 'FF000104',
		categoryId: '7',
		transAccountType: '1',
	};
	errorMsg = {
		billNumber: '',
		transactionAmout: '',
		mobileNumber: '',
		trnsAmount: '',
		orderNumber: '',
	};
	paymentData: any;
	qrcodeObj = {
		hostCodeMsg: '',
		merchantName: '',
		countryCode: '',
		trnsType: '',
		version: '',
		txnAmt: '',
		canAmtEdit: '',
		orderNbr: '',
		secureCode: '',
		deadlinefinal: '',
		transfereeBank: '',
		transfereeAccount: '',
		noticeNbr: '',
		otherInfo: '',
		note: '',
		txnCurrencyCode: '',
		acqInfo: '',
		qrExpirydate: '',
		feeInfo: '',
		charge: '',
		feeName: ''
	};



	constructor(
		private qrcode: QRTpyeCardService,
		private navgator: NavgatorService,
		private fq000112: FQ000112ApiService,
		private fq000114: FQ000114ApiService,
		private fq000105: FQ000105ApiService,
		private auth: AuthService,
		private handleError: HandleErrorService,
		private confirm: ConfirmService,
		private localStorage: LocalStorageService,
		private epay: EPayCardService,
		private _uiContentService: UiContentService,
		private alert: AlertService,
		private _headerCtrl: HeaderCtrlService,
		private _errorCheck: CheckService,
		private _confirmCheckBoxService: ConfirmCheckBoxService
	) { }

	ngOnInit() {
	    if (this.navgator.getParams().webToAppRes) {
	      this.webToAppRes = this.navgator.getParams().webToAppRes;
	    }
		this._init();
		this.securityServices();
		this._headerCtrl.updateOption({
			'title': 'QRCode消費扣款'
		});
	    this._headerCtrl.setLeftBtnClick(() => {
	      if (this.navgator.getParams().webToAppRes) {
	        // this.navgator.push('epay-card');
	        this.webToAppRes = null;
		  }
		  this.clickCancel();
	    });
	}

	_init() {
		// TWQRP -- isTwpay:1 , EMV -- isTwpay:0
		this.isTwpay = this.qrcode.TaiwanPayTypeGet();
		// 取得 信用卡(交易卡號)
		this.trnsfrOutCard = this.qrcode.trnsfrOutCardGet();
		this.cardData = this.qrcode.fq000102ResGet();
		this.sendFQ000101();
		if (this.isTwpay != '1') {
			// 進入EMV
			// 是否有信用卡卡號
			if (typeof this.trnsfrOutCard == 'undefined' || this.trnsfrOutCard == '') {
				if (this.cardData.transType != '3') {
					// 進入EMV Type 2 ---- 金融卡+信用卡
					this.getCardType = this.trnsfrOutCard;
					const form = new FQ000112ReqBody();
					let userData = this.auth.getUserInfo();
					form.custId = userData.custId;
					this.fq000112.send(form)
						.then(
							(fq000112res) => {
								this.creditCards = fq000112res.body.creditCards;
								// 檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
								if (this.creditCards == null || this.creditCards['creditCard'] == null) {
									// 走金融卡頁面
        						    let today = new Date();
									this._confirmCheckBoxService.show('是否申請信用卡', {
										title: '提醒您',
										checkbox: '本日不再提醒我'
									  }).then(
										apply => {
										  if (apply.checked) {
											this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
										  } else {
											this.localStorage.set('nextAsk_bindCard', '0');
										  }
										  this.navgator.push('web:apply');
										},
										not_apply => {
										  if (not_apply.checked) {
											this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
										  } else {
											this.localStorage.set('nextAsk_bindCard', '0');
										  }
										  this.alert.show('無信用卡,無法進行此交易')
										  this.navgator.push('epay-card');
										}
									  );
								} else {
									this.qrcode.hasCardsSet(1);
									// 判斷有無預設信用卡
									let today = new Date();
									if (this.localStorage.get('nextAsk_bindCard') != today.getDate().toString()) {
										// 是否要綁定信用卡
										this._confirmCheckBoxService.show('是否綁定預設信用卡', {
											title: '提醒您',
											checkbox: '本日不再提醒我'
										}).then(
											res => {
												if (res.checked) {
													this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
												} else {
													this.localStorage.set('nextAsk_bindCard', '0');
												}
												this.navgator.push('cardlogin-qrcodePayCardTerms');
											}, error => {
												if (error.checked) {
													this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
												} else {
													this.localStorage.set('nextAsk_bindCard', '0');
												}
												this.alert.show('無綁定預設信用卡,無法進行此交易')
												this.navgator.push('epay-card');
												// this.isEmv = false;
												// this.meansTransactionMoney = true;
												// this.meansTransactionCard = false;
												// this.selectedItem = '1';
												// this.checkMethod();
											}
										);
									} else {
										// 走金融卡頁面
										// this.isEmv = false;
										// this.meansTransactionMoney = true;
										// this.meansTransactionCard = false;
										// this.selectedItem = '1';
										// this.checkMethod();
										this.showNoSupport();
									}
								}
							}).catch(
								error => {
									this.handleError.handleError(error);
								});
				} else {
					// 進入EMV Type 3 ----金融卡
					// this.isEmv = false;
					// this.meansTransactionMoney = true;
					// this.meansTransactionCard = false;
					// this.selectedItem = '1';
					// this.checkMethod();
					this.showNoSupport();
				}
			} else {
				let cardType = this.trnsfrOutCard.substr(0, 1);
				if (cardType == '3') {
					this.getCardType = 'JCB';
					// this.webToAppRes.cardPlan = 'J';
					this.setCardPlan('J');
				} else if (cardType == '4') {
					this.getCardType = 'VISA';
					// this.webToAppRes.cardPlan = 'V';
					this.setCardPlan('V');
				} else if (cardType == '2' || cardType == '5') {
					this.getCardType = 'MASTER';
					// this.webToAppRes['cardPlan'] = 'M';
					this.setCardPlan('M');
				}
				this.checkMethod();
			}
		} else {
			// 進入 TWQRP(僅限金融卡)
			this.showNoSupport();
		}

		let getCardType = this.trnsfrOutCard.substr(0, 1);
		if (getCardType == '3') {
			this.iconFlag = 'JCB';
		} else if (getCardType == '4') {
			this.iconFlag = 'VISA';
		} else if ((getCardType == '2' || getCardType == '5')) {
			this.iconFlag = 'MASTER';
		} 
	}

	async sendFQ000101() {
		try {
			const fq000101Data: any = await this.epay.sendFQ000101('T');
			let tempList: any;
			let barcodeListCount: any = localStorage.getItem('defaultBarcode') != null ? localStorage.getItem('defaultBarcode') : 1;
			// tslint:disable-next-line: radix
			barcodeListCount = parseInt(barcodeListCount);
			if ((fq000101Data.mobileBarcode == '') || (typeof fq000101Data.mobileBarcode == 'undefined')) {
			} else {
				tempList = {};
				tempList.name = '手機條碼 ' + fq000101Data.mobileBarcode;
				tempList.key = 'MB';
				tempList.code = fq000101Data.mobileBarcode;
				if (barcodeListCount == 2) {
					this.barcode[1] = tempList;
				} else {
					this.barcode[0] = tempList;
				}
			}
			if ((fq000101Data.loveCode == '') || (typeof fq000101Data.loveCode == 'undefined')) {
			} else {
				tempList = {};
				tempList.name = '捐贈碼 ' + fq000101Data.loveCode;
				tempList.key = 'LC';
				tempList.code = fq000101Data.loveCode;
				if (this.barcode[0] != null) {
					this.barcode[1] = tempList;
				} else {
					this.barcode[0] = tempList;
				}
			}
			this.noBarcode = 'Y';
			if (this.barcode.length > 0) {
				this.noBarcode = 'N';
				if (this.barcode.length > 1) {
					this.barcodeStyle = 'haveBarcode';
				} else {
					this.barcodeStyle = 'noBarcode';
				}
				this.defaultBarcode = this.barcode[0];
			} else {
				this.barcodeStyle = 'noBarcode';
			}
			this.setHtmlData();
		} catch (error) {
			this.handleError.handleError(error);
		}
	}

	changeBarcode(e) {
		this.defaultBarcode = this.barcode[e.target.selectedIndex];
	}

	// 沒有發票載具條碼
	getBarcode() {
		this.navgator.push('cardlogin-getBarcodeTerm');
	}

	securityServices() {
		// 安控資料取得
		let security_data = this.qrcode.getSecurityData();
		this.securityTypes = security_data.securityTypes;
		if (!!security_data.selectSecurityType) {
			this.onChangeSecurity(security_data.selectSecurityType);
		}
		// this.securityTypes = this.qrcode.securityServicesGet();
		// // this.securityTypes = [{
		// //   name: '憑證',
		// //   key: 'NONSET'
		// // }, {
		// //   name: 'OTP',
		// //   key: 'OTP'
		// // }, {
		// //   name: 'SSL',
		// //   key: 'SSL'
		// // }, {
		// //   name: '快速交易',
		// //   key: 'Biometric'
		// // }];
		// if (localStorage.getItem('defaultType') != null && localStorage.getItem('defaultType') != '') {
		// 	this.selectSecurityType = JSON.parse(localStorage.getItem('defaultType'));
		// } else {
		// 	this.selectSecurityType = this.securityTypes[0];
		// }
	}

	onChangeSecurity(security) {
		this.selectSecurityType = security;
	}

	setHtmlData() {
		const response = this.navgator.getParams();
		logger.error('Para',response);
		this.qrcodeObj = response.qrcode;
		this.trnsLimitAmt = response.trnsLimitAmt;

		this.form.trnsfrOutAcct = response.trnsfrOutAcct;
		// 放入金融卡卡號
		this.defaultTrnsOutAcct = this.form.trnsfrOutAcct;
		// 放入信用卡卡號
		this.defaultTrnsCard = this.trnsfrOutCard;
		this.form.secureCode = response.qrcode.secureCode;
		this.form.acqInfo = response.qrcode.acqInfo;

		if (response.qrcode.txnAmt != null && response.qrcode.txnAmt != '' && typeof (response.qrcode.txnAmt) != 'object') {

			// tslint:disable-next-line: radix
			this.form.trnsAmount = parseInt(response.qrcode.txnAmt) / 100;
			this.disableAmountInput = true;
		} else {
			this.disableAmountInput = false;
		}
		// 訂單編號(針對可能為空值特別處理)
		if (response.qrcode.orderNbr != null && typeof (response.qrcode.orderNbr) != 'object') {
			this.form.orderNumber = response.qrcode.orderNbr;
			this.disableOrderNumberInput = true;
		} else {
			this.disableOrderNumberInput = false;
		}
		// 交易幣別(針對可能為空值特別處理)
		if (response.qrcode.txnCurrencyCode != null && typeof (response.qrcode.txnCurrencyCode) != 'object') {
			this.form.txnCurrencyCode = response.qrcode.txnCurrencyCode;
		}

		// QRCode效期(針對可能為空值特別處理)
		if (response.qrcode.qrExpirydate != null && typeof (response.qrcode.qrExpirydate) != 'object') {
			this.form.qrExpirydate = response.qrcode.qrExpirydate;
		}
	}
	onType(e) {
		let getCardType = this.trnsfrOutCard.substr(0, 1);
		if (getCardType == '3' && e.target.value == '2') {
			this.iconFlag = 'JCB';
			this.meansTransactionMoney = false;
			this.meansTransactionCard = true;
			this.selectType.key = '2';
			this.selectedItem = '2';
			// this.webToAppRes.cardPlan = 'J';
			this.setCardPlan('J');
		} else if (getCardType == '4' && e.target.value == '2') {
			this.iconFlag = 'VISA';
			this.meansTransactionMoney = false;
			this.meansTransactionCard = true;
			this.selectType.key = '2';
			this.selectedItem = '2';
			// this.webToAppRes.cardPlan = 'V';
			this.setCardPlan('V');
		} else if ((getCardType == '2' || getCardType == '5') && e.target.value == '2') {
			this.iconFlag = 'MASTER';
			this.meansTransactionMoney = false;
			this.meansTransactionCard = true;
			this.selectType.key = '2';
			this.selectedItem = '2';
			// this.webToAppRes.cardPlan = 'M';
			this.setCardPlan('M');
		} else {
			this.iconFlag = 'CARD';
			// this.meansTransactionMoney = true;
			// this.meansTransactionCard = false;
			// this.selectType.key = '1';
			// this.selectedItem = '1';
			// this.webToAppRes.cardPlan = 'F';
			this.setCardPlan('F');
		}

		this.errorMsg = {
			billNumber: '',
			transactionAmout: '',
			mobileNumber: '',
			trnsAmount: '',
			orderNumber: '',
		};
	}

	clickCancel() {
		this.navgator.push('epay-card');
	}
	/**
	 * 點選確認
	 */
	clickSubmit() {
		logger.error('clickSubmit',this.cardData.transactionAmout);
		if (this.meansTransactionCard) {
			// 信用卡檢核
			this.selectType.key = '2';
			// 如果是信用卡要判斷電話是否為空值
			if (this.billNumberDisply) {
				if ((this.cardData.billNumber == null || this.cardData.billNumber.length == 0)) {
					this.errorMsg.billNumber = '請輸入訂單編號';
				} else {
					this.errorMsg.billNumber = '';
				}
			}
			/** 20191005 Boy 加入交易金額判斷 */
			const cardTrnsAmount = this._errorCheck.checkMoney(this.cardData.transactionAmout, this.currency);
			if (cardTrnsAmount.status) {
				this.errorMsg.transactionAmout = '';
			} else {
				this.errorMsg.transactionAmout = '請輸入交易金額';
			}
			/**--------------------------- */
			if (this.mobileNumberDisply) {
				if ((this.cardData.mobileNumber == null || this.cardData.mobileNumber.length == 0)) {
					this.errorMsg.mobileNumber = '請輸入電話號碼';
				} else {
					this.errorMsg.mobileNumber = '';
				}
			}
			let limit = parseInt(this.trnsLimitAmt) / 100;
			if (this.cardData.transactionAmout > limit) {
				this.errorMsg.transactionAmout = '一般交易金額每筆限新臺幣五萬元(不含稅費)';
			}

			if (this.errorMsg.billNumber != '' || this.errorMsg.transactionAmout != '' || this.errorMsg.mobileNumber != '') {
				// 當使用者輸入有誤時，將頁面拉回最上方。
				this._uiContentService.scrollTop();
				return;
			}
		} else {
			// 金融卡檢核
			/** 20191005 Boy 加入交易金額判斷 */
			const trnsAmount = this._errorCheck.checkMoney(this.form.trnsAmount, this.currency);
			if (trnsAmount.status) {
				this.errorMsg.transactionAmout = '';
			} else {
				this.errorMsg.transactionAmout = '請輸入交易金額';
			}
			/**--------------------------- */
			if (this.form.orderNumber == null || this.form.orderNumber.length == 0) {
				this.errorMsg.billNumber = '請輸入訂單編號';
			} else {
				this.errorMsg.billNumber = '';
			}

			// 檢查單日限額
			let limit = parseInt(this.trnsLimitAmt) / 100;
			if (this.form.trnsAmount > limit) {
				this.errorMsg.transactionAmout = '一般交易金額每筆限新臺幣五萬元(不含稅費)';
			}
			if (this.errorMsg.billNumber != '' || this.errorMsg.transactionAmout != '') {
				// 當使用者輸入有誤時，將頁面拉回最上方。
				this._uiContentService.scrollTop();
				return;
			}
		}

		this.paymentData = this.form;
		let info = this.auth.getUserInfo();
		if (this.selectSecurityType.key == 'NONSET' && (info.cn == null || info.cn == '')) {
			this.alert.show('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。');
			return;
		}
		let selectTypetemp = this.selectType.key;
		if (selectTypetemp == '1' || !this.isEmv) {
			// 金融卡交易
			let outBarcode = '';
			if (this.barcode.length > 0) {
				outBarcode = this.defaultBarcode.code;
			}
			this.paymentData.custId = info.custId;
			let formCopy = { ...this.paymentData }; // 因顯示和實際發出資料會有不同所以copy一份以免異常
			formCopy.trnsAmount = formCopy.trnsAmount * 100;
			formCopy.trnsAmount = formCopy.trnsAmount.toString();
			formCopy.merchantName = encodeURI(this.qrcodeObj.merchantName);
			formCopy.mobileBarcode = outBarcode;
			let reqponse = {
				custId: formCopy.custId,
				trnsfrOutAcct: formCopy.trnsfrOutAcct,
				orderNumber: formCopy.orderNumber,
				trnsAmount: formCopy.trnsAmount,
				secureCode: formCopy.secureCode,
				txnCurrencyCode: formCopy.txnCurrencyCode,
				acqInfo: formCopy.acqInfo,
				qrExpirydate: formCopy.qrExpirydate,
				trnsToken: '',
				merchantName: formCopy.merchantName,
				mobileBarcode: formCopy.mobileBarcode
			};
			const CA_Object = {
				securityType: '',
				serviceId: 'FQ000105',
				signText: reqponse,
			};
			logger.info('this.selectSecurityType',this.selectSecurityType);
			this.qrcode.getSecurityInfo(CA_Object, this.selectSecurityType).then(
				resSecurityInfo => {
					let reqHeader = {
						header: resSecurityInfo.headerObj
					};
					this.fq000105.send(resSecurityInfo.responseObj.signText, reqHeader).then(
						(res) => {
							if (this.qrcode.isCheckResponse(res)) {
								res.body.merchantName = this.qrcodeObj.merchantName;
								let params = {
									qrcode: this.qrcode,
									result: res,
									means: 'financial',
									detail: 'qrcodePayResult',
									webToAppRes: this.webToAppRes ? this.webToAppRes : ''
								};
								this.navgator.push('cardlogin-qrcodePayResult', params);
								localStorage.setItem('lastTransaction', '1');
							} else {
								this.handleError.handleError({
									type: 'dialog',
									title: 'ERROR.TITLE',
									content: '(' + res.body.hostCode + ')' + res.body.hostCodeMsg
								});
								this.clickCancel();
								if (this.webToAppRes) {
									const respCode = res.body.hostCode ? res.body.hostCode : '0099';
									this.webToAppRes.responseCode = respCode;
									this.epay.webToAppRes(this.webToAppRes);
								}
							}
						}).
						catch(
							error => {
								error['type'] = 'message';
								this.handleError.handleError(error);
								if (this.webToAppRes) {
									this.webToAppRes.responseCode = '0099';
									this.epay.webToAppRes(this.webToAppRes);
								}
							});
				},
				errorSecurityInfo => {
				},
			);

		} else {
			// 信用卡交易
			this.paymentData.custId = info.custId;
			let formCopy = { ...this.paymentData }; // 因顯示和實際發出資料會有不同所以copy一份以免異常
			let reqponse = {
				custId: '',
				cardNo: '',
				trnsAmount: '',
				countryCode: '',
				txnCurrencyCode: '',
				merchantPan: '',
				mcc: '',
				merchantName: '',
				merchantCity: '',
				postalCode: '',
				billNumber: '',
				mobileNumber: '',
				storeLabel: '',
				loyaltyNumber: '',
				referenceLabel: '',
				customerLabel: '',
				terminalLabel: '',
				purposeOfTransaction: '',
				additionalCDR: '',
				merchantNameByLang: '',
				pfid: '',
				trnsToken: ''
			};
			reqponse.custId = info.custId;
			reqponse.cardNo = this.trnsfrOutCard;
			reqponse.trnsAmount = this.cardData.transactionAmout;
			logger.error('this.cardData',this.cardData.transactionAmout,typeof (this.cardData.transactionAmout));
			
			logger.error('disableAmountInput',this.disableAmountInput);
			if (typeof (this.cardData.transactionAmout) == 'number') {
				reqponse.trnsAmount = this.cardData.transactionAmout.toString();
			}else{
				reqponse.trnsAmount = this.cardData.transactionAmout
			}
			let trnsAmountTemp: any;
			if (reqponse.trnsAmount.indexOf('.') == -1) {
				trnsAmountTemp = reqponse.trnsAmount + '00';
			} else {
				trnsAmountTemp = formCopy.trnsAmount * 100;
			}
			reqponse.trnsAmount = trnsAmountTemp.toString();
			reqponse.countryCode = '158';
			reqponse.txnCurrencyCode = this.cardData.transactionCurrency;

			// 判斷是什麼卡 傳什麼pan
			if (this.getCardType == 'JCB') {
				reqponse.merchantPan = this.cardData.jcbMerchantPAN;
			} else if (this.getCardType == 'VISA') {
				reqponse.merchantPan = this.cardData.visaMerchantPAN;
			} else if (this.getCardType == 'MASTER') {
				reqponse.merchantPan = this.cardData.masterMerchantPAN;
			}
			reqponse.mcc = this.cardData.merchantCategoryCode;
			reqponse.merchantName = this.cardData.merchantName;
			reqponse.merchantCity = this.cardData.merchantCity;
			reqponse.postalCode = this.cardData.postalCode;
			reqponse.billNumber = this.cardData.billNumber;
			reqponse.mobileNumber = this.cardData.mobileNumber;
			reqponse.merchantNameByLang = encodeURI(this.cardData.merchantNameByLang);
			reqponse.trnsToken = this.cardData.trnsToken;


			const CA_Object = {
				securityType: '',
				serviceId: 'FQ000114',
				signText: reqponse
			};
			// let security_data = this.qrcode.getSecurityData();
            // this.securityTypes = security_data.securityTypes;
			// logger.info('this.selectSecurityType',this.selectSecurityType);
			this.qrcode.getSecurityInfo(CA_Object, this.selectSecurityType).then(
				resSecurityInfo => {
					let reqHeader = {
						header: resSecurityInfo.headerObj
					};
					logger.info('reqHeader',resSecurityInfo.responseObj,reqHeader);
					this.fq000114.send(resSecurityInfo.responseObj.signText, reqHeader).then(
						(res) => {
							logger.error('114',res);
							if (!this.qrcode.isCheckResponse(res)) {
								this.handleError.handleError({
									type: 'dialog',
									title: 'ERROR.TITLE',
									content: '(' + res.body.hostCode + ')' + res.body.hostCodeMsg
								});
								this.clickCancel();
								if (this.webToAppRes) {
									const respCode = res.body.hostCode ? res.body.hostCode : '0099';
									this.webToAppRes.responseCode = respCode;
									this.epay.webToAppRes(this.webToAppRes);
								}
								return;
							}
							let params = {
								qrcode: this.qrcode,
								result: res,
								means: 'card',
								detail: 'qrcodePayResult',
								webToAppRes: this.webToAppRes ? this.webToAppRes : ''
							};
							localStorage.setItem('lastTransaction', '2');
							this.navgator.push('cardlogin-qrcodePayResult', params);
						}).
						catch(
							error => {
								logger.error('114 error',error);
							if (this.webToAppRes) {
								this.webToAppRes.responseCode = '0099';
								this.epay.webToAppRes(this.webToAppRes);
							}
								error['type'] = 'message';
								this.handleError.handleError(error);
							});
				},
				errorSecurityInfo => {
				},
			);
		}
	}
	private setCardPlan( cardPlan:string ) {
		if(!!this.webToAppRes){
			this.webToAppRes.cardPlan = cardPlan;
		}
	}

	private checkMethod() {
		logger.error('checkmethod',this.cardData.transactionAmout);
		if (this.cardData != null) {
			if (this.cardData.transactionAmout != null && this.cardData.transactionAmout != '' && typeof (this.cardData.transactionAmout) != 'object') {
				this.cardData.transactionAmout = parseInt(this.cardData.transactionAmout);
				this.disableCardAmountInput = true;
			}
			if (typeof (this.cardData.transactionAmout) == 'object') {
				this.cardData.transactionAmout = '';
			}
			// 判斷手機手否有值
			if (this.cardData.mobileNumber != null && typeof (this.cardData.mobileNumber) != 'object') {
				this.disablemobileNumberInput = true;
				this.mobileNumberDisply = true;
				if (this.cardData.mobileNumber == '***') {
					this.mobileNumberDisply = true;
					this.cardData.mobileNumber = '';
					this.disablemobileNumberInput = false;
				}
			} else {
				this.mobileNumberDisply = false;
				this.cardData.mobileNumber = '';
			}

			// 訂單編號(針對可能為空值特別處理)
			if (this.cardData.billNumber != null && typeof (this.cardData.billNumber) != 'object') {
				this.disablebillNumberInput = true;
				this.billNumberDisply = true;
				if (this.cardData.billNumber == '***') {
					this.billNumberDisply = true;
					this.cardData.billNumber = '';
					this.disablebillNumberInput = false;
				}
			} else {
				this.disablebillNumberInput = false;
				this.billNumberDisply = false;
				this.cardData.billNumber = '';
			}
			// 判斷是否有對應的卡片型態
			if (typeof this.cardData.jcbMerchantPAN == 'undefined') {
				this.cardData.jcbMerchantPAN = '';
			}
			if (typeof this.cardData.visaMerchantPAN == 'undefined') {
				this.cardData.visaMerchantPAN = '';
			}
			if (typeof this.cardData.masterMerchantPAN == 'undefined') {
				this.cardData.masterMerchantPAN = '';
			}
			let getCardType = this.getCardType;
			let chCardType = true;
			if (getCardType == 'JCB' && this.cardData.jcbMerchantPAN == '') {
				chCardType = false;
			}
			if (getCardType == 'VISA' && this.cardData.visaMerchantPAN == '') {
				chCardType = false;
			}
			if (getCardType == 'MASTER' && this.cardData.masterMerchantPAN == '') {
				chCardType = false;
			}

			if (chCardType) {
				// 取得上次交易方式
				let lastTransaction = localStorage.getItem('lastTransaction');
				if (lastTransaction == null) {
					lastTransaction = '1';
				}
				//如果lastTransaction等於2，檢查是否有綁定信用卡，如無則將lastTransaction設定為1
				if (lastTransaction == '2'){
					console.log('first lastTransaction = ', lastTransaction);
					if (typeof this.trnsfrOutCard == 'undefined' || this.trnsfrOutCard == '') {
						lastTransaction = '1';
						localStorage.setItem('lastTransaction', '1');
					}
				}
				// 判斷是否為境外交易
				if (this.cardData.countryCode != 'TW' || this.cardData.transactionCurrency != '901') {
					// 走金融卡頁面
					this.alert.show('不支援此QRCode').then(
						()=>{
							this.navgator.push('epay-card')
						}
					);
				} else {
					
						let getCardType = this.trnsfrOutCard.substr(0, 1);
						this.selectedItem = '2';
						this.meansTransactionMoney = false;
						this.meansTransactionCard = true;
						if (getCardType == '3') {
							this.iconFlag = 'JCB';
							// this.webToAppRes.cardPlan = 'J';
							this.setCardPlan('J');
						} else if (getCardType == '4') {
							this.iconFlag = 'VISA';
							// this.webToAppRes.cardPlan = 'V';
							this.setCardPlan('V');
						} else if (getCardType == '2' || getCardType == '5') {
							this.iconFlag = 'MASTER';
							// this.webToAppRes.cardPlan = 'M';
							this.setCardPlan('M');
						}
					
					this.isEmv = true;
				}
			} 
		} else {
			// this.isEmv = false;
			// this.meansTransactionCard = false;
			// this.selectedItem = '1';
		}
	}
	 
  showNoSupport() {
    this.alert.show('不支援此QRCode').then(
		()=>{
			this.navgator.push('epay-card')
		}
	);
  }
}
