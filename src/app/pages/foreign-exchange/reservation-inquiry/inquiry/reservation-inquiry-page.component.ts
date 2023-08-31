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
import { ReservationInquiryService } from '@pages/foreign-exchange/shared/service/reservation-inquiry.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
	selector: 'app-reservation-inquiry',
	templateUrl: './reservation-inquiry-page.component.html',
	styleUrls: [],
	providers: []
})
export class ReservationInquiryComponent implements OnInit {
	showPage = 'page';
	exchangeType = '0';
	exchangeClass = 'inner_table_frame';
	exchangeErrorMsg = '';
	// 查詢時間預設物件
	overDateObj: any;
	tomorrow: any;
	endDay = {
		date: '',
		min: '',
		max: '',
		endClass: 'inner_table_frame',
		endErrorMsg: ''
	}
	starDay = {
		date: '',
		min: '',
		max: '',
		starClass: 'inner_table_frame',
		starErrorMsg: ''
	};
	defaultClass = 'inner_table_frame';
	errorClass = 'inner_table_frame active_warnning';

	dataTime: any; // 查詢時間
	date_set_obj = {
		baseDate: 'today', // 基礎日
		rangeType: 'M', // "查詢範圍類型" M OR D
		rangeNum: '6', // 查詢範圍限制
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
	formObj = {}; //取得表單資料並送到下一頁
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
		, private reservationInquiryService: ReservationInquiryService
		, private handleError: HandleErrorService
	) {
		// this._logger.step('Financial', 'hi');
	}

	ngOnInit() {
		// 設定時間限制
		this.tomorrow = new Date(Date.now() + 86400000);
		this.tomorrow = this.formateService.transDate(this.tomorrow, 'dateInpt');
		this.endDay.date = this.tomorrow;
		this.endDay.min = this.tomorrow;
		this.starDay.date = this.tomorrow;
		this.starDay.min = this.tomorrow;
		this.date_set_obj.baseDate = this.tomorrow;
		this.overDateObj = this.checkService.getDateSet(this.date_set_obj, 'future');
		this.starDay.max = this.formateService.transDate(this.overDateObj.maxDate, 'dateInpt');
		this.endDay.max = this.starDay.max;

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
		let betweenFlag = true;
		let resultFlag = true;
		this.starDay.starClass = this.defaultClass;
		this.endDay.endClass = this.defaultClass;
		if (this.endDay.date != '' && this.starDay.date != '') {
			if (DateUtil.compareDate(this.starDay.date, this.endDay.date) === -1) {
				betweenFlag = false;
			}
		}
		if (str === 's' || str === 'all') {
			if (!this.dateOverCheck(this.starDay)) {
				// 起日為明日起至未來六個月內
				this.starDay.starClass = this.errorClass;
				this.starDay.starErrorMsg = '起日為明日起至未來六個月內';
				resultFlag = false;
			} else if (!betweenFlag) {
				this.starDay.starClass = this.errorClass;
				this.starDay.starErrorMsg = '起始日不可超過迄日';
				resultFlag = false;
			}
		} else if (str === 'e' || str === 'all') {
			if (!this.dateOverCheck(this.endDay)) {
				// 迄日為明日起至未來六個月內
				this.endDay.endClass = this.errorClass;
				this.endDay.endErrorMsg = '迄日為明日起至未來六個月內';
				resultFlag = false;
			} else if (!betweenFlag) {
				this.endDay.endClass = this.errorClass;
				this.endDay.endErrorMsg = '迄日需大於起始日';
				resultFlag = false;
			}
		}
		return resultFlag;
	}

	dateOverCheck(selectStarDayObj) {
		let overFlag = true;
		if (DateUtil.compareDate(selectStarDayObj.date, selectStarDayObj.max) === -1) {
			// 訖超過過6個月
			overFlag = false;
		} else if (
			// 選擇日期小於隔日
			DateUtil.compareDate(selectStarDayObj.date, selectStarDayObj.min) === 1) {
			overFlag = false;
		}
		return overFlag;
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
				exchangeType: this.exchangeType,
				startDate: this.starDay.date,
				endDate: this.endDay.date,
				trnsfrOutAccnt: ''
			};
			this.reservationInquiryService.getData(req).then(
				(list_S) => {
					if (list_S.status) {
						this.formObj = list_S.data;
						this.formObj['trnsToken'] = list_S.info_data.trnsToken;
						this.dataTime = list_S.requestTime;
						this.showPage = 'list';
					}
				}, (list_F) => {
					// error handle
					this.handleError.handleError(list_F);

				}
			);
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
