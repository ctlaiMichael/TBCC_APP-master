/**
 * 基金轉換流程
 */
import { Component, OnChanges, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ActivatedRoute } from '@angular/router';
import { SearchDepositAccountService } from '@pages/fund/shared/service/searchDepositAccount.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { FormateService } from '@shared/formate/formate.service';
import { FundInformation1 } from '@conf/terms/fund/fund-information1';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { FundInformation2 } from '@conf/terms/fund/fund-information2';
import { CheckService } from '@shared/check/check.service';
import { FundInformationReserve2 } from '@conf/terms/fund/fund-information-reserve2';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { RedeemConvertAccountService } from '@pages/fund/shared/service/redeem-convert-account.service';
import { AuthService } from '@core/auth/auth.service';
import { ConvertApplyService } from '@pages/fund/shared/service/convert-apply.service';
import { ConvertApplyReserveService } from '@pages/fund/shared/service/convert-apply-reserve.service';
import { ConvertApplyMultipleService } from '@pages/fund/shared/service/convert-apply-multiple.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { FundInformation5 } from '@conf/terms/fund/fund-information5';
import { logger } from '@shared/util/log-util';
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service'; // alex0520

@Component({
	selector: 'app-fund-convert-content',
	templateUrl: './fund-convert-content.component.html',
	styleUrls: [],
	providers: [
		SearchDepositAccountService,
		RedeemConvertAccountService,
		ConvertApplyService,
		ConvertApplyReserveService,
		ConvertApplyMultipleService,
		FormateService
	]
})
export class FundConvertContentComponent implements OnInit {
	@Input() reservFlag: any;
	@Input() setData: any;
	@Input() convertTypeContent: any;
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();


	constructor(
		private _logger: Logger
		, private _handleError: HandleErrorService
		, private _headerCtrl: HeaderCtrlService
		, private navgator: NavgatorService
		, private route: ActivatedRoute
		, private _mainService: SearchDepositAccountService
		, private confirm: ConfirmService
		, private _convertAccount: RedeemConvertAccountService
		, private _convertApply: ConvertApplyService
		, private _convertApplyReserve: ConvertApplyReserveService
		, private _checkSecurityService: CheckSecurityService
		, private _formateService: FormateService
		, private infomationService: InfomationService
		, private _errorCheck: CheckService
		, private authService: AuthService
		, private _convertApplyMultiple: ConvertApplyMultipleService
		, private alert: AlertService
		, private _authService: AuthService
		, private _fi000401Service: FI000401ApiService // alex0520
	) {
	}
	agree1 = false;
	agree2 = false;
	agree3 = false;
	nowPageType: any; // 頁面切換
	trnsInAccts = []; // 轉入帳號
	trnsOutAccts = []; // 轉出扣款帳號
	rtType = ''; // F000502 回傳的投資風險欄位，只有在轉換時才會有
	nowOutType: any = {};
	nowInType: any = {};
	errorMsg = {
		money: '',
		money1: '',
		money2: '',
		money3: ''
	};

	fundData = {
		custId: '', // 身分證字號
		trustAcnt: '', // 信託帳號
		transCode: '', // 交易編號
		fundName: '', // 轉出基金名稱
		fundCode: '', // 轉出基金代碼
		amount: '', // 信託金額
		unit: '', // 單位數
		inCurrency: '', // 投資幣別
		investType: '', // 投資型態
		transAmount: '',  // 轉換金額
		payAcnt: {}, // 手續費扣款帳號
		redeemType: '', // 轉換方式
		enrollDate: '', // 生效日
		inFundName: '', // 轉入基金名稱
		inFundCode: '', // 轉入基金代碼
		inFundShowName: '請選擇基金標的',
		compName: '', // 基金公司名稱
		compCode: '', // 基金公司代碼
		compShowName: '請選擇基金公司',
		hiIncome: '' // 高收益債券基金 Y: 高收益債券基金/ 空: 非高收益債券基金
	};

	hiIncome: any; // 高收益債券基金 Y: 高收益債券基金/ 空: 非高收益債券基金

	multipleFundFlag = '';

	// request
	userAddress = {
		'USER_SAFE': '',
		'SEND_INFO': ''
	};
	// 日期變數 start
	tomorrow = new Date();
	today = new Date();
	dd = String(this.today.getDate()).padStart(2, '0');
	MM = String(this.today.getMonth() + 1).padStart(2, '0');
	yyyy = this.today.getFullYear();
	HH = this.today.getHours();
	mm = this.today.getMinutes();
	ss = this.today.getSeconds();
	todate = this.yyyy + '/' + this.MM + '/' + this.dd;
	todateTime = this.yyyy + '/' + this.MM + '/' + this.dd + ' ' + this.HH + ':' + this.mm + ':' + this.ss;
	TWtodate = '';
	startDate = {
		default: '',
		min: '',
		max: '',
		data: '',
		error: ''
	};
	showError = {
		error: false,
		msg: ''
	};
	// ====================== 基金選擇頁變數 start ============================
	req: any = {
		custId: '', // 身分證字號
		investType: '', // 交易別
		fundType: '', // 交易別，判斷 A:單筆、B:小額(定期定額)、C:轉換、D:小額(定期不定額)
		selectfund: '', // 是否精選
		compCode: '', // 基金公司代碼
		fundCode: '' // 轉出基金代碼
	};
	// ====================== 基金選擇頁變數 end ============================
	// ====================== 同意事項頁變數 start ============================
	agreeNote = {
		note1: false,
		note2: false,
		note3: false,
		note4: false,
		note5: false,
		note6: false,
		note22: false,
		note33: false,
		note44: false,
		note55: false
	};
	// ====================== 同意事項頁變數 end ============================
	// ====================== 確認頁變數 start ============================
	resultData = {
		custId: '',
		trnsDatetime: '',
		trustAcnt: '',
		transCode: '',
		fundCode: '',
		fundName: '',
		investType: '',
		investTypeDesc: '',
		currency: '',
		inCurrency: '',
		amount: '',
		unit: '',
		outAmount: '',
		outUnit: '',
		enrollDate: '',
		effectDate: '',
		payAccount: '',
		redeemType: '',
		redeemTypeDesc: '',
		inFundCode: '',
		inFundName: '',
		bankSrvFee: '',
		fndComSrvFee: '',
		totalFee: '',
		shortLineAmt: '',
		trnsToken: '',
		branchName:'', // alex0520
		unitCall:''
	};
	agreeConfirmNote = false;

	// ====================== 同意事項頁變數 end ============================
	// =====================  安控變數 start =============================
	'SEND_INFO': '';
	transactionObj = {
		serviceId: 'FI000508',
		categoryId: '6', // 基金業務
		transAccountType: '1',
	};

	securityObj = {
		'action': 'init',
		'sendInfo': {}
	};

	safeE = {};
	// ====================  安控變數 end =============================
	info_401: any = {}; // alex0520

	ngOnInit() {
		// --- 頁面設定 ---- //
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'back'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.onBackPageData();
		});
		// --- 頁面設定 End ---- //
		// 安控變數初始化
		this.securityObj = {
			'action': 'init',
			'sendInfo': this.userAddress.SEND_INFO
		};

		this._fi000401Service.getAgreeNew().then((resObj) => {  // alex0520
			this.info_401 = resObj;
		  });

		// this.fundData.transAmount = AmountUtil.amount(this.setData.invenAmount);
		if (this.setData.iNCurrency == 'TWD' || this.setData.iNCurrency == 'NTD' || this.setData.iNCurrency == 'JPY') {
			//  台幣金額去掉小數點
			this.fundData.transAmount = this.setData.invenAmount.substr(0, this.setData.invenAmount.indexOf('.'));
		} else {
			this.fundData.transAmount = this.setData.invenAmount;
		}
		this.TWtodate = this._formateService.transDate(this.todate, { formate: 'yyyMMdd', chinaYear: true });

		// 一轉一: 初始全部轉換 ; 一轉多: 強制部分轉換
		/*
		* 若為一轉多，
		* inFundCode取代為inFundCode1、inFundCode2、inFundCode3
		* inFundName取代為inFundName1、inFundName2、inFundName3
		* transAmount取代為transAmount1、transAmount2、transAmount3
		* */
		this.nowPageType = (this.convertTypeContent == 'SelectSingle') ? 'editPageSingle' : 'editPageMultiple';
		this._logger.step('FUND', '轉換型別: convertTypeContent/ nowPageType: ', this.convertTypeContent, this.nowPageType);
		if (this.convertTypeContent == 'SelectSingle') {
			this.fundData.redeemType = '1';
		} else {
			this.fundData.redeemType = '2';
			delete this.fundData.inFundCode;
			delete this.fundData.inFundName;
			delete this.fundData.compName;
			delete this.fundData.transAmount;
			this.fundData['inFundCode1'] = '';
			this.fundData['inFundCode2'] = '';
			this.fundData['inFundCode3'] = '';
			this.fundData['inFundName1'] = '';
			this.fundData['inFundName2'] = '';
			this.fundData['inFundName3'] = '';
			this.fundData['inFundShowName1'] = '請選擇基金標的';
			this.fundData['inFundShowName2'] = '請選擇基金標的';
			this.fundData['inFundShowName3'] = '請選擇基金標的';
			this.fundData['compShowName1'] = '請選擇基金公司';
			this.fundData['compShowName2'] = '請選擇基金公司';
			this.fundData['compShowName3'] = '請選擇基金公司';
			this.fundData['compName1'] = '';
			this.fundData['compName2'] = '';
			this.fundData['compName3'] = '';
			this.fundData['compCode1'] = '';
			this.fundData['compCode2'] = '';
			this.fundData['compCode3'] = '';
			this.fundData['transAmount1'] = '';
			this.fundData['transAmount2'] = '';
			this.fundData['transAmount3'] = '';
		}
		// 日期查詢頁面條件
		/*
		* 查詢後2個月: 2019-05-15[當日] ~ 2019-06-15[後2月]
		* 1. set_date[strict]，baseDate以當日為基礎，查詢前2個月的日期: 2019-02-25
		*/
		this.tomorrow.setDate(this.today.getDate() + 1);
		let tomorowF = this.tomorrow.getFullYear() + '/' + String(this.tomorrow.getMonth() + 1).padStart(2, '0') + '/'
			+ String(this.tomorrow.getDate()).padStart(2, '0');
		let set_date = {
			returnType: 'date',
			rangeType: 'M', // "查詢範圍類型" M OR D
			rangeNum: '2', // 查詢範圍限制
			rangeDate: '', // 比較日
			baseDate: (this.reservFlag == true) ? tomorowF : 'today'
		};
		let past_date = this._errorCheck.getDateSet(set_date, 'future');
		const basedate = this._formateService.checkField(past_date, 'SysDate');
		const mindate = this._formateService.checkField(past_date, 'minDate');
		this._logger.step('FUND', '日期檢核[tomorrow/ past_date/ basedate/ mindate]: ', this.reservFlag, this.tomorrow, past_date, basedate, mindate);
		this.fundData.enrollDate = (this.reservFlag == true) ?
			this._formateService.transDate(tomorowF, 'yyyy-MM-dd') : this._formateService.transDate(this.todate, 'yyyy-MM-dd');
		this.startDate.default = (this.reservFlag == true) ? tomorowF : this.todate;
		logger.error('this.fundData.enrollDate', this.fundData.enrollDate);
		this.startDate.max = this._formateService.transDate(this._formateService.checkField(past_date, 'maxDate'), 'yyyy-MM-dd');
		this.startDate.min = this._formateService.transDate(this._formateService.checkField(past_date, 'minDate'), 'yyyy-MM-dd');

		this._logger.step('FUND', 'setDate: ', this.setData);
		const userData = this.authService.getUserInfo();
		this.fundData.custId = userData.custId;
		this.fundData.trustAcnt = this.setData.trustAcnt;
		this.fundData.transCode = this.setData.transCode;
		this.fundData.fundCode = this.setData.fundCode;
		this.fundData.fundName = this.setData.fundName;
		this.fundData.investType = this.setData.investType;
		this.fundData.amount = this.setData.invenAmount;
		this.fundData.unit = this.setData.unit;
		this.fundData.inCurrency = this.setData.iNCurrency;
		this.getAccountList();
	}

	// ngOnChanges() {

	// }

	/* 查詢贖回轉換約定帳號
	* trnsType
	* 1: 贖回
	* 2: 贖回(預約)
	* 3: 轉換(一轉一)
	* 4: 轉換(一轉三)
	* 5: 轉換(一轉一) (預約)
	* */
	private getAccountList() {
		let r_data = {
			trnsType: '',
			currency: ''
		};
		if (this.reservFlag == false) {
			if (this.convertTypeContent == 'SelectSingle') {
				r_data['trnsType'] = '3';
			} else {
				r_data['trnsType'] = '4';
			}
		} else {
			r_data['trnsType'] = '5';
		}
		this._logger.step('FUND', 'AccountList trnsType: ', r_data.trnsType);
		this._convertAccount.getAccount(r_data).then(
			(resObj) => {
				this._logger.step('FUND', 'get Account: ', resObj);
				this.trnsOutAccts = resObj.data;
				this._logger.step('FUND', 'get this.trnsOutAccts: ', this.trnsOutAccts);
				let acct = {
					account: '請選擇扣款帳號'
				};
				this.trnsOutAccts.unshift(acct);
				this.fundData.payAcnt = (typeof this.trnsOutAccts[0] !== 'undefined') ? this.trnsOutAccts[0] : {};
				this.rtType = resObj.info_data['rtType'];
			},
			(errorObj) => {
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
				this.backMenuPage();
			});
	}

	/**
	 * 重新設定page data
	 * @param item
	 */
	onBackPageData(item?: any) {
		this.confirm.show('您是否放棄此次編輯?', {
			title: '提醒您'
		}).then(
			() => {
				// 返回投資理財選單
				const output = {
					'page': 'content',
					'type': 'back',
					'data': item
				};
				this.backPageEmit.emit(output);
			},
			() => {

			}
		);
	}

	/**
	 * 失敗回傳
	 * @param error_obj 失敗物件
	 */
	onErrorBackEvent(error_obj) {
		const output = {
			'page': 'content',
			'type': 'error',
			'data': error_obj
		};
		this.errorPageEmit.emit(output);
	}

	// 安控函式
	securityOptionBak(e) {
		this._logger.step('FUND', '2. 安控函式:e.status: ', e.status);
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.userAddress.SEND_INFO = e.sendInfo;
			this.userAddress.USER_SAFE = e.sendInfo.selected;
			this.securityObj = {
				'action': 'init',
				'sendInfo': e.sendInfo
			};
		} else {
			// do errorHandle 錯誤處理 推業或POPUP
			e['type'] = 'message';
			this._handleError.handleError(e.ERROR);
		}
	}

	stepBack(e) {
		this._logger.step('FUND', '1. 安控函式: ', e);
		this._logger.step('FUND', 'changeResultPage 2: [e]', e);
		if (e.status) {
			if (e.securityType === '3') {
				e.otpObj.depositNumber = ''; // 轉出帳號
				e.otpObj.depositMoney = ''; // 金額
				e.otpObj.OutCurr = ''; // 幣別
				e.transTypeDesc = ''; //
			} else if (e.securityType === '2') {
				// 憑證 寫入簽章本文
				if (this.convertTypeContent == 'SelectSingle') {
					e.signText = {
						'custId': this._authService.getUserInfo().custId,
						'trustAcnt': this.resultData.trustAcnt,
						'transCode': this.resultData.transCode,
						'fundCode': this.resultData.fundCode,
						'investType': this.resultData.investType,
						'currency': this.resultData.currency,
						'inCurrency': this.resultData.inCurrency,
						'amount': this.resultData.amount,
						'unit': this.resultData.unit,
						'outAmount': this.resultData.outAmount,
						'outUnit': this.resultData.outUnit,
						'enrollDate': this.resultData.enrollDate,
						'effectDate': this.resultData.effectDate,
						'payAccount': this.resultData.payAccount,
						'redeemType': this.resultData.redeemType,
						'inFundCode': this.resultData.inFundCode,
						'bankSrvFee': this.resultData.bankSrvFee,
						'fndComSrvFee': this.resultData.fndComSrvFee,
						'trnsToken': this.resultData.trnsToken,
						'branchName': this.resultData.branchName, // alex0520
						'unitCall': this.resultData.unitCall

					};
				} else if (this.convertTypeContent == 'SelectMultiple') {
					e.signText = {
						'custId': this._authService.getUserInfo().custId,
						'trustAcnt': this.resultData.trustAcnt,
						'transCode': this.resultData.transCode,
						'fundCode': this.resultData.fundCode,
						'investType': this.resultData.investType,
						'currency': this.resultData.currency,
						'inCurrency': this.resultData.inCurrency,
						'amount': this.resultData.amount,
						'unit': this.resultData.unit,
						'outAmount1': this.resultData['outAmount1'],
						'outAmount2': this.resultData['outAmount2'],
						'outAmount3': this.resultData['outAmount3'],
						'outUnit1': this.resultData['outUnit1'],
						'outUnit2': this.resultData['outUnit2'],
						'outUnit3': this.resultData['outUnit3'],
						'enrollDate': this.resultData.enrollDate,
						'effectDate': this.resultData.effectDate,
						'payAccount': this.resultData.payAccount,
						'redeemType': this.resultData.redeemType,
						'inFundCode1': this.resultData['inFundCode1'],
						'inFundCode2': this.resultData['inFundCode2'],
						'inFundCode3': this.resultData['inFundCode3'],
						'bankSrvFee1': this.resultData['bankSrvFee1'],
						'bankSrvFee2': this.resultData['bankSrvFee2'],
						'bankSrvFee3': this.resultData['bankSrvFee3'],
						'fndComSrvFee1': this.resultData['fndComSrvFee1'],
						'fndComSrvFee2': this.resultData['fndComSrvFee2'],
						'fndComSrvFee3': this.resultData['fndComSrvFee3'],
						'trnsToken': this.resultData.trnsToken,
						'branchName': this.resultData.branchName,  // alex0520
						'unitCall': this.resultData.unitCall
					};
				}
				this._logger.step('FUND', '簽章本文 reservFlag/ serviceId: ', this.reservFlag, this.transactionObj.serviceId);
				this._logger.step('FUND', '簽章本文 e.signText: ', e.signText);
			}
			// 統一叫service 做加密
			this._checkSecurityService.doSecurityNextStep(e).then(
				(S) => {
					this._logger.step('FUND', 'changeResultPage 3: [S]', S);
					this.safeE = {
						securityResult: S
					};

					this.nowPageType = 'resultPage';
				}, (F) => {
					this.backPageEmit.emit({
						type: 'goResult',
						value: false,
						securityResult: F
					});
				}
			);
		} else {
			return false;
		}
	}

	/**
	* 子層返回事件(分頁)
	* @param e
	*/
	onPageBackEvent(e) {
		this._logger.step('Deposit', 'onPageBackEvent', e);
		let page = 'list';
		let pageType = 'list';
		let tmp_data: any;
		let converFundCompany: any;
		if (typeof e === 'object') {
			if (e.hasOwnProperty('page')) {
				page = e.page;
			}
			if (e.hasOwnProperty('type')) {
				pageType = e.type;
			}
			if (e.hasOwnProperty('data')) {
				tmp_data = e.data;
			}
			if (e.hasOwnProperty('converFundCompany')) {
				converFundCompany = e.converFundCompany;
			}
		}
		this._logger.step('FUND', 'page:', page);
		this._logger.step('FUND', 'pageType:', pageType);
		this._logger.step('FUND', 'tmp_data:', tmp_data);
		this._logger.step('FUND', 'converFundCompany:', converFundCompany);
		// 編輯頁面 - 基金選擇 子頁回傳
		if (pageType == 'success' && page == 'select-subject') {
			if (this.convertTypeContent == 'SelectSingle') {
				// 待 Gary修正完 須帶入基金公司
				this.fundData.compCode = (typeof tmp_data.compCode != 'undefined') ? tmp_data.compCode : '';
				this.fundData.compName = (typeof tmp_data.compName != 'undefined') ? tmp_data.compName : '';
				this.fundData['compShowName'] = converFundCompany.compCode + '-' + converFundCompany.compName;
				this.fundData.inFundCode = (typeof tmp_data.fundCode != 'undefined') ? tmp_data.fundCode : '';
				this.fundData.inFundName = (typeof tmp_data.fundName != 'undefined') ? tmp_data.fundName : '';
				this.fundData['inFundShowName'] = tmp_data.fundCode + '-' + tmp_data.fundName + '(' + tmp_data.risk + ')';
				this.fundData['inFundRisk'] = parseInt(tmp_data.risk.substring(2, tmp_data.risk.length), 10);
				this.fundData.hiIncome = (typeof tmp_data.hiIncome != 'undefined') ? tmp_data.hiIncome : '';
				this.nowPageType = 'editPageSingle';
			} else {
				this._logger.step('FUND', '基金選擇中multipleFundFlag: ', this.multipleFundFlag);
				if (this.multipleFundFlag == '1') {
					this.fundData['compCode1'] = (typeof converFundCompany.compCode != 'undefined') ? converFundCompany.compCode : '';
					this.fundData['compName1'] = (typeof converFundCompany.compName != 'undefined') ? converFundCompany.compName : '';
					this.fundData['compShowName1'] = converFundCompany.compCode + '-' + converFundCompany.compName;
					this.fundData['inFundCode1'] = (typeof tmp_data.fundCode != 'undefined') ? tmp_data.fundCode : '';
					this.fundData['inFundName1'] = (typeof tmp_data.fundName != 'undefined') ? tmp_data.fundName : '';
					this.fundData['inFundShowName1'] = tmp_data.fundCode + '-' + tmp_data.fundName + '(' + tmp_data.risk + ')';
					this.fundData['inFundRisk1'] = tmp_data.risk.substring(2, tmp_data.risk.length);
					this.fundData['hiIncome1'] = (typeof tmp_data.hiIncome != 'undefined') ? tmp_data.hiIncome : '';
				} else if (this.multipleFundFlag == '2') {
					this.fundData['compCode2'] = (typeof converFundCompany.compCode != 'undefined') ? converFundCompany.compCode : '';
					this.fundData['compName2'] = (typeof converFundCompany.compName != 'undefined') ? converFundCompany.compName : '';
					this.fundData['compShowName2'] = converFundCompany.compCode + '-' + converFundCompany.compName;
					this.fundData['inFundCode2'] = (typeof tmp_data.fundCode != 'undefined') ? tmp_data.fundCode : '';
					this.fundData['inFundName2'] = (typeof tmp_data.fundName != 'undefined') ? tmp_data.fundName : '';
					this.fundData['inFundShowName2'] = tmp_data.fundCode + '-' + tmp_data.fundName + '(' + tmp_data.risk + ')';
					this.fundData['inFundRisk2'] = tmp_data.risk.substring(2, tmp_data.risk.length);
					this.fundData['hiIncome2'] = (typeof tmp_data.hiIncome != 'undefined') ? tmp_data.hiIncome : '';
				} else if (this.multipleFundFlag == '3') {
					this.fundData['compCode3'] = (typeof converFundCompany.compCode != 'undefined') ? converFundCompany.compCode : '';
					this.fundData['compName3'] = (typeof converFundCompany.compName != 'undefined') ? converFundCompany.compName : '';
					this.fundData['compShowName3'] = converFundCompany.compCode + '-' + converFundCompany.compName;
					this.fundData['inFundCode3'] = (typeof tmp_data.fundCode != 'undefined') ? tmp_data.fundCode : '';
					this.fundData['inFundName3'] = (typeof tmp_data.fundName != 'undefined') ? tmp_data.fundName : '';
					this.fundData['inFundShowName3'] = tmp_data.fundCode + '-' + tmp_data.fundName + '(' + tmp_data.risk + ')';
					this.fundData['inFundRisk3'] = tmp_data.risk.substring(2, tmp_data.risk.length);
					this.fundData['hiIncome3'] = (typeof tmp_data.hiIncome != 'undefined') ? tmp_data.hiIncome : '';
				}
				this._logger.step('FUND', '基金選擇完畢: ', this.fundData);
				this.nowPageType = 'editPageMultiple';
			}
			this.goLeftBack();
			//2020/06/05 選擇基金時左側返回
		} else if(pageType == 'back' && page == 'select-subject') {
			this._logger.log("into select-fund back convert edit");
			//單筆轉換
			if(this.convertTypeContent == 'SelectSingle') {
				this._logger.log("into back to SelectSingle");
				this.nowPageType = 'editPageSingle';
				this.goLeftBack();
			//一轉多
			} else {
				this._logger.log("into back to editPageMultiple");
				this.nowPageType = 'editPageMultiple';
				this.goLeftBack();
		}
		}
		// 同意事項頁面 - 基金公開說明書 || 基金通路報酬通路資訊 子頁回傳
		if (pageType == 'success' && (page == 'fund-information1' || page == 'fund-information2')) {
			this.nowPageType = 'agreePage';
		}
	}

	changeFund(item) {
		if (this.convertTypeContent != 'SelectSingle') {
			this.multipleFundFlag = item;
		} else {
			this.multipleFundFlag = '';
		}
		this.req.investType = 'C';
		this.req.compCode = '';
		this.req.fundCode = this.fundData.fundCode; // 配合FI000402，必須給轉出基金代碼才能查轉入基金公司
		this.nowPageType = 'fundSelectPage';
	}

	public backMenuPage() {
		this.navgator.push('fund');
	}
	// 切換至資料確認頁面
	goToConfirm() {
		this._logger.step('FUND', '0. 切換至資料確認頁面goToConfirm ');
		if (this.agreeNote.note1 == true) {
			// if (this.agreeNote.note22 == false) {
			// 	this._handleError.handleError({
			// 		type: 'dialog',
			// 		title: 'POPUP.NOTICE.TITLE',
			// 		content: '未勾選同意事項或閱讀條款。'
			// 	});
			// }
			if (this.convertTypeContent == 'SelectMultiple') {
				if ((this.fundData['inFundCode1'] != '' && (this.agreeNote.note3 == false || this.agreeNote.note33 == false)) ||
					(this.fundData['inFundCode2'] != '' && (this.agreeNote.note4 == false || this.agreeNote.note44 == false)) ||
					(this.fundData['inFundCode3'] != '' && (this.agreeNote.note5 == false || this.agreeNote.note55 == false))) {
					// 未勾選同意事項
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: '未勾選同意事項或閱讀條款。'
					});
				} else {
					if (this.fundData['hiIncome1'] == 'Y' || this.fundData['hiIncome2'] == 'Y' || this.fundData['hiIncome3'] == 'Y') {
						if (this.agreeNote.note6 == true) {
							this.nowPageType = 'confirmPageMultiple';
						} else {
							// 未勾選「已知申購高收益債券類型基金」
							this._handleError.handleError({
								type: 'dialog',
								title: 'POPUP.NOTICE.TITLE',
								content: '未勾選「已知申購高收益債券類型基金」'
							});
						}
					} else {
						this.nowPageType = 'confirmPageMultiple';
					}
				}
			} else {
				if (this.agreeNote.note2 == false || this.agreeNote.note22 == false) {
					// 未勾選同意事項
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: '未勾選同意事項或閱讀條款。'
					});
				} else {
					this._logger.step('FUND', '0.1. 切換至資料確認頁面hiIncome: ', this.fundData['hiIncome']);
					if (this.fundData['hiIncome'] == 'Y') {
						if (this.agreeNote.note6 == true) {
							this.nowPageType = 'confirmPage';
						} else {
							// 未勾選「已知申購高收益債券類型基金」
							this._handleError.handleError({
								type: 'dialog',
								title: 'POPUP.NOTICE.TITLE',
								content: '未勾選「已知申購高收益債券類型基金」'
							});
						}
					} else {
						this.nowPageType = 'confirmPage';
					}
				}

			}
		} else {
			// 未勾選同意事項
			this._handleError.handleError({
				type: 'dialog',
				title: 'POPUP.NOTICE.TITLE',
				content: '未勾選同意事項或閱讀條款。'
			});
		}
	}
	//左側返回控制
	goLeftBack() {
		this._logger.log("into goLeftBack");
		this._headerCtrl.setLeftBtnClick(() => {
			switch (this.nowPageType) {
				case 'editPageSingle':
					this._logger.log("back button editPageSingle");
					this.onBackPageData();
					break;
				case 'editPageMultiple':
					this._logger.log("back button editPageMultiple");
					this.onBackPageData();
					break;
				case 'agreePage':
					if (this.convertTypeContent == 'SelectSingle') {
						this._logger.log("agreePage back to editPageSingle");
						this.nowPageType = 'editPageSingle';
					} else {
						this._logger.log("agreePage back to editPageMultiple");
						this.nowPageType = 'editPageMultiple';
					}
					break;
				default:
					this.navgator.push("fund");
					break;
			}
		});
	}
	// 切換至同意事項頁面
	goToAgree() {
		this.nowPageType = 'agreePage';
	}
	// 切換至結果頁面
	goToResult() {
		// 安控變數設置
		this.securityObj = {
			'action': 'submit',
			'sendInfo': this.userAddress.SEND_INFO
		};
	}

	dateSelect() {
		this.nowPageType = 'dateSelectPage';
	}

	// 同意事項頁面- 條款一勾選
	agreeNote1Click() {
		this.agreeNote.note1 = !this.agreeNote.note1;
	}
	// 同意事項頁面- 條款二勾選
	agreeNote2Click() {
		this.agreeNote.note2 = !this.agreeNote.note2;
	}
	// 同意事項頁面- 條款三勾選
	agreeNote3Click() {
		this.agreeNote.note3 = !this.agreeNote.note3;
	}
	// 同意事項頁面- 條款四勾選
	agreeNote4Click() {
		this.agreeNote.note4 = !this.agreeNote.note4;
	}
	// 同意事項頁面- 條款五勾選
	agreeNote5Click() {
		this.agreeNote.note5 = !this.agreeNote.note5;
	}
	// 同意事項頁面- 條款五勾選
	agreeNote6Click() {
		this.agreeNote.note6 = !this.agreeNote.note6;
	}

	agreeNote22Click() {
		this.agreeNote.note22 = !this.agreeNote.note22;
	}

	agreeNote33Click() {
		this.agreeNote.note33 = !this.agreeNote.note33;
	}

	agreeNote44Click() {
		this.agreeNote.note44 = !this.agreeNote.note44;
	}

	agreeNote55Click() {
		this.agreeNote.note55 = !this.agreeNote.note55;
	}
	// 同意事項頁面 -基金之公開說明書 popup
	linkToBook1() {
		// this.nowPageType = 'fundInformation1';
		const set_data = new FundInformation1();
		this.infomationService.show(set_data);
	}
	// 同意事項頁面 -基金通路報酬揭露資訊 popup
	linkToBook2() {
		// this.nowPageType = 'fundInformation2';
		// const set_data = new FundInformation2();
		// this.infomationService.show(set_data);
		const navParams = {};
		const params = {
			p: this.fundData.inFundCode
		};
		this._logger.step('FUND', 'linkToBook2: ', params);
		this.navgator.push('web:fund-info', {}, params);
	}
	// 同意事項頁面 -基金通路報酬揭露資訊 popup
	linkToBook3(reqCode) {
		// this.nowPageType = 'fundInformation2';
		// const set_data = new FundInformation2();
		// this.infomationService.show(set_data);
		const navParams = {};
		const params = {
			p: ''
		};
		params['p'] = reqCode;
		this._logger.step('FUND', 'linkToBook3: ', params);
		this.navgator.push('web:fund-info', {}, params);
	}
	// 同意事項頁面 -以投資高收益債券為訴求之證券投資信託基金、境外基金風險預告書 popup
	linkToBook5() {
		// this.nowPageType = 'fundInformation2';
		const set_data = new FundInformation5();
		this.infomationService.show(set_data);
	}

	// 同意事項頁面 -基金近五年費用率及報酬率 popup
	linkToBook22() {
		// this.nowPageType = 'fundInformation2';
		// const set_data = new FundInformation2();
		// this.infomationService.show(set_data);

		// const navParams = {};
		// const params = {
		//     FUNDID: this.fundData.inFundCode,
		//     FILE: 21
		// };
		// this._logger.step('FUND', 'linkToBook22: ', params);
		// this.navgator.push('web:fund-info5', {}, params);
		let urlstr = "https://tcbbankfund.moneydj.com/w/CustFundIDMap.djhtm?FUNDID=" + this.fundData.inFundCode['fundCode'] + "&FILE=21";
		this.navgator.push(urlstr, {});
	}

	// 同意事項頁面 -基金近五年費用率及報酬率 popup
	linkToBook33(reqCode) {
		// this.nowPageType = 'fundInformation2';
		// const set_data = new FundInformation2();
		// this.infomationService.show(set_data);

		// const navParams = {};
		// const params = {
		//     FUNDID: reqCode,
		//     FILE: 21
		// };
		// this._logger.step('FUND', 'linkToBook22: ', params);
		// this.navgator.push('web:fund-info5', {}, params);
		let urlstr = "https://tcbbankfund.moneydj.com/w/CustFundIDMap.djhtm?FUNDID=" + reqCode + "&FILE=21";
		this.navgator.push(urlstr, {});
	}

	/**
   * 第一個checkbox url
   */
	goFundUrl(type) {
		if (type == '1') {
			this.navgator.push('web:overseas-info-fund', {});
		} else {
			this.navgator.push('web:public-info-fund', {});
		}
	}
    /**
     * 點選checkbox
     */
	chgAgree(type) {
		if (type == '1') {
			this.agree1 = !this.agree1
		} else if (type == '2') {
			this.agree2 = !this.agree2
		} else if (type == '3') {
			this.agree3 = !this.agree3
		}
	}

	// 確認頁 - 勾選已閱讀上開條款
	agreeConfirm() {
		this.agreeConfirmNote = !this.agreeConfirmNote;
	}

	public showDescript() {
		const set_data = new FundInformationReserve2();
		this.infomationService.show(set_data);
	}

	public dateChange(date?: any) {
		this.fundData.enrollDate = date;
		let todayF = this._formateService.transDate(this.todate, 'yyyy/MM/dd');
		if (this.fundData.enrollDate == todayF) {
			this.reservFlag = false;
		} else {
			this.reservFlag = true;
		}
		this._logger.step('FUND', 'this.enrollDate: ', this.fundData.enrollDate);
		this._logger.step('FUND', 'this.reservFlag: ', this.reservFlag);
	}

	public convertAllClick() {
		if (this.setData.iNCurrency == 'TWD' || this.setData.iNCurrency == 'NTD' || this.setData.iNCurrency == 'JPY') {
			//  台幣金額去掉小數點
			this.fundData.transAmount = this.setData.invenAmount.substr(0, this.setData.invenAmount.indexOf('.'));
		} else {
			this.fundData.transAmount = this.setData.invenAmount;
		}
	}

	amntCheck(checkAmount, checkCurrency, msgType?: any) {
		// 只能輸入正整數
		const req_curr = {
			currency: 'POSITIVE'
		};
		this._logger.step('FUND', 'CHnage1: ', checkAmount, req_curr);
		if (checkAmount == '') {
			this.errorMsg[msgType] = '轉換金額不得為空';
		} else {
			const check_obj = this._errorCheck.checkMoney(checkAmount, req_curr); // 金額檢核
			if (check_obj.status) {
				this.errorMsg[msgType] = '';
			} else {
				this.errorMsg[msgType] = check_obj.msg;
			}
			this._logger.step('FUND', 'CHnage2: ', check_obj);
		}
	}
	backStep(type) {
		if (type == '1') {
			this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
				title: '提醒您'
			}).then(
				() => {
					//確定
					this.navgator.push('fund');
				},
				() => {
				}
			);
		} else if (type == '2') {
			logger.error('this.convertTypeContent', this.convertTypeContent);
			if (this.convertTypeContent == 'SelectSingle') {
				this.nowPageType = 'editPageSingle';
			} else {
				this.nowPageType = 'editPageMultiple';
			}
		} else if (type == '3') {
			this.nowPageType = 'agreePage';
		}
	}
	public confirmPage() {
		// 送出確認
		if (this.fundData.payAcnt['account'] == '請選擇扣款帳號') {
			// 未選擇轉入標的
			this._handleError.handleError({
				type: 'dialog',
				title: 'POPUP.NOTICE.TITLE',
				content: '請選手續費約定扣款帳號'
			});
			return false;
		}
		if (this.convertTypeContent == 'SelectSingle') {
			if (this.fundData['transAmount'] == '') {
				// 未輸入轉換金額
				this._handleError.handleError({
					type: 'dialog',
					title: 'POPUP.NOTICE.TITLE',
					content: '請輸入轉換金額'
				});
				this.errorMsg.money1 = '請輸入轉換金額';
				return false;
			} else {
				const check = this._errorCheck.checkMoney(this.fundData['transAmount']);
				this._logger.step('FUND', '金額檢核: ', check);
				if (check.status) {
					// 轉換金額總和必須小於信託本金
					if (parseInt(this.fundData.amount, 10) < parseInt(this.fundData['transAmount'], 10)) {
						this._handleError.handleError({
							type: 'dialog',
							title: 'POPUP.NOTICE.TITLE',
							content: '轉換金額總和必須小於信託本金'
						});
						return false;
					}
					this.errorMsg.money = '';
				} else {
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: '請輸入轉換金額'
					});
					this.errorMsg.money = check.msg;
					return false;
				}
			}
			if (this.fundData.inFundCode == '' && this.fundData.inFundName == '') {
				// 未選擇轉入標的
				this._handleError.handleError({
					type: 'dialog',
					title: 'POPUP.NOTICE.TITLE',
					content: '請選擇轉入標的'
				});
				return false;
			}
			this._logger.step('FUND', '投資風險: ', this.rtType, this.fundData['inFundRisk']);
			let riskMsg = false;
			if (this.rtType == '1') {
				if (this.fundData['inFundRisk'] == '4' || this.fundData['inFundRisk'] == '5') {
					riskMsg = true;
				}
			} else if (this.rtType == '1') {
				if (this.fundData['inFundRisk'] == '5') {
					riskMsg = true;
				}
			}
			if (riskMsg == true) {
				// 未選擇轉入標的
				this.confirm.show('您本次欲申購/轉入的基金「' + this.fundData.inFundCode + this.fundData.inFundName + '(RR' + this.fundData['inFundRisk']
					+ ')」，其風險等級為RR' + this.fundData['inFundRisk'] + '，高於您的投資屬性之風險承受度，本行依主管機關規定，當您購買商品風險等級超出您的投資屬性之風險程度時(時下)，將不可進行交易，\n'
					+ '*保守型客戶不可購買風險等級為RR3-RR5之商品。\n *穩健型客戶不可購買風險等級RR5之商品', {
						title: '提醒您',
						btnYesTitle: '風險承受度測驗',
						btnNoTitle: '取消'
					}).then(
						() => {
							// 選擇風險承受度測驗
							this.navgator.push('fund-group-resk-test');
						},
						() => {
							// 選擇取消
							this.backMenuPage();
						}
					);
			} else {
				this.hiIncome = (this.fundData['hiIncome'] == 'Y') ? 'Y' : '';
				this._logger.step('FUND', '送出fundData單轉: ', this.fundData);
				//2020/03/04 部分轉換 要判斷最低金額級距
				if (this.fundData.redeemType == '2') {
					this._logger.log("into fundData.redeemType == 2");
					this._logger.log("into setData.iNCurrency:", this.setData.iNCurrency);
					let checkMoney = this.checkCurrencyRule(this.fundData.transAmount);
					this.errorMsg['money'] = checkMoney['msg'];
					if (checkMoney['status'] == false) {
						return false;
					}
				}
				this.sendConvertApplySingle();
			}
		} else {
			//3個多轉欄位之金額級距檢核，有一個為false就阻擋
			let checkMoneyStatus = {
				transAmount1: true,
				transAmount2: true,
				transAmount3: true
			};
			let totalInAmnt = 0;
			if (this.fundData['inFundCode1'] == '' && this.fundData['inFundName1'] == '') {
				// 未選擇轉入標的(1)
				this._handleError.handleError({
					type: 'dialog',
					title: 'POPUP.NOTICE.TITLE',
					content: '請選擇轉入標的'
				});
				return false;
			} else {
				if (this.fundData['transAmount1'] == '') {
					// 未輸入轉換金額
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: '請輸入轉換金額(1)'
					});
					this.errorMsg.money1 = '請輸入轉換金額';
					return false;
				} else {
					const check = this._errorCheck.checkMoney(this.fundData['transAmount1']);
					if (check.status) {
						totalInAmnt += parseInt(this.fundData['transAmount1'], 10);
						this.errorMsg.money1 = '';
					} else {
						this._handleError.handleError({
							type: 'dialog',
							title: 'POPUP.NOTICE.TITLE',
							content: '請輸入轉換金額'
						});
						this.errorMsg.money1 = check.msg;
						return false;
					}
					//2020/03/04 部分轉換 要判斷最低金額級距
					if (this.fundData.redeemType == '2') {
						let checkMoney1 = this.checkCurrencyRule(this.fundData['transAmount1']);
						checkMoneyStatus['transAmount1'] = checkMoney1['status'];
						this.errorMsg.money1 = checkMoney1['msg'];
					}
				}
			}
			if (this.fundData['inFundCode2'] != '' || this.fundData['inFundName2'] != '' || this.fundData['transAmount2'] != '') {
				const check = this._errorCheck.checkMoney(this.fundData['transAmount2']);
				if (check.status) {
					totalInAmnt += parseInt(this.fundData['transAmount2'], 10);
					this.errorMsg.money2 = '';
				} else {
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: '請輸入轉換金額(2)'
					});
					this.errorMsg.money2 = check.msg;
					return false;
				}
				if (this.fundData['inFundCode2'] == '' || this.fundData['inFundName2'] == '') {
					// 未輸入轉換標的
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: '請選擇轉入標的(2)'
					});
					return false;
				}
				//2020/03/04 部分轉換 要判斷最低金額級距
				if (this.fundData.redeemType == '2') {
					let checkMoney2 = this.checkCurrencyRule(this.fundData['transAmount2']);
					checkMoneyStatus['transAmount2'] = checkMoney2['status'];
					this.errorMsg.money2 = checkMoney2['msg'];
				}
			}
			if (this.fundData['inFundCode3'] != '' || this.fundData['inFundName3'] != '' || this.fundData['transAmount3'] != '') {
				const check = this._errorCheck.checkMoney(this.fundData['transAmount3']);
				if (check.status) {
					totalInAmnt += parseInt(this.fundData['transAmount3'], 10);
					this.errorMsg.money3 = '';
				} else {
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: '請輸入轉換金額(3)'
					});
					this.errorMsg.money3 = check.msg;
					return false;
				}
				if (this.fundData['inFundCode3'] == '' || this.fundData['inFundName3'] == '') {
					// 未輸入轉換標的
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: '請選擇轉入標的(3)'
					});
					return false;
				}
				//2020/03/04 部分轉換 要判斷最低金額級距
				if (this.fundData.redeemType == '2') {
					let checkMoney3 = this.checkCurrencyRule(this.fundData['transAmount3']);
					checkMoneyStatus['transAmount3'] = checkMoney3['status'];
					this.errorMsg.money3 = checkMoney3['msg'];
				}
			}
			//多轉情況，3個金額欄位，有其中一個金額級距不符合，直接阻擋
			if (checkMoneyStatus['transAmount1'] == false || checkMoneyStatus['transAmount2'] == false
				|| checkMoneyStatus['transAmount3'] == false) {
				return false;
			}
			// 轉換金額總和必須小於信託本金
			if (parseInt(this.fundData.amount, 10) < totalInAmnt) {
				this._handleError.handleError({
					type: 'dialog',
					title: 'POPUP.NOTICE.TITLE',
					content: '轉換金額總和必須小於信託本金'
				});
				return false;
			}
			this._logger.step('FUND', '投資風險: ', this.rtType, '/1:', this.fundData['inFundRisk1'], '/2:'
				, this.fundData['inFundRisk2'], '/3:', this.fundData['inFundRisk3']);
			let riskMsg = false;
			let col = '';
			if (this.rtType == '1') {
				if (this.fundData['inFundRisk1'] == '4' || this.fundData['inFundRisk1'] == '5') {
					riskMsg = true;
					col = '1';
				}
				if (this.fundData['inFundRisk2'] == '4' || this.fundData['inFundRisk2'] == '5') {
					riskMsg = true;
					col = '2';
				}
				if (this.fundData['inFundRisk3'] == '4' || this.fundData['inFundRisk3'] == '5') {
					riskMsg = true;
					col = '3';
				}
			} else if (this.rtType == '2') {
				if (this.fundData['inFundRisk1'] == '5') {
					riskMsg = true;
					col = '1';
				}
				if (this.fundData['inFundRisk2'] == '5') {
					riskMsg = true;
					col = '2';
				}
				if (this.fundData['inFundRisk3'] == '5') {
					riskMsg = true;
					col = '3';
				}
			}
			if (riskMsg == true) {
				let selectRiskType = '';
				let selectFundName = '';
				let selectFundCode = '';
				if (col == '1') {
					selectRiskType = this.fundData['inFundRisk1'];
					selectFundName = this.fundData['inFundName1'];
					selectFundCode = this.fundData['inFundCode1'];
				} else if (col == '2') {
					selectRiskType = this.fundData['inFundRisk2'];
					selectFundName = this.fundData['inFundName2'];
					selectFundCode = this.fundData['inFundCode2'];
				} else if (col == '3') {
					selectRiskType = this.fundData['inFundRisk3'];
					selectFundName = this.fundData['inFundName3'];
					selectFundCode = this.fundData['inFundCode3'];
				}
				// 未選擇轉入標的
				this.confirm.show('您本次欲申購/轉入的基金「' + selectFundCode + selectFundName + '(RR' + selectRiskType
					+ ')」，其風險等級為RR' + selectRiskType + '，高於您的投資屬性之風險承受度，本行依主管機關規定，當您購買商品風險等級超出您的投資屬性之風險程度時(時下)，將不可進行交易，\n'
					+ '*保守型客戶不可購買風險等級為RR3-RR5之商品。\n *穩健型客戶不可購買風險等級RR5之商品', {
						title: '提醒您',
						btnYesTitle: '風險承受度測驗',
						btnNoTitle: '取消'
					}).then(
						() => {
							// 選擇風險承受度測驗
							this.navgator.push('fund-group-resk-test');
						},
						() => {
							// 選擇取消
							this.backMenuPage();
						}
					);
			} else {
				// tslint:disable-next-line:max-line-length
				this.hiIncome = (this.fundData['hiIncome1'] == 'Y' || this.fundData['hiIncome2'] == 'Y' || this.fundData['hiIncome3'] == 'Y') ? 'Y' : '';
				this._logger.step('FUND', '送出fundData一轉多: ', this.fundData);
				this.sendConvertApplyMultiple();
			}
		}
	}

	//檢核幣別金額級距
	checkCurrencyRule(amount) {
		let output = {
			status: false,
			msg: ''
		};
		//台幣
		//2020/06/05 依照清福需求，目前先關閉台幣相關 1.金額級距、2.最低金額檢核
		if (this.setData.iNCurrency == 'TWD' || this.setData.iNCurrency == 'NTD') {
			this._logger.log("into iNCurrency twd");
			//轉換單位不為10000倍數
			// if (parseInt(amount) % 10000 != 0) {
			// 	// this.errorMsg.money = ;
			// 	output['status'] = false;
			// 	output['msg'] = '輸入需為幣別單位10000';
			// } else {
				// this.errorMsg.money = '';
				output['status'] = true;
				output['msg'] = '';
			// }
			//外幣
		} else {
			this._logger.log("into iNCurrency foregin");
			let currencyRule = {
				USD: 100,
				EUR: 100,
				GBP: 100,
				AUD: 100,
				CHF: 100,
				CAD: 100,
				HKD: 1000,
				SEK: 1000,
				JPY: 10000,
				CNY: 1000,
				ZAR: 1000,
				NZD: 100,
				SGD: 100
			};
			let leastMoney = 0;
			switch (this.setData.iNCurrency) {
				case 'USD':
					leastMoney = currencyRule.USD;
					break;
				case 'EUR':
					leastMoney = currencyRule.EUR;
					break;
				case 'GBP':
					leastMoney = currencyRule.GBP;
					break;
				case 'AUD':
					leastMoney = currencyRule.AUD;
					break;
				case 'CHF':
					leastMoney = currencyRule.CHF;
					break;
				case 'CAD':
					leastMoney = currencyRule.CAD;
					break;
				case 'HKD':
					leastMoney = currencyRule.HKD;
					break;
				case 'SEK':
					leastMoney = currencyRule.SEK;
					break;
				case 'JPY':
					leastMoney = currencyRule.JPY;
					break;
				case 'CNY':
					leastMoney = currencyRule.CNY;
					break;
				case 'ZAR':
					leastMoney = currencyRule.ZAR;
					break;
				case 'NZD':
					leastMoney = currencyRule.NZD;
					break;
				case 'SGD':
					leastMoney = currencyRule.SGD;
					break;
				default:
					leastMoney = 0;
					break;
			}
			this._logger.log("setData.iNCurrency:", this.setData.iNCurrency);
			this._logger.log("leastMoney:", leastMoney);
			//不符合金額級距
			if (parseInt(amount) % leastMoney != 0) {
				// this.errorMsg.money = '輸入需為幣別單位' + leastMoney.toString();
				output['status'] = false;
				output['msg'] = '輸入需為幣別單位' + leastMoney.toString();
				// return false;
			} else {
				// this.errorMsg.money = '';
				output['status'] = true;
				output['msg'] = '';
			}
		}
		return output;
	}

	/* 單筆轉換申請確認
	* */
	private sendConvertApplySingle() {
		let r_data = {
			custId: this.fundData.custId, // 身分證字號
			trustAcnt: this.fundData.trustAcnt, // 信託帳號
			transCode: this.fundData.transCode, // 交易編號
			fundCode: this.fundData.fundCode, // 轉出基金代碼
			amount: this.fundData.amount, // 信託金額
			unit: this.fundData.unit, // 單位數
			inCurrency: this.fundData.inCurrency, // 投資幣別
			investType: this.fundData.investType, // 投資型態
			transAmount: this.fundData.transAmount,  // 轉換金額
			payAcnt: this.fundData.payAcnt['account'], // 手續費扣款帳號
			redeemType: this.fundData.redeemType, // 轉換方式
			inFundCode: this.fundData.inFundCode, // 轉入基金代碼
		};
		let bookDate = '';
		bookDate = this._formateService.transDate(this.fundData.enrollDate, { formate: 'yyyMMdd', chinaYear: true });
		this._logger.step('FUND', '民國年 bookDate: ', bookDate);
		r_data['bookDate'] = bookDate;
		this._logger.step('FUND', 'sendConvertApply: ', r_data);
		if (this.reservFlag == false) {
			//點擊確認後，一起判斷安控變數(serviceId)
			this.transactionObj['serviceId'] = 'FI000508'; //即時id
			this._convertApply.getData(r_data).then(
				(resObj) => {
					this.resultData = resObj.info_data;
					this.resultData.branchName = this.info_401.branchName; // alex0520
					this.resultData.unitCall = this.info_401.unitCall;
					this._logger.step('FUND', 'get resultData: ', this.resultData);
					this.nowPageType = 'agreePage';
					this.goLeftBack();
				},
				(errorObj) => {
					if (errorObj.resultCode == 'ERR1C108') {
						this._handleError.handleError({
							type: 'dialog',
							title: 'POPUP.NOTICE.TITLE',
							content: 'ERROR.CANNOT_PURCHARSE'
							// 投資風險屬性不允許申購或轉換此檔基金
						});
					} else if (errorObj.resultCode == 'F182') {
						// 未勾選同意事項
						this._handleError.handleError({
							type: 'dialog',
							title: 'POPUP.NOTICE.TITLE',
							content: '轉換金額不符最低交易金額限制。'
						});
					} else {
						this._handleError.handleError(errorObj);
					}
				});
		} else {
			this._logger.step('FUND', 'sendConvertApplyReserve: ', r_data);
			this.transactionObj['serviceId'] = 'FI000510'; //預約id
			this._logger.log("is resver, transactionObj:",this.transactionObj);
			this._convertApplyReserve.getData(r_data).then(
				(resObj) => {
					this.resultData = resObj.info_data;
					this.resultData.branchName = this.info_401.branchName; // alex0520
					this.resultData.unitCall = this.info_401.unitCall;
					this._logger.step('FUND', 'get resultData Reserve: ', this.resultData);
					this.nowPageType = 'agreePage';
					this.goLeftBack();
				},
				(errorObj) => {
					if (errorObj.resultCode == 'ERR1C108') {
						this._handleError.handleError({
							type: 'dialog',
							title: 'POPUP.NOTICE.TITLE',
							content: 'ERROR.CANNOT_PURCHARSE'
							// 投資風險屬性不允許申購或轉換此檔基金
						});
					} else if (errorObj.resultCode == 'F182') {
						// 未勾選同意事項
						this._handleError.handleError({
							type: 'dialog',
							title: 'POPUP.NOTICE.TITLE',
							content: '轉換金額不符最低交易金額限制。'
						});
					} else {
						this._handleError.handleError(errorObj);
					}
				});
		}
	}

	/* 一轉多轉換申請確認
	* */
	private sendConvertApplyMultiple() {
		let r_data = {
			custId: this.fundData.custId, // 身分證字號
			trustAcnt: this.fundData.trustAcnt, // 信託帳號
			transCode: this.fundData.transCode, // 交易編號
			fundCode: this.fundData.fundCode, // 轉出基金代碼
			amount: this.fundData.amount, // 信託金額
			unit: this.fundData.unit, // 單位數
			inCurrency: this.fundData.inCurrency, // 投資幣別
			investType: this.fundData.investType, // 投資型態
			transAmount1: this.fundData['transAmount1'],  // 轉換金額1
			transAmount2: this.fundData['transAmount2'],  // 轉換金額2
			transAmount3: this.fundData['transAmount3'],  // 轉換金額3
			payAcnt: this.fundData.payAcnt['account'], // 手續費扣款帳號
			redeemType: this.fundData.redeemType, // 轉換方式
			inFundCode1: this.fundData['inFundCode1'], // 轉入基金代碼
			inFundCode2: this.fundData['inFundCode2'], // 轉入基金代碼
			inFundCode3: this.fundData['inFundCode3'], // 轉入基金代碼
		};

		this._logger.step('FUND', 'sendConvertApply Multiple: ', r_data);
		this.transactionObj['serviceId'] = 'FI000512';
		this._logger.log("is multiple, transactionObj:",this.transactionObj);
		this._convertApplyMultiple.getData(r_data).then(
			(resObj) => {
				this.resultData = resObj.info_data;
				this.resultData.branchName = this.info_401.branchName; // alex0520
				this.resultData.unitCall = this.info_401.unitCall;
				this._logger.step('FUND', 'get resultData Multiple: ', this.resultData);
				// 若為一轉多，則先跳到同意事項頁面
				this.nowPageType = 'agreePage';
				this.goLeftBack();
			},
			(errorObj) => {
				if (errorObj.resultCode == 'ERR1C108') {
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: 'ERROR.CANNOT_PURCHARSE'
						// 投資風險屬性不允許申購或轉換此檔基金
					});
				} else {
					this._handleError.handleError(errorObj);
				}
			});
	}
	public clearFund(item) {
		if (item == '2') {
			this.fundData['inFundCode2'] = '';
			this.fundData['inFundName2'] = '';
			this.fundData['inFundShowName2'] = '請選擇基金標的';
			this.fundData['compCode2'] = '';
			this.fundData['compName2'] = '';
			this.fundData['compShowName2'] = '請選擇基金公司';
			this.fundData['transAmount2'] = '';
			this.fundData['inFundRisk2'] = '';
			this.fundData['hiIncome2'] = '';
		} else if (item == '3') {
			this.fundData['inFundCode3'] = '';
			this.fundData['inFundName3'] = '';
			this.fundData['inFundShowName3'] = '請選擇基金標的';
			this.fundData['compCode3'] = '';
			this.fundData['compName3'] = '';
			this.fundData['compShowName3'] = '請選擇基金公司';
			this.fundData['transAmount3'] = '';
			this.fundData['inFundRisk3'] = '';
			this.fundData['hiIncome3'] = '';
		}
	}
}
