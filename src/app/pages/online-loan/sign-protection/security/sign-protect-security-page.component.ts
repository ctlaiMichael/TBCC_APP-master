/**
 * 線上簽約對保-安控頁
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
import { AuthService } from '@core/auth/auth.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';

@Component({
	selector: 'app-sign-protect-security',
	templateUrl: './sign-protect-security-page.component.html',
	styleUrls: [],
	providers: [SignProtectService]
})

export class SignProtectSecurityPageComponent implements OnInit {

	@Input() fullData: any;
	@Input() custInfo: any;
	@Input() todayDate: any;
	@Input() signDate: any;
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();



	reqData = {
		custId: '',
		ebkcaseno:'',
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

	// 安控機制
	securityObj = {
		'action': 'init',
		'sendInfo': {}
	};

	// request
	userAddress = {
		'USER_SAFE': '',
		'SEND_INFO': ''
	};




	safeE = {};

	// 加入安控機制
	transactionObj = {
		serviceId: 'F9000502', //*電文規格出來要改
		categoryId: '6',
		transAccountType: '2',  // 回傳1 (約轉)。 2 為(非約轉)。
	};

	constructor(
		private _logger: Logger,
		private navgator: NavgatorService,
		private confirm: ConfirmService,
		private _headerCtrl: HeaderCtrlService,
		private _handleError: HandleErrorService,
		private authService: AuthService,
		private _checkSecurityService: CheckSecurityService
	) { }

	ngOnInit() {
		this._logger.error("into securityPage");
		this._headerCtrl.setLeftBtnClick(() => {
			// this.backPageEmit.emit({
			// 	page: 'sign-search',
			// 	type: 'go-sign',
			// 	data: this.fullData,
			// 	custInfo: this.custInfo
			// });

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

	// 前往契約頁
	onContract() {
		// this._logger.error('安控機制');
		// // 檢查撥款日期
		// this.backPageEmit.emit({
		// 	page: 'sign-result',
		// 	type: 'go-contract',
		// 	data: this.fullData,
		// 	custInfo: this.custInfo,
		// 	signDate: this.signDate,
		// 	date: this.reqData['aprprdbgn']
		// });
	}




	//-----------20191111 安控暫時關閉--------//

	securityInit() {
		// 安控變數初始化
		// this.securityObj = {
		// 	'action': 'init',
		// 	'sendInfo': this.userAddress.SEND_INFO
		// };

	}


	// 安控函式
	securityOptionBak(e) {
		// this._logger.log('securityOptionBak: ', e);
		// if (e.status) {
		// 	// 取得需要資料傳遞至下一頁子層變數
		// 	this.userAddress.SEND_INFO = e.sendInfo;
		// 	this.userAddress.USER_SAFE = e.sendInfo.selected;
		// 	this.securityObj = {
		// 		'action': 'init',
		// 		'sendInfo': e.sendInfo
		// 	};
		// } else {
		// 	// do errorHandle 錯誤處理 推業或POPUP
		// 	e['type'] = 'message';
		// 	this._handleError.handleError(e.ERROR);
		// }
	}

	// 安控機制
	stepBack(e) {
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
	// 				'ebkcaseno':this.reqData.ebkcaseno,
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
	}
	//---------------------------------------------//
}