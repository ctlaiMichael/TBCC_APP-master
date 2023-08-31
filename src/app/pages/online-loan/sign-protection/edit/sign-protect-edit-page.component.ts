/**
 * 線上簽約對保-編輯頁
 * 期間及利率(需發電文未完成，且位置在按鈕下方)
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';


@Component({
	selector: 'app-sign-protect-edit',
	templateUrl: './sign-protect-edit-page.component.html',
	styleUrls: [],
	providers: []
})

export class SignProtectEditPageComponent implements OnInit {

	@Input() fullData: any;  // f9000501
	@Input() custInfo: any;  // f9000401
	@Input() otherInfo: any;  // f9000504
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();


	editPageFlag = 'EditOne';   // stepBar.按鈕切換
	txKind = '';                // 申請種類

	// 申請種類
	applyType = {
		A: '房貸增貸',
		B: '信用貸款',
		C: '信用卡(未用)',
		D: '房屋貸款'
	};
	// 限制清償期間
	aprlimit = {
		1: '無限制清償期間',
		2: '限制清償期間'
	}

	// 攤還方式
	aprrefund_yymm2 = {
		1: '按月本息平均攤還',
		2: '按月繳息,自某期間起按月本息平均攤還',
		9: '其他'
	};
	otherInfoData: any;
	// 案件狀態註記
	// caseStatus = {
	// 	 '01':'申請書填寫完成，待分行取案',
	// 	 '02':'文件上傳完成，待分行取案',
	// 	 '03':'分行案件受理中',
	// 	 '04':'分行案件徵審中',
	// 	 '05':'待客戶回覆核准情形及選擇對保方式',
	// 	 '06':'親赴分行對保中',
	// 	 '07':'填寫約據完成，待分行撥款',
	// 	 '98':'核准不撥款，結案歸檔',
	// 	 '99':'撥款完成，結案歸檔',
	// 	 'B1':'客戶提出撤案',
	// 	 'B2':'婉拒',
	// 	 'B3':'客戶不同意核准情形，結案歸檔',
	// 	 'B4':'超過預定申請時程，請重新申請(未使用)',
	// 	 'B5':'超過預定對保時程，請重新申請(未使用)',
	// 	};
	aprintTy = ['定儲指數利率', '基準利率', '央行重點現率', '定儲指數月指標利率', '月基準利率', '郵儲一年期定儲', '郵儲二年期定儲', '其他']; //指標利率別(簽約對保只有 4,7之情況)，4:定儲指數月指標利率，7:郵儲二年期定儲


	constructor(
		private _logger: Logger,
		private _headerCtrl: HeaderCtrlService,
		private navgator: NavgatorService,
		private alert: AlertService,
		private confirm: ConfirmService,
		private _uiContentService: UiContentService,
		private _formateService: FormateService,
		private _handleError: HandleErrorService
	) { }

	ngOnInit() {
		this._logger.log("page edit ,otherInfo:", this.otherInfo);
		this.otherInfoData = this.otherInfo['data'];
		this._logger.log("page edit, otherInfoData:", this.otherInfoData);
		this.otherInfoData.forEach(item => {
			switch (item.aprintTy) {
				case '1':
					item['aprintTyName'] = '定儲指數利率';
					break;
				case '2':
					item['aprintTyName'] = '基準利率';
					break;
				case '3':
					item['aprintTyName'] = '央行重點現率';
					break;
				case '4':
					item['aprintTyName'] = '定儲指數月指標利率';
					break;
				case '5':
					item['aprintTyName'] = '月基準利率';
					break;
				case '6':
					item['aprintTyName'] = '郵儲一年期定儲';
					break;
				case '7':
					item['aprintTyName'] = '郵儲二年期定儲';
					break;
				case '9':
					item['aprintTyName'] = '其他';
					break;
				default:
					item['aprintTyName'] = '定儲指數月指標利率';
					break;
			}
		});

		this._logger.error("into editPage1!");
		this.txKind = this.applyType[this.fullData.txKind];
		this._logger.error('this.aprlimit:', this.aprlimit);

		// 利率
		this.custInfo['trnsToken'] = this._formateService.checkField(this.otherInfo['info_data'], 'trnsToken');
		this.fullData['aprlimit'] = this._formateService.checkField(this.otherInfo['info_data'], 'aprlimit');
		this.fullData['aprfee'] = this._formateService.checkField(this.otherInfo['info_data'], 'aprfee');
		this.fullData['aprJcIcFee'] = this._formateService.checkField(this.otherInfo['info_data'], 'aprJcIcFee');
		this.fullData['apraprde'] = this._formateService.checkField(this.otherInfo['info_data'], 'apraprde');
		this.fullData['apramt'] = this._formateService.checkField(this.otherInfo['info_data'], 'apramt');

		if (typeof this.otherInfo['info_data'].aprlimit == 'object') {
			this.fullData['aprlimit'] = '--';
		} else {
			this.fullData['aprlimit'] = this.aprlimit[this.otherInfo['info_data'].aprlimit];
		}

		if (typeof this.otherInfo['info_data'].aprrefundWay == 'object') {
			this.fullData['aprrefundWay'] = '--';
		} else {
			if (this.otherInfo['info_data'].aprrefundWay != '9') {
				this.fullData['aprrefundWay'] = this.aprrefund_yymm2[this.otherInfo['info_data'].aprrefundWay];
			} else {
				this.fullData['aprrefundWay'] = this._formateService.checkField(this.otherInfo['info_data'], 'aprrefundWayot');
			}

		}
		this._headerCtrl.setLeftBtnClick(() => {
			if (this.editPageFlag == 'EditOne') {
				this.backPageEmit.emit({
					page: 'sign-edit',
					type: 'back'
				});
			} else if (this.editPageFlag == 'EditTwo') {
				this.editPageFlag = 'EditOne';
			}
		});
	}

	// 不同意，返回列表頁
	onDisagree() {
		this.confirm.show('若您按下不同意，流程無法繼續進行，請與受理分行授信經辦聯絡，謝謝您。請確定是否不同意?', {
			title: '提醒您',
			btnYesTitle: '確定',
			btnNoTitle: '取消'
		}).then(
			() => {
				let output = {
					'page': 'sign-disagree',
					'type': 'go-disagree',
					'data': this.fullData,
					'custInfo': this.custInfo
				};
				this.backPageEmit.emit(output);
			},
			() => {
			}
		);
	}

	// 同意，前往選擇對保方式
	onAgree() {
		if (this.fullData.account == null || typeof this.fullData.account == 'undefined' ||
			this.fullData.account == '') {
				this._logger.log("into has not account");
				let errorObj = {
					type:'message',
					content:'沒有您要查詢的資料',
					title:'訊息',
					button:'PG_ONLINE.BTN.BACKLOAN',
					backType: 'online-loan'
				};
			this._handleError.handleError(errorObj);
		} else {
			this._logger.log("into has account");
			this.alert.show('您已按下同意，即將進入下一步驟。', {
				title: '提醒您',
				btnTitle: '了解',
			}).then(
				() => {
					this.editPageFlag = 'EditTwo';
					this._uiContentService.scrollTop();
				}
			);
		}
	}


	// 線上對保 前往選擇日期頁
	onSign() {
		let output = {
			'page': 'sign-date',
			'type': 'go-date',
			'data': this.fullData,
			'custInfo': this.custInfo
		};
		this.alert.show('您已按下線上對保，即將進入下一步驟。', {
			title: '提醒您',
			btnTitle: '了解',
		}).then(
			() => {
				this.backPageEmit.emit(output);
			}
		);
	}

	// 親赴分行
	onBranch() {
		this.confirm.show('若您按下親赴分行，分行將與您聯絡，或請您與分行聯絡對保時間，並請備妥雙證件及印章至分行辦理簽約對保。', {
			title: '提醒您',
			btnYesTitle: '確定',
			btnNoTitle: '取消'
		}).then(
			() => {
				let output = {
					'page': 'sign-goto',
					'type': 'go-goto',
					'data': this.fullData,
					'custInfo': this.custInfo
				};
				this.backPageEmit.emit(output);
			},
			() => {

			}
		);
	}

	/**
	 * 重新設定page data
	 * @param item
	 */
	onBackPageData(item?, setype?) {
		const output = {
			'page': 'list-item',
			'type': 'page_info',
			'data': item
		};
		this._logger.log("item:", item);
		// 點擊簽約對保按鈕(返回父)
		if (setype == 'goEdit') {
			this._logger.log("into go edit");
			output.page = 'sign-confirm';
			output.type = 'go-edit';
		}
		this.backPageEmit.emit(output);
	}

	/**
	* 失敗回傳
	* @param error_obj 失敗物件
	*/
	onErrorBackEvent(error_obj) {
		const output = {
			'page': 'list-item',
			'type': 'error',
			'data': error_obj
		};
		this.errorPageEmit.emit(output);
	}
}