/**
 * 台幣轉外幣
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { PersonalQuotaService } from '@pages/foreign-exchange/shared/service/personal-quota.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
	selector: 'app-personal-quota',
	templateUrl: './personal-quota-page.component.html',
	styleUrls: [],
	providers: []
})
export class PersonalQuotaComponent implements OnInit {
	showPage = 'page';
	exchangeType = '0';
	exchangeClass = 'inner_table_frame';
	exchangeErrorMsg = '';
	// 查詢時間預設物件
	overDateObj: any;
	today: any;
	transDateS: any;
  transDateE: any;
  Type: any;

	// endDay = {
	// 	date: '',
	// 	min: '',
	// 	max: '',
	// 	endClass: 'inner_table_frame',
	// 	endErrorMsg: ''
	// }
	// starDay = {
	// 	date: '',
	// 	min: '',
	// 	max: '',
	// 	starClass: 'inner_table_frame',
	// 	starErrorMsg: ''
	// };
	defaultClass = 'inner_table_frame';
	errorClass = 'inner_table_frame active_warnning';

	dataTime: any; // 查詢時間
	date_set_obj = {
		baseDate: 'today', // 基礎日
		rangeType: 'D', // "查詢範圍類型" M OR D
		rangeNum: '7', // 查詢範圍限制
	};

	transactionObj = {
		serviceId: 'F5000107',  // F5000107 外幣預約轉帳取消
		categoryId: '4',
		transAccountType: '1',  // 預設回傳1 (約轉)。 2 為(非約轉)。
	};
	statusConvert = {
		'0': '未處理',
		'F': '轉帳失敗',
		'S': '轉帳成功'
	};
	formObj = {}; // 取得表單資料並送到下一頁
	// 確認頁資料
	sendData = {
		sendInfo: {},
		selectItem: {}
	};
	// 結果頁資料
	resultData: any;

	constructor(
		private _logger: Logger
		, private router: Router
		, private _headerCtrl: HeaderCtrlService
		, private confirm: ConfirmService
		, private navgator: NavgatorService
		, private formateService: FormateService
		, private checkService: CheckService
		, private personalQuotaService: PersonalQuotaService
		, private handleError: HandleErrorService
		, private alertService: AlertService
	) {
		// this._logger.step('Financial', 'hi');
	}

	ngOnInit() {
		this.today = new Date(Date.now());
		this.today = this.formateService.transDate(this.today, 'date');
		this.transDateS = this.today;
		this.transDateE = this.today;
		//debugger;
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});

	}

	/**
	 * go
	 *
	 */

	changeType(e) {
		this.exchangeType = e.target.value;
	}

	dateChange(str) {
		let resultFlag = true;
		// debugger;
		let d1 = new Date(this.transDateE);
		let d2 = new Date(this.transDateS);
		let d3 = new Date(this.transDateS);
    d3.setDate(d3.getDate() + 7);
    if (d1 < d2) {
      resultFlag = false;
			this.alertService.show('迄日需大於起始日');
		} else if (d3 < d1) {
      resultFlag = false;
			this.alertService.show('限查詢7日內資料');
		} else {resultFlag = true; }
		return resultFlag;
	}

	// --------------------------------------------------------------------------------------------
	//  ____       _            _         _____                 _
	//  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
	//  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
	//  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
	//  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
	// --------------------------------------------------------------------------------------------
	cancelEdit() {
		this.confirm.show('您是否放棄此次編輯?', {
			title: '提醒您'
		}).then(
			() => {
				// 確定
				this.navgator.push('foreign-exchange');
			},
			() => {

			}
		);
	}

	private oncheckEvent() {
		let subNextFlag = true;
    this.exchangeClass = this.defaultClass;
    
		if (this.exchangeType === '0') {
			this.exchangeClass = this.errorClass;
			this.exchangeErrorMsg = '請選擇交易類型';
			subNextFlag = false;
		}
		let dateCheck = this.dateChange('all');
		if (!dateCheck) {
			subNextFlag = false;
		}
		// 前往確認頁
		if (subNextFlag) {
			let req = {
				type: this.exchangeType,
				transDateS: this.transDateS,
				transDateE: this.transDateE
			};
			this.personalQuotaService.getData(req).then(
				(list_S) => {
					if (list_S.status) {
						// this.formObj = list_S.data;
						for ( let i = 0; i < list_S.data.length; i++) {
							// list_S.data[i].txAmt = list_S.data[i].txAmt.substr(1, 12).replace(/\b(0+)/gi, "");
							// list_S.data[i].txAmt = list_S.data[i].txAmt + '.00';
							if (list_S.data[i].txAmt == null) { list_S.data[i].txAmt = ''; }
							else {
								list_S.data[i].txAmt = list_S.data[i].txAmt.substr(1, 14).replace(/\b(0+)/gi, '');
								let len = list_S.data[i].txAmt.length;
								list_S.data[i].txAmt = list_S.data[i].txAmt.substr(0, len - 2) + '.' + list_S.data[i].txAmt.substr(len - 2, 2);
								
							}
						}
						for ( let i = 0; i < list_S.data.length; i++) {
							if (list_S.data[i].twdAmt == null || list_S.data[i].twdAmt == '') { list_S.data[i].twdAmt = ''; }
							else {list_S.data[i].twdAmt = list_S.data[i].twdAmt.substr(1, 12).replace(/\b(0+)/gi, '');
							// this.dataTime = list_S.requestTime;
							this.showPage = 'list'; }
					}
					this.showPage = 'list';
					this.formObj = list_S.data;
					
				}
				}, (list_F) => {
					// alert('list_F' + list_F);
					// error handle
					this.handleError.handleError(list_F);

				}
      );
      // debugger;
		}
	}

	private goConfirmPage(item) {
		this.sendData.selectItem = item;
		this.sendData.selectItem['trnsToken'] = this.formObj['trnsToken'];
		this.showPage = 'confirm';
	}

	private securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.sendData.sendInfo = e.sendInfo;
		} else {
			// do errorHandle 錯誤處理 推業或POPUP
			e['type'] = 'message';
			this.handleError.handleError(e.ERROR);
		}
	}


	backPageEmit(e) {
		if (e.hasOwnProperty('assignPage')) {
			if (e.assignPage === 'result') {
				this.resultData = e.data;
			}

			this._headerCtrl.setLeftBtnClick(() => {
				this.cancelEdit();
			});
			this.showPage = e.assignPage;
		}
	}
}
