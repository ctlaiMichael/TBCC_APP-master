/**
 * 線上簽約對保-撥款日期頁
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { SignProtectService } from '@pages/online-loan/shared/service/sign-protect.service';
import { FormateService } from '@shared/formate/formate.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckService } from '@shared/check/check.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

@Component({
	selector: 'app-sign-protect-date',
	templateUrl: './sign-protect-date-page.component.html',
	styleUrls: [],
	providers: [SignProtectService]
})

export class SignProtectDatePageComponent implements OnInit {

	@Input() fullData: any;
	@Input() custInfo: any;
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

	today_clone = '';
	today = '';       // 預設今天
	minDay = '';      // 日期可選之最小值
	maxDay = '';      // 日期可選之最大值
	dateFlag = false; // 撥款日不得為假日
	errorMsg = '';    // 撥款日期錯誤提示
	rangeNum = true;  // 撥款日期第一天為禮拜五時，會發生跨兩個週末，所以需修改查詢範圍限制。
	signDate = '';  // 條款簽約日期
	reqData = {
		custId: '',
		userId: '',
		aprprdbgn: '',
		aprprdend: '',
		verNo: '',
		singAgree: '',
		singKind: '',
		singDate: '',
		singelDate: '',
		singTimeStam: ''
	};
	otherReqData = {
		custId: '',
		ebkCaseNo: ''
	}



	//-----------20191111 安控暫時關閉--------//
	securityA = true;
	securityB = true;
	safeE = {};
	// request
	userAddress = {
		'USER_SAFE': '',
		'SEND_INFO': ''
	};

	// 加入安控機制
	transactionObj = {
		serviceId: 'F9000502', //*電文規格出來要改
		categoryId: '6',
		transAccountType: '2',  // 回傳1 (約轉)。 2 為(非約轉)。
	};

	securityObj = {
		'action': 'init',
		'sendInfo': {}
	};
	//-----------------------------------//

	constructor(
		private _logger: Logger,
		private navgator: NavgatorService,
		private _mainService: SignProtectService,
		private _formateService: FormateService,
		private confirm: ConfirmService,
		private _headerCtrl: HeaderCtrlService,
		private _checkService: CheckService,
		private _handleError: HandleErrorService,
		private _uiContentService: UiContentService
	) { }

	ngOnInit() {
		this._logger.error("into datePage");
		this.getDateDate();
		this.otherReqData.custId = this.custInfo['id_no'];
		this.otherReqData.ebkCaseNo = this.fullData.ebkCaseNo;
		this._headerCtrl.setLeftBtnClick(() => {
			this.backPageEmit.emit({
				page: 'sign-search',
				type: 'go-sign',
				data: this.fullData,
				custInfo: this.custInfo,
				otherReqData: this.otherReqData
			});
		});
	}

	// 取消編輯
	onCancel() {
		this.confirm.show('您是否放棄此次編輯?', {
			title: '提醒您',
			btnYesTitle: '確定',
			btnNoTitle: '取消'
		}).then(
			() => {
				this.navgator.push('online-loan');
			},
			() => {

			}
		);
	}

	// 取得日期
	getDateDate() {
		this.today = this._mainService.setToday();
		this.reqData['aprprdbgn'] = this.getNextBussDay(this.today);
		let dateSet = {
			baseDate: this.reqData['aprprdbgn'], // 基礎日
			rangeType: 'D', // "查詢範圍類型" M OR D
			rangeNum: '8', // 查詢範圍限制
			rangeDate: '' // 比較日
		};
		// 撥款日期第一天為禮拜五時，為特殊狀況。
		if (this.rangeNum == false) {
			dateSet.rangeNum = '10';
		}
		const date_data = this._checkService.getDateSet(dateSet, 'future');
		this.today_clone = this._formateService.transClone(this.today).replace(/-/g, '/');
		this.signDate = this._formateService.transClone(this.today).replace(/-/g, '');
		this._logger.log('this.today_clone', this.today_clone);
		this.maxDay = date_data.maxDate;
		this.minDay = date_data.minDate;






		//-----------20191111 安控暫時關閉--------//
		// 安控變數初始化
		// this.securityObj = {
		// 	'action': 'init',
		// 	'sendInfo': this.userAddress.SEND_INFO
		// };
		// this.transactionObj['serviceId'] = 'F9000502'; //*電文規格出來要改
		//--------------------------------------//
	}

	/**
	 * 日期選擇返回事件
	 * @param e
	 */
	onInputBack(e) {
		this._logger.error('datePage e', e);
		if (this.reqData.aprprdbgn.indexOf('-') > 0) {
			this.reqData.aprprdbgn = this.reqData.aprprdbgn.replace(/-/g, '/');
		}
	}

	// 前往契約頁
	onContract() {
		this._logger.error('時間檢查');
		// 檢查撥款日期
		let date_Check = this.getChoosenDaty(this.reqData.aprprdbgn);
		this._logger.error('dateCheck:', date_Check);
		if (date_Check.status == true) {
			this.errorMsg = '';
			this.dateFlag = false;
			this.backPageEmit.emit({
				page: 'sign-contract',
				type: 'go-contract',
				data: this.fullData,
				custInfo: this.custInfo,
				signDate: this.signDate,
				date: this.reqData['aprprdbgn']
			});
		} else {
			// 當使用者輸入有誤時，將頁面拉回最上方。
			this._uiContentService.scrollTop();
			this.errorMsg = date_Check.msg;
			return false;
		}
	}

	/** 
	 * 計算撥款日期 (對保日後第二個營業日起至第八個營業日，不得選擇週六及週日)
	 * EX:對保日為禮拜四，撥款日為下禮拜一
	 *    對保日為禮拜五.六.日，撥款日為下禮拜二
	 * @param bussinessDay 
	 */
	getNextBussDay(bussinessDay) {
		let timestamp = new Date(bussinessDay).getTime();
		timestamp = timestamp + 172800000;  // 將對保日加兩天
		let nextDay = new Date(timestamp);
		let weekdate = nextDay.getDay();
		if (weekdate == 6 || weekdate == 0) {  // 對保日加完為禮拜六.日則再加2日
			let timestamp2 = timestamp + 172800000;
			nextDay = new Date(timestamp2);
		} else if (weekdate == 1) { // 對保日加完為禮拜一則再加1日
			let timestamp2 = timestamp + 86400000;
			nextDay = new Date(timestamp2);
		} else if (weekdate == 5) { // 對保日加完為禮拜五，會有跨週末問題，則特別處理。
			this.rangeNum = false;
		}
		let Year = nextDay.getFullYear();
		let Month = nextDay.getMonth() + 1;
		let Day = nextDay.getDate();

		let Time = Year + '-' + (Month < 10 ? '0' + Month : Month) + '-' + (Day < 10 ? '0' + Day : Day);
		this._logger.debug('nextDaynextDay', Time);

		return Time;
	}

	/**
	 * 撥款日期檢查
	 * @param date 
	 */
	getChoosenDaty(date: any) {
		let output = {
			status: false,
			msg: '撥款日期應為營業日(非假日)，請重新選擇。',
		}
		let dateCheck = new Date(date).getDay();
		if (dateCheck == 6 || dateCheck == 0) {
			this._handleError.handleError({
				type: 'dialog',
				title: '提醒您',
				content: '輸入項目有誤，請再次確認輸入欄位。'
			});
			this.dateFlag = true;
			return output
		} else {
			output.status = true;
			output.msg = '';
			return output
		}
	}



	//-----------20191111 安控暫時關閉--------//
	// 安控函式
	// securityOptionBak(e) {
	// 	this._logger.log('securityOptionBak: ', e);
	// 	if (e.status) {
	// 		// 取得需要資料傳遞至下一頁子層變數
	// 		this.userAddress.SEND_INFO = e.sendInfo;
	// 		this.userAddress.USER_SAFE = e.sendInfo.selected;
	// 		this.securityObj = {
	// 			'action': 'init',
	// 			'sendInfo': e.sendInfo
	// 		};
	// 	} else {
	// 		// do errorHandle 錯誤處理 推業或POPUP
	// 		e['type'] = 'message';
	// 		this._handleError.handleError(e.ERROR);
	// 	}
	// }

	// // 安控機制
	// stepBack(e) {
	// 	if (e.status) {
	// 		this._logger.log(e);
	// 		if (e.securityType === '3') {
	// 			e.otpObj.depositNumber = ''; // 轉出帳號 
	// 			e.otpObj.depositMoney = ''; // 金額 
	// 			e.otpObj.OutCurr = ''; // 幣別 
	// 			e.transTypeDesc = ''; // 
	// 		} else if (e.securityType === '2') {
	// 			e.signText = {
	// 				// 憑證 寫入簽章本文
	// 				'custId': this.authService.getCustId(),
	// 				'userId': this.reqData.userId,
	// 				'aprprdbgn': this.reqData.aprprdbgn,
	// 				'aprprdend': this.reqData.aprprdend,
	// 				'verNo': this.reqData.verNo,
	// 				'singAgree': this.reqData.singAgree,
	// 				'singKind': this.reqData.singKind,
	// 				'singDate': this.reqData.singDate,
	// 				'singelDate': this.reqData.singelDate,
	// 				'singTimeStam': this.reqData.singTimeStam
	// 			};

	// 		}
	// 		// 統一叫service 做加密 
	// 		this._checkSecurityService.doSecurityNextStep(e).then(
	// 			(S) => {
	// 				this._logger.log(S);
	// 				// 把S做為output傳回; 
	// 				// this.backPageEmit.emit({
	// 				//     type: 'goResult',
	// 				//     value: true,
	// 				//     securityResult: S
	// 				// });
	// 				this.safeE = {
	// 					securityResult: S
	// 				};
	// 				// this.nowPage = 'page2'; ////

	// 			}, (F) => {
	// 				this._logger.log(F);
	// 				this.backPageEmit.emit({
	// 					type: 'goResult',
	// 					value: false,
	// 					securityResult: F
	// 				});
	// 			}
	// 		);
	// 	} else {
	// 		return false;
	// 	}
	// }
	//---------------------------------------------//
}