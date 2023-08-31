/**
 * P2P轉帳
 */
import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { FQ000110ApiService } from '@api/fq/fq000110/fq000110-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { logger } from '@shared/util/log-util';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

@Component({
	selector: 'app-qrcode-get-edit',
	templateUrl: './qrcode-get-edit.component.html',
	styleUrls: ['./qrcode-get-edit.component.css']
})
export class QrcodeGetEditComponent implements OnInit {

	ParamsObj: any;
	qrcodeObj: any;
	form: any;
	trnsLimitAmt: any;
	noSSL: any;
	noOTP: any;
	securityTypes = [];
	selectSecurityType: any;
	disableAmountInput: any;
	value2: any;
	paymentData: any;
	trnsfrOutAcct: any;
	errorMsg = {
		noticeNbr22: '',
		note: '',
		txnAmt: '',
	};
	constructor(
		private navgator: NavgatorService,
		private auth: AuthService,
		private alert: AlertService,
		private qrcodeService: QRTpyeService,
		private fq000110: FQ000110ApiService,
		private handleError: HandleErrorService,
		private _uiContentService: UiContentService,
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

		if (this.qrcodeObj.note == '[object Object]') {
			this.qrcodeObj.note = '';
		}
		if (this.qrcodeObj.noticeNbr22 == '[object Object]') {
			this.qrcodeObj.noticeNbr22 = '';
		}

		this.noSSL = true;
		this.noOTP = false;
		let res: any = this.auth.getUserInfo();

		/**
		 * 20190729 Boy P2P轉帳修改
		 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		 * 
		 * P2P 安控選擇僅有憑證及OTP，沒有[生物辨識]。
		 * 
		 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		 */
		let security_data = this.qrcodeService.getSecurityData({
			biometric: false,
			pattern: false,
		});
		this.securityTypes = security_data.securityTypes;
		if (!!security_data.selectSecurityType) {
		  this.onChangeSecurity(security_data.selectSecurityType);
		}

		if (this.qrcodeObj.txnAmt != null && this.qrcodeObj.txnAmt != '' && typeof (this.qrcodeObj.txnAmt) != 'object') {

			// tslint:disable-next-line: radix
			this.form.txnAmt = parseInt(this.qrcodeObj.txnAmt) / 100;
			if (this.qrcodeObj.canAmtEdit == 'Y') {
				this.disableAmountInput = false;
				this.value2 = true;
			} else { this.disableAmountInput = true; }
		}

		if (this.qrcodeObj.txnCurrencyCode != null && typeof (this.qrcodeObj.txnCurrencyCode) != 'object') {
			this.form.txnCurrencyCode = this.qrcodeObj.txnCurrencyCode;
		}


		if (this.qrcodeObj.noticeNbr == '10000000000000000') {
			this.qrcodeObj.noticeNbr = '9999999999999999';
			this.form.noticeNbr = '9999999999999999';
		}

	}

	onChangeSecurity(security) {
		this.selectSecurityType = security;
	}
	/**
		* 點選確認
		*/

	clickSubmit1() {
		this.navgator.push('qrcodeRed', );
	}

	clickSubmit() {
		// this.navgator.push('qrcodeRed', );
		let txnAmt = this.form.txnAmt;                  // 轉帳金額
		let noticeNbr22 = this.qrcodeObj.noticeNbr22;   // 給收款人訊息
		let note = this.qrcodeObj.note;                 // 付款人自我備註


		if (noticeNbr22 != null) {
			let num = noticeNbr22.replace(/[^\x00-\xff]/g, 'xx').length;
			if (num > 16) {
				this.errorMsg.noticeNbr22 = '訊息文字長度限16位英數字或8個中文字';
			} else {
				this.errorMsg.noticeNbr22 = '';
			}
		} else {
			this.qrcodeObj.noticeNbr22 = '';
		}

		if (note != null) {
			let num = note.replace(/[^\x00-\xff]/g, 'xx').length;
			if (num > 16) {
				this.errorMsg.note = '訊息文字長度限16位英數字或8個中文字';
			} else {
				this.errorMsg.note = '';
			}
		} else {
			this.qrcodeObj.note = '';
		}

		if (txnAmt == null || txnAmt.length == 0 || txnAmt == 0) {
			this.errorMsg.txnAmt = '請輸入轉帳金額';
		} else if (txnAmt > 2000000) {
			this.errorMsg.txnAmt = '本交易超過單筆交易200萬限額';
		} else {
			this.errorMsg.txnAmt = '';
		}

		this.paymentData = this.form;
		let info = this.auth.getUserInfo();
		if ((this.selectSecurityType.key == 'NONSET') && (info.cn == null || info.cn == '')) {
			this.alert.show('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。');
			return;
		}

		if (this.errorMsg.note == '' && this.errorMsg.noticeNbr22 == '' && this.errorMsg.txnAmt == '') {
			this.paymentData.custId = info.custId;
			let formCopy = { ...this.paymentData }; // 因顯示和實際發出資料會有不同所以copy一份以免異常
			formCopy.txnAmt = this.form.txnAmt * 100;
			formCopy.custId = info.custId;
			formCopy.trnsfrOutAcct = this.form.trnsfrOutAcct; // 轉出帳號
			formCopy.trnsfrInBank = this.qrcodeObj.transfereeBank; // 轉入行代碼
			formCopy.trnsfrInAcct = this.qrcodeObj.transfereeAccount; // 轉入帳號
			formCopy.trnsfrAmount = this.form.txnAmt; // 轉帳金額
			formCopy.notePayer = this.qrcodeObj.note; // 付款人自我備註
			formCopy.notePayee = this.qrcodeObj.noticeNbr22; // 給收款人訊息
			formCopy.trnsToken = this.qrcodeObj.trnsToken; // 交易控制碼
			let respon = {
				custId: formCopy.custId,
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
				serviceId: 'FQ000110',
				signText: respon,
			};
			this.qrcodeService.getSecurityInfo(CA_Object, this.selectSecurityType).then(
				resSecurityInfo => {
					let reqHeader = {
						header: resSecurityInfo.headerObj
					};
					this.fq000110.send(resSecurityInfo.responseObj.signText, reqHeader).then(
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
								detail: 'qrcodeGetResult'
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
		} else {
			this.handleError.handleError({
				type: 'dialog',
				title: '提醒您',
				content: "輸入項目有誤，請再次確認輸入欄位。"
			});
			// 當使用者輸入有誤時，將頁面拉回最上方。
			this._uiContentService.scrollTop();
		}
	}
	clickCancel() {
		this.navgator.push('epay');
	}
}
