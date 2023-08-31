/**
 * Epay 轉帳購物
 * 
 * 
 */

import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FQ000111ApiService } from '@api/fq/fq000111/fq000111-api.service';
import { logger } from '@shared/util/log-util';
import { CheckService } from '@shared/check/check.service';
@Component({
	selector: 'app-qrcode-buy-edit',
	templateUrl: './qrcode-buy-edit.component.html',
	styleUrls: ['./qrcode-buy-edit.component.css']
})
export class QrcodeBuyEditComponent implements OnInit {

	ParamsObj: any;
	qrcodeObj: any;
	form: any;
	trnsLimitAmt: any;
	noSSL: any;
	noOTP: any;
	disableAmountInput: any;
	value2: any;
	securityTypes = [];
	selectSecurityType: any;
	paymentData: any;
	errorMsg = {
		merchantName1: '',
		orderNbr1: '',
		txnAmt: '',
	};

	// 金額檢核必要參數
	currency = {
		currency: 'TWD'
	}


	constructor(
		private navgator: NavgatorService,
		private auth: AuthService,
		private alert: AlertService,
		private qrcodeService: QRTpyeService,
		private handleError: HandleErrorService,
		private fq000111: FQ000111ApiService,
		private _errorCheck: CheckService
	) { }

	ngOnInit() {
		this._init();
	}

	_init() {
		this.ParamsObj = this.navgator.getParams();
		this.qrcodeObj = this.ParamsObj.qrcode;
		this.trnsLimitAmt = this.ParamsObj.trnsLimitAmt;
		this.form = {
			trnsfrOutAcct: this.ParamsObj.trnsfrOutAcct
			, secureCode: this.ParamsObj.qrcode.secureCode
			, acqInfo: this.ParamsObj.qrcode.acqInfo
		};

		if (this.qrcodeObj.note == '[object Object]') { this.qrcodeObj.note = ''; }
		if (this.qrcodeObj.noticeNbr22 == '[object Object]') { this.qrcodeObj.noticeNbr22 = ''; }

		this.noSSL = true;
		this.noOTP = false;

		if (this.ParamsObj.qrcode.txnAmt != null && this.ParamsObj.qrcode.txnAmt != '' && typeof (this.ParamsObj.qrcode.txnAmt) != 'object') {
			this.form.txnAmt = parseInt(this.ParamsObj.qrcode.txnAmt) / 100;

			if (this.ParamsObj.qrcode.canAmtEdit == 'Y') {
				this.disableAmountInput = false;
				this.value2 = true;
			} else { this.disableAmountInput = true; }
		} else {
			this.form.txnAmt = this.ParamsObj.qrcode.txnAmt;
		}


		this.qrcodeObj.merchantName1 = this.ParamsObj.qrcode.merchantName;
		this.qrcodeObj.orderNbr1 = this.ParamsObj.qrcode.orderNbr;


		// 20191125 轉帳購物安控可使用快速交易
		// 安控資料取得
		let security_data = this.qrcodeService.getSecurityData();
		this.securityTypes = security_data.securityTypes;
		if (!!security_data.selectSecurityType) {
		  this.onChangeSecurity(security_data.selectSecurityType);
		}
	}

	onChangeSecurity(security) {
		this.selectSecurityType = security;
	}

	clickCancel() {
		this.navgator.push('epay');
	}
	/**
	 * 點選確認
	 */
	clickSubmit() {
		logger.error('this.qrcodeObj', this.qrcodeObj, this.form)
		const cardTrnsAmount = this._errorCheck.checkMoney(this.form.txnAmt, this.currency);

		if (this.qrcodeObj.merchantName1 !== null && this.qrcodeObj.merchantName1.length > 16) {
			this.errorMsg.merchantName1 = '自我備註訊息長度有誤';
		} else {
			this.errorMsg.merchantName1 = '';
		}

		if ((this.qrcodeObj.merchantName1.replace(/[^\x00-\xff]/g, 'xx').length != this.qrcodeObj.merchantName1.length) && this.qrcodeObj.merchantName1.length > 8) {
			this.errorMsg.merchantName1 = '自我備註訊息長度有誤';
		} else {
			this.errorMsg.merchantName1 = '';
		}
		if (this.qrcodeObj.orderNbr1 != null && this.qrcodeObj.orderNbr1.length > 16) {
			this.errorMsg.orderNbr1 = '給收款人訊息長度有誤';
		} else if ((this.qrcodeObj.orderNbr1.replace(/[^\x00-\xff]/g, 'xx').length != this.qrcodeObj.orderNbr1.length) && this.qrcodeObj.orderNbr1.length > 8) {
			this.errorMsg.orderNbr1 = '給收款人訊息長度有誤';
		} else  {
			this.errorMsg.orderNbr1 = '';
		}

		if (this.form.txnAmt == null || this.form.txnAmt.length == 0 || (!cardTrnsAmount.status)) {
			this.errorMsg.txnAmt = '請輸入交易金額';
		} else {
			this.errorMsg.txnAmt = '';
		}

		if (parseInt(this.form.txnAmt) > 2000000) {
			logger.error('this.form.txnAmt', this.form.txnAmt)
			this.errorMsg.txnAmt = '本交易超過單筆交易200萬限額';
			this.clickCancel(); // 結束流程
		}

		if (this.errorMsg.merchantName1 == '' && this.errorMsg.orderNbr1 ==''
			&& cardTrnsAmount.status ) {
			this.paymentData = this.form;
			let info = this.auth.getUserInfo();
			logger.error('this.selectSecurityType', this.selectSecurityType, this.securityTypes)
			if (this.selectSecurityType.key === 'NONSET' && (info.cn == null || info.cn == '')) {
				this.alert.show('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。');
				return;
			}

			this.paymentData.custId = info.custId;
			let formCopy = { ...this.paymentData }; // 因顯示和實際發出資料會有不同所以copy一份以免異常
			formCopy.txnAmt = this.form.txnAmt * 100;
			formCopy.custId = info.custId;
			formCopy.merchantName = this.ParamsObj.qrcode.merchantName;
			formCopy.orderNumber = this.ParamsObj.qrcode.orderNbr;
			formCopy.trnsfrOutAcct = this.form.trnsfrOutAcct; // 轉出帳號
			formCopy.trnsfrInBank = this.ParamsObj.qrcode.transfereeBank; // 轉入行代碼
			formCopy.trnsfrInAcct = this.ParamsObj.qrcode.transfereeAccount; // 轉入帳號
			formCopy.trnsfrAmount = this.form.txnAmt; // 轉帳金額
			formCopy.notePayer = this.ParamsObj.qrcode.merchantName1; // 付款人自我備註
			formCopy.notePayee = this.qrcodeObj.orderNbr1; // 給收款人訊息
			formCopy.trnsToken = this.ParamsObj.qrcode.trnsToken; // 交易控制碼
			let respon = {
				custId: formCopy.custId,
				merchantName: formCopy.merchantName,
				orderNumber: formCopy.orderNumber,
				trnsfrOutAcct: formCopy.trnsfrOutAcct,
				trnsfrInBank: formCopy.trnsfrInBank,
				trnsfrInAcct: formCopy.trnsfrInAcct,
				trnsfrAmount: formCopy.trnsfrAmount,
				notePayer: formCopy.notePayer,
				notePayee: formCopy.notePayee,
				trnsToken: formCopy.trnsToken
			};
			const CA_Object = {
				securityType: '',
				serviceId: 'FQ000111',
				signText: respon,
			};
			this.qrcodeService.getSecurityInfo(CA_Object, this.selectSecurityType).then(
				resSecurityInfo => {
					let reqHeader = {
						header: resSecurityInfo.headerObj
					};
					this.fq000111.send(resSecurityInfo.responseObj.signText, reqHeader).then(
						(res) => {
							if (!this.qrcodeService.isCheckResponse(res)) {
								this.handleError.handleError({
									type: 'dialog',
									title: 'ERROR.TITLE',
									content: '(' + res.body.hostCode + ')' + res.body.hostCodeMsg
								});
								this.clickCancel();
								return;
							}
							let params = {
								qrcode: this.qrcodeObj,
								result: res,
								means: 'financial',
								detail: 'qrcodeBuyResult'
							};
							this.navgator.push('qrcodePayResult', params);
						}).
						catch(
							error => {
								this.handleError.handleError(error);
							});
				},
				errorSecurityInfo => {
					logger.debug('errorSecurityInfo');
				},
			);
		}
	}
}
