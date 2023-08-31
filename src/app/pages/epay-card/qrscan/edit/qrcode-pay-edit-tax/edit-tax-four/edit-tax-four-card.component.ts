import { Component, OnInit } from '@angular/core';
import { QRTpyeCardService } from '@pages/epay-card/shared/qrocdeType-card.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { FQ000203ApiService } from '@api/fq/fq000203/fq000203-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { AlertService } from '@shared/popup/alert/alert.service';
import { FC001001ApiService } from '@api/fc/fc001001/fc001001-api.service';
import { FQ000201ApiService } from '@api/fq/fq000201/fq000201-api.service';
import { FQ000202ApiService } from '@api/fq/fq000202/fq000202-api.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { EPayCardService } from '@pages/epay-card/shared/epay-card.service';
import { logger } from '@shared/util/log-util';
import { Logger } from '@core/system/logger/logger.service';
import { CheckService } from '@shared/check/check.service';
import { FQ000202ReqBody } from '@api/fq/fq000202/fq000202-req';
import { FQ000201ReqBody } from '@api/fq/fq000201/fq000201-req';
import { FormateService } from '@shared/formate/formate.service';
import { CardCheckUtil } from '@shared/util/check/data/card-check-util';

@Component({
	selector: 'app-edit-tax-four-card',
	templateUrl: './edit-tax-four-card.component.html',
	styleUrls: ['./edit-tax-four-card.component.css']
})
export class EditTaxFourCardComponent implements OnInit {


	securityTypes: any;
	selectSecurityType: any;
	ParamsObj: any;
	qrcode: {
		accts: '',
		cardds: '',
		payNo: any,
		payCategory: '',
		payCategory1: '',
		merchantName: ''
	};
	trnsLimitAmt: any;
	accts: any;
	acts: any;
	cardds: any;
	status = '';
	form: any;
	form2: any;
	form3: any;
	cards: any;
	card = '';
	life = '';
	paymentData: any;
	errorMsg = {
		cardDate: '',
		cardPassword: '',
		mobileNumber: '',
		trnsAmount: '',
		orderNumber: '',
	};
	Today11: any;
	check: any;
	check6: any;
	check5: any;
	defaultTrnsOutAcct: any;
	payId2: '';
	act = '';
	checkFlag = true; //預設勾選 (同帳號存款人身分證統一編號)
	belongYear = ""; //所屬年度 => 不帶request，顯示於畫面上
	creditCheck = true; //持卡人圍剿內義務人本人或配偶
	constructor(
		private _logger: Logger,
		private qrcodeService: QRTpyeCardService,
		private navgator: NavgatorService,
		private auth: AuthService,
		private fq000203: FQ000203ApiService,
		private handleError: HandleErrorService,
		private alert: AlertService,
		private fc001001: FC001001ApiService,
		private confirm: ConfirmService,
		private fq000201: FQ000201ApiService,
		private fq000202: FQ000202ApiService,
		private epay: EPayCardService,
		private _errorCheck: CheckService,
		private _formateService: FormateService,
		private _checkService: CheckService
	) { }

	ngOnInit() {
		this._init();
	}

	_init() {
		this._logger.log("into edit-tax-four-card !");
		this.Today11 = new Date().getFullYear() - 1;
		this._logger.log("_init, Today11:", this.Today11);
		//所屬年度(顯示畫面用)
		const accDate = new Date();
		let month = '';
		let day = '';
		let tempDate = (accDate.getFullYear() - 1) + '/';
		if ((accDate.getMonth() + 1) < 10) {
			month = '0' + (accDate.getMonth() + 1).toString();
		} else {
			month = (accDate.getMonth() + 1).toString();
		}
		if ((accDate.getDate() < 10)) {
			day = '0' + accDate.getDate();
		} else {
			day = accDate.getDate().toString();
		}
		tempDate += month + '/';
		tempDate += day;
		let today = this._formateService.transDate(tempDate, { formate: 'yyyMMdd', chinaYear: true });
		this.belongYear = today.substring(0, 3);

		// 安控資料取得
		let security_data = this.qrcodeService.getSecurityData();
		this.securityTypes = security_data.securityTypes;
		if (!!security_data.selectSecurityType) {
			this.onChangeSecurity(security_data.selectSecurityType);
		}
		this.ParamsObj = this.navgator.getParams();
		this._logger.step('Epay', 'this.ParamsObj: ', this.ParamsObj);
		if (this.ParamsObj.qrcode !== undefined) {
			this._logger.step('Epay', 'this.qrcodeObj1: ', this.qrcode);
			this.qrcode = this.ParamsObj.qrcode;
		}
		this._logger.step('Epay', 'this.qrcodeObj2: ', this.qrcode);
		this.trnsLimitAmt = this.ParamsObj.trnsLimitAmt;
		this.status = '';		// select radio account
		this.accts = this.ParamsObj.accts;		// 活期儲蓄存款帳戶列表
		this.cardds = this.ParamsObj.cardds; 		// 信用卡列表

		this.form = {
			trnsfrOutAcct: this.ParamsObj.trnsfrOutAcct
			, secureCode: this.ParamsObj.qrcode.secureCode
			, acqInfo: this.ParamsObj.qrcode.acqInfo
		};
		this._logger.log("line 137, form:", this.form);
		this.form2 = {
			// custId: '',
			// payId: '',
			// paymentTool: '',
			// payCategory: '',
			// taxNo: '',
			// taxMonth: '',
			// cityId: '',
			// payEndDate: ''
		};
		this.form3 = {};
		this.form2['custId'] = this.auth.getCustId(); //custId 帶入使用者登入id
		this.qrcode.payNo = this.qrcode.payNo.replace(/\b(0+)/gi, '');
		this.form.trnsAmountStr1 = this.qrcode.payNo;
		this.form.trnsAmountStr = this.form.trnsAmountStr1;
		this._logger.step('Epay', '檢查初始this.trnsAmountStr: ', this.form.trnsAmountStr);

		// 繳款類別(針對可能為空值特別處理)
		if (this.ParamsObj.qrcode.payCategory !== null && typeof (this.ParamsObj.qrcode.payCategory) !== 'object') {
			this.form.payCategory = this.ParamsObj.qrcode.payCategory;
			if (this.form.payCategory == '11331') {
				this.form.businessType = 'T';
			}
		}
		// 交易幣別(針對可能為空值特別處理)
		if (this.ParamsObj.qrcode.payNo !== null && typeof (this.ParamsObj.qrcode.payNo) !== 'object') {
			this.form.payNo = this.ParamsObj.qrcode.payNo;
		}

		if (this.ParamsObj.qrcode.payEndDate !== null && typeof (this.ParamsObj.qrcode.payEndDate) !== 'object') {
			this.form.payEndDate = this.ParamsObj.qrcode.payEndDate;
		}

		// 識別碼(針對可能為空值特別處理)
		if (this.ParamsObj.qrcode.identificationCode !== null && typeof (this.ParamsObj.qrcode.identificationCode) !== 'object') {
			this.form.identificationCode = this.ParamsObj.qrcode.identificationCode;
		}

		// 期別代碼(針對可能為空值特別處理)
		if (this.ParamsObj.qrcode.periodCode !== null && typeof (this.ParamsObj.qrcode.periodCode) !== 'object') {
			this.form.periodCode = this.ParamsObj.qrcode.periodCode;
		}
		// this.clickCard();
		// this.clickOpen();
	}
	chgStatus() {
		this._logger.log("into chgStatus, this.status:", this.status);
		if (this.status == '1') {
			this._logger.log("status:1");
			this.clickOpen();
		} else if (this.status == '3') {
			this._logger.log("status:3");
			this.clickCard();
		} else {
			this._logger.log("into default select");
		}
	}
	onChangeSecurity(security) {
		this.selectSecurityType = security;
	}

	//status: '1':金融卡、 '3':信用卡
	clickClean(status: string) {
		// this.checkFlag = !this.checkFlag;
		let info = this.auth.getUserInfo();

		//金融卡
		if (status == '1') {
			this._logger.log("into status == 1");
			//勾選 => 取消
			if (this.checkFlag == true) {
				this.checkFlag = false;
				this.form2.payId = '';
				//切回取消，不顯示「隱藏金額及送出紐」，使用者需再點及一次「查詢繳款資訊」，因為繳款人有變化，需再查一次
				this.check = '';
				this.check6 = ''; //累積金額
				//取消 => 勾選
			} else {
				this.checkFlag = true;
				this.form2.payId = this.auth.getCustId();
				//切回勾選，不顯示「非本人提示訊息」、隱藏金額及送出紐，使用者需再點及一次「查詢繳款資訊」，因為繳款人有變化，需再查一次
				this.check5 = '';
				this.check = '';
			}

			this._logger.step('Epay', '檢查checkFlag: ', this.checkFlag);
			this._logger.step('Epay', '檢查info.custId: ', info.custId);
			this._logger.step('Epay', '檢查form2.payId: ', this.form2.payId);
			this._logger.step('Epay', '檢查form2.custId: ', this.form2.custId);
			//信用卡
		} else {
			this._logger.log("into status == 3");
			if (this.creditCheck == true) {
				this.creditCheck = false;
			} else {
				this.creditCheck = true;
			}
		}


		// if (!this.checkFlag) {
		// 	this._logger.step('Epay', '檢查this.payId2: ', this.payId2);
		// 	this.form2.payId = this.auth.getCustId();
		// } else {
		// 	this._logger.step('Epay', '檢查this.payId2: 空');
		// 	this.form2.payId = '';
		// }
	}

	clickOpen() {
		this._logger.log("into clickOpen, form2:", this.form2);
		this.check = '';
		this.check5 = '';
		this.check6 = '';

		//因預設為同帳號存取人身分證統一編號
		this.checkFlag = true;
		this.form2.payId = this.auth.getCustId();

		this.epay.sendFQ000101('A').then(
			resfq000101 => {
				let result: any = resfq000101;
				logger.error('101 result', resfq000101);
				// 檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
				if (result.trnsOutAccts == null
					|| result.trnsOutAccts.trnsOutAcct == null) {
					this.alert.show('未開通晶片金融卡，請臨櫃申請').then(
						res => { this.navgator.push('epay'); }
					);
				}
				this._logger.step('Epay', '檢查resfq000101 result:', result);
				this._logger.step('Epay', '檢查resfq000101 result.trnsOutAccts.trnsOutAcct:', result.trnsOutAccts.trnsOutAcct);
				let acts = result.trnsOutAccts.trnsOutAcct;
				acts = ObjectCheckUtil.modifyTransArray(result.trnsOutAccts.trnsOutAcct);
				// 取得進行SmartPay開通功能開關
				this.accts = [];
				for (let key in acts) {
					// 檢查是否為預設SmartPay帳戶
					if (acts[key].acctNo == result.defaultTrnsOutAcct) {
						acts[key].selected = true;
					}
					this.accts.push(acts[key]);
				}
				this._logger.step('Epay', '檢查resfq000101 accts:', this.accts);
				if (this.accts.length === 0) {
					this.alert.show('未開通晶片金融卡，請臨櫃申請').then(
						res => { this.navgator.push('epay'); }
					);
				}
				this.accts.forEach(element => {
					this._logger.step('Epay', '測試印出element:', element.acctNo);
				});
				this.defaultTrnsOutAcct = result.defaultTrnsOutAcct;
				this._logger.log("result.defaultTrnsOutAcct:", result.defaultTrnsOutAcct);
				this._logger.log("defaultTrnsOutAcct:", this.defaultTrnsOutAcct);
			},
			errorfq000101 => {
				this.handleError.handleError(errorfq000101);
			}
		);
	}

	clickcheckInfo() {
		//檢核身分證
		let checkIdno = this._checkService.checkIdentity(this.form2.payId);
		if (checkIdno['status'] == false) {
			this.alert.show('請輸入身分證字號');
			return false;
		} else {
			//檢核成功自動轉大寫
			let topNumber = this.form2.payId.substring(0, 1).toUpperCase();
			this.form2.payId = topNumber + (this.form2.payId.substring(1, 10));
		}

		// this._logger.log("clickcheckInfo, form2.custId:", this.form2.custId);
		// if (this.form2.payId == '' || typeof this.form2.payId == 'undefined') {
		// 	this.alert.show('請輸入身分證字號');
		// 	return false;
		// }

		//onInit有預設帶入使用者登入id，這裡防呆再檢查一次
		if (this.form2.custId == '' || typeof this.form2.custId == 'undefined') {
			let info = this.auth.getUserInfo();
			this.form2.custId = this.auth.getCustId();
		}
		// this.form2.payId = this.form2.payId;
		this.form2.paymentTool = '0';
		this.form2.payCategory = this.qrcode.payCategory;
		this.form2.taxNo = '';
		this.form2.taxMonth = this.Today11 + '05';
		this._logger.log("form2.taxMonth:", this.form2.taxMonth);
		this.form2.cityId = '';
		this.form2.payEndDate = '';
		let respon = {
			custId: this.form2.custId,
			paymentTool: this.form2.paymentTool,
			payCategory: this.form2.payCategory,
			taxNo: this.form2.taxNo,
			taxMonth: this.form2.taxMonth,
			cityId: this.form2.cityId,
			payEndDate: this.form2.payEndDate,
			payId: this.form2.payId
			// payId: this.auth.getCustId()
		};
		// 檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
		this._logger.log("send api 203, respon:", respon);
		this.fq000203.send(respon).then(
			resfq000203 => {
				this._logger.step('Epay', '測試resfq000203:', resfq000203);
				if (!this.qrcodeService.isCheckResponse(resfq000203)) {
					console.log("into !isCheckResponse, trnsRsltCode == 1");
					this.handleError.handleError({
						type: 'message',
						title: 'ERROR.TITLE',
						content: '(' + resfq000203.body.hostCode + ')' + resfq000203.body.hostCodeMsg
					});
					// this.clickCancel();
					return;
				}
				this._logger.step('Epay', '測試form.txnAmount:', this.form.txnAmount);
				this.form.txnAmount = resfq000203.body.txnAmount;
				this.form.txnInitDateTime = resfq000203.body.txnInitDateTime;
				this.check = '1';
				this.form.noticeNo = resfq000203.body.noticeNo;
				if (this.form2.payId == this.auth.getCustId() && typeof this.form2.payId != 'undefined') {
					this.check5 = ''; // 提醒您，您非納稅義務人本人....
					this.check6 = '1';
				} else {
					this.check5 = '1';
					this.check6 = '2';
				}
			},
			error => {
				console.log("into error =>, error:", error);
				error['type'] = 'message';
				this.handleError.handleError(error);
			});
	}

	clickCard() {
		let custId = this.auth.getCustId();
		this.form2.payId = custId;
		this.form3.custId = custId;
		this.check = null;
		this.form3.appInputFlag = '1';
		this.form3.pageSize = '50';
		this.fc001001.getData(this.form3).then(
			resfc001001 => {
				if (resfc001001.data == null) {
					logger.error('fc000101未開活期存款帳戶，請臨櫃申請', resfc001001);
					this.alert.show('未開活期存款帳戶，請臨櫃申請').then(
						res_alert => {
							this.navgator.push('epay');
						}
					);
				}
				this.cards = resfc001001.data;
				this.cardds = [];
				for (let key in this.cards) {
					let jj = (JSON.stringify(this.cards[key].creditCardNo)).substring(1, 7);
					if (jj != '540520' && jj != '405430') {
						this.cardds.push(this.cards[key]);
					}
				}
				// this._logger.step('Epay', 'resfc001001: ', resfc001001.body);
				// if (resfc001001.body.details == null
				//   || resfc001001.body.details.detail == null) {
				//   this.alert.show('未開活期存款帳戶，請臨櫃申請').then(
				//     res_alert => {
				//       this.navgator.push('epay');
				//     }
				//   );
				// }
				// this._logger.step('Epay', '檢查resfc001001 detail:', resfc001001.body.details.detail);
				// this.cards = resfc001001.body.details.detail;
				// this.cards = ObjectCheckUtil.modifyTransArray(resfc001001.body.details.detail);
				// this.cardds = [];
				// for (let key in this.cards) {
				//   let jj = (JSON.stringify(this.cards[key].creditCardNo)).substring(1, 7);
				//   if (jj != '540520' && jj != '405430') { this.cardds.push(this.cards[key]); }
				// }
				// this._logger.step('Epay', '檢查cardds: ', this.cardds);
			},
			errorfc001001 => {
				this.handleError.handleError(errorfc001001);
			}
		);
	}

	clickCancel() {
		this.navgator.push('epay');
	}

	checkFormat(type, content) {
		// const check_obj = this._errorCheck.checkNumber(content); // 數字檢核
		// let resultMsg = '';
		// if (check_obj.status) {
		// 	resultMsg = '';
		// } else {
		// 	resultMsg = check_obj.msg;
		// }

		//更精確的檢核
		if (type == 'cardDate') {
			// this.errorMsg.cardDate = resultMsg;
			let checkYm = CardCheckUtil.checkYmData(content);
			this.errorMsg.cardDate = checkYm['msg'];
		} else if (type == 'cardPassword') {
			// this.errorMsg.cardPassword = resultMsg;
			let checkCardCode = CardCheckUtil.checkCardCode(content);
			this.errorMsg.cardPassword = checkCardCode['msg'];
		}
	}

	clickSubmit() {
		this._logger.log("clickSubmit, form2.payId:", this.form2.payId);
		let params = {
			qrcode: this.qrcode,
			paymentData: this.form,
			securityType: this.securityTypes
		};
		// 沒有選擇繳款方式情況
		if (this.status == null || this.status == '') {
			this.alert.show('請選擇繳款方式');
		} else if (this.status == '1' && (this.form.trnsAmountStr1 === null || this.form.trnsAmountStr1 === '')) {
			this.alert.show('請輸入繳款金額');
		} else if (this.status == '1' && (this.act['acctNo'] == null || this.act['acctNo'] == '')) {
			this.alert.show('請選擇轉出帳號');
		} else if (this.status == '3' && (this.form.trnsAmountStr == null || this.form.trnsAmountStr == '')) {
			this.alert.show('請輸入繳款金額');
		} else if (this.status == '3' && this.cardds == null) {
			this.alert.show('您目前無本行信用卡，請改以其它方式繳款');
		} else if (this.status == '3' && this.cardds != null && (this.card == null || this.card == '')) {
			this.alert.show('請選擇信用卡');
		} else if (this.status == '3' && this.cardds != null && this.card != null && (this.form.cardDate == null || this.form.cardDate == '')) {
			this.alert.show('請輸入信用卡有效月年');
		} else if (this.status == '3' && this.cardds != null && this.card != null && (this.form.cardPassword == null || this.form.cardPassword == '')) {
			this.alert.show('請輸入信用卡背面末三碼');
		} else if (this.status == '3' && this.errorMsg['cardDate'] != '') {
			this.alert.show('請輸入正確年月');
			return false;
		} else if (this.status == '3' && this.card != null && this.form.cardDate != null && this.form.cardPassword != null) {
			// 執行FQ000201
			let message = '除每年5月綜合所得稅結算申報自繳稅款案件，得於法定(或依法展延)申報截止日前取消授權外，其餘案件一經授權成功，不得取消或更正。\n您可按「確認」繼續繳款，或按「取消」放棄繳款';
			this.confirm.show(message).then(
				reschecked => {
					this.paymentData = this.form;
					let info = this.auth.getUserInfo();
					this.paymentData.custId = this.auth.getCustId();
					let formObj = { ...this.paymentData };
					formObj.trnsAmount = this.form.trnsAmount * 100;
					formObj.merchantName = encodeURI(this.qrcode.merchantName);
					formObj.cardNo = this.card['creditCardNo'];
					formObj.taxNo = '';
					formObj.cityId = '';
					formObj.taxMonth = this.Today11 + '05';
					formObj.payEndDate = '';
					formObj.expiredDate = this.form.cardDate;
					formObj.checkId = this.form.cardPassword;
					formObj.trnsAmountStr = this.form.trnsAmountStr + '';

					let respon = new FQ000201ReqBody();

					respon.custId = formObj.custId;
					respon.cardNo = this.card['creditCardNo'];
					respon.expiredDate = formObj.expiredDate;
					respon.trnsAmountStr = formObj.trnsAmountStr;
					respon.payCategory = formObj.payCategory;
					respon.payNo = formObj.payNo;
					respon.taxNo = formObj.taxNo;
					respon.taxMonth = formObj.taxMonth;
					respon.checkId = formObj.checkId;
					respon.cityId = formObj.cityId;
					respon.payEndDate = formObj.payEndDate;

					const CA_Object = {
						securityType: '',
						serviceId: 'FQ000201',
						signText: respon,
						otpObj: {
							custId: '',
							fnctId: '',
							depositNumber: '',
							depositMoney: '',
							OutCurr: '',
							transTypeDesc: ''
						}
					};
					this._logger.step('Epay', '檢查執行FQ000201(CA_Object): ', CA_Object);
					this._logger.step('Epay', '檢查執行FQ000201(respon): ', respon);
					this._logger.step('Epay', '檢查執行FQ000201(formObj): ', formObj);
					// this.qrcodeService.getSecurityInfo(CA_Object, this.selectSecurityType).then(
					// resSecurityInfo => {
					// 	let reqHeader = {
					// 		header: resSecurityInfo.headerObj
					// 	};
					this.fq000201.send(respon).then(
						(resfq000201) => {
							if (!this.qrcodeService.isCheckResponse(resfq000201)) {
								this.handleError.handleError({
									type: 'message',
									title: 'ERROR.TITLE',
									content: (resfq000201.body.hostCode == undefined || resfq000201.body.hostCode == '') ? '' :
										('(' + resfq000201.body.hostCode + ')') + resfq000201.body.hostCodeMsg
								});
								// this.clickCancel();
								// return;
							}
							this._logger.step('Epay', '檢查回應FQ000201(resfq000201): ', resfq000201);
							if (resfq000201.hasOwnProperty('body')) {
								this._logger.log("into has body");
								resfq000201['body']['payId'] = this.form2.payId;
								resfq000201['body']['belongYear'] = this.belongYear; //所屬年度不寫死
								resfq000201['body']['paytype'] = 'credit'; //哪種繳費，credit:信用卡
							} else {
								resfq000201['body'] = {};
							}

							// resfq000201.num = 11; // 用來辨識11類銷帳編號 // tax4不用顯示
							// resfq000201.body.payId = info.custId;
							// tslint:disable-next-line: no-shadowed-variable
							let params = {
								qrcode: this.qrcode,
								result: resfq000201,
								means: 'financial',
								detail: 'qrcodeAllTaxResult'
							};
							this._logger.step('Epay', '檢查回應FQ000201(params): ', params);
							this.navgator.push('cardlogin-qrcodePayResult', params);
						}).
						catch(
							error => {
								this._logger.log("into credit 201 error");
								this.handleError.handleError(error);
							});
				},
				// errorSecurityInfo => {
				// 	logger.debug('errorSecurityInfo');
				// },
			);
			// },
			errorchecked => {

			}
			// );
		} else if (this.status == '1' || (this.status == '2' && this.life != null)) {
			this.paymentData = this.form;
			let info = this.auth.getUserInfo();
			if (this.selectSecurityType.key === 'NONSET' && (info.cn == null || info.cn == '')) {
				this.alert.show('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。');
				return;
			}
			this.paymentData.custId = this.auth.getCustId();
			let formObj = { ...this.paymentData }; // 因顯示和實際發出資料會有不同所以copy一份以免異常
			formObj.trnsAmount = this.form.trnsAmount * 100;
			// debugger;
			if (this.status == '1') { formObj.trnsfrOutAcct = this.act['acctNo']; }
			formObj.taxMonth = this.Today11 + '05';
			formObj.payId = this.form2.payId;
			formObj.payEndDate = '';
			formObj.taxNo = ''; // 營業稅稅籍編號 （其它稅款空白）
			formObj.cityId = ''; // 縣市代碼（綜所稅空白）
			formObj.trnsAmountStr = this.form.trnsAmountStr1 + '';
			formObj.payNo = this.form.noticeNo;
			if (this.form.payNo == null) { formObj.payNo = ''; }
			//繳款工具
			if (this.status == '1') {
				formObj.paymentTool = '0'; //晶片金融卡
			} else {
				formObj.paymentTool = '1'; //活期(儲蓄)存款帳戶
			}

			//防呆checkId
			if (typeof formObj['checkId'] == 'undefined' || formObj['checkId'] == null) {
				formObj['checkId'] = '';
			}

			this._logger.step('Epay', '檢查執行FQ000202(formObj 1): ', formObj);
			let respon = new FQ000202ReqBody();
			respon.custId = formObj.custId;
			respon.paymentTool = formObj.paymentTool;
			respon.trnsToken = '';
			respon.trnsfrOutAcct = formObj.trnsfrOutAcct;
			respon.trnsAmountStr = formObj.trnsAmountStr;
			respon.payCategory = formObj.payCategory;
			respon.payNo = formObj.payNo;
			respon.taxNo = formObj.taxNo;
			respon.taxMonth = formObj.taxMonth;
			respon.checkId = formObj.checkId;
			respon.cityId = formObj.cityId;
			respon.payEndDate = formObj.payEndDate;
			respon.payId = formObj.payId; //比照原code，有可能為代繳，不可直接拿登入id送
			// respon.payId = this.auth.getCustId();

			// let respon = {
			// 	custId: formObj.custId,
			// 	paymentTool: formObj.paymentTool,
			// 	trnsToken: '',
			// 	trnsfrOutAcct: formObj.trnsfrOutAcct,
			// 	trnsAmountStr: formObj.trnsAmountStr,
			// 	payCategory: formObj.payCategory,
			// 	payNo: formObj.payNo,
			// 	taxNo: formObj.taxNo,
			// 	taxMonth: formObj.taxMonth,
			// 	checkId: formObj.checkId,
			// 	cityId: formObj.cityId,
			// 	payEndDate: formObj.payEndDate,
			// 	payId: this.auth.getCustId()
			// };
			this._logger.step('Epay', '檢查執行FQ000202(respon): ', respon);
			const CA_Object = {
				securityType: '',
				serviceId: 'FQ000202',
				signText: respon,
				otpObj: {
					custId: '',
					fnctId: '',
					depositNumber: '',
					depositMoney: '',
					OutCurr: '',
					transTypeDesc: ''
				}
			};
			this._logger.step('Epay', '檢查執行FQ000202(CA_Object): ', CA_Object);

			this.qrcodeService.getSecurityInfo(CA_Object, this.selectSecurityType).then(
				resSecurityInfo => {
					let reqHeader = {
						header: resSecurityInfo.headerObj
					};
					this.fq000202.send(resSecurityInfo.responseObj.signText, reqHeader).then(
						(resfq000202) => {
							if (!this.qrcodeService.isCheckResponse(resfq000202)) {
								this.handleError.handleError({
									type: 'message',
									title: 'ERROR.TITLE',
									content: (resfq000202.body.hostCode != undefined && resfq000202.body.hostCode != '') ?
										('(' + resfq000202.body.hostCode + ')') : '' + resfq000202.body.hostCodeMsg
								});
								// this.clickCancel();
								// return;
							}
							this._logger.step('Epay', '檢查回應FQ000202(resfq000202): ', resfq000202);
							if (resfq000202.hasOwnProperty('body')) {
								resfq000202['body']['payId'] = this.form2.payId;
								resfq000202['body']['belongYear'] = this.belongYear; //所屬年度不寫死
								resfq000202['body']['paytype'] = 'ic'; //哪種繳費，credit:金融卡
							} else {
								resfq000202['body'] = {};
							}
							// tslint:disable-next-line: no-shadowed-variable
							let params = {
								qrcode: this.qrcode,
								result: resfq000202,
								means: 'financial',
								detail: 'qrcodeAllTaxResult'
							};
							this._logger.step('Epay', '檢查回應FQ000202(params): ', params);
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
