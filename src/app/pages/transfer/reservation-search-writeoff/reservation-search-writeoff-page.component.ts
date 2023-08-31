/**
 * Header
 * 
 * F4000501-台幣活存預約轉帳查詢
 * F4000502-台幣預約轉帳註銷
 */
import { Component, OnInit } from '@angular/core';
import { ReservationSearchWriteoffService } from '@pages/transfer/shared/service/reservation-search-writeoff.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';


@Component({
	selector: 'app-reservation-search-writeoff-page',
	templateUrl: './reservation-search-writeoff-page.component.html',
	styleUrls: [],
	providers: [ReservationSearchWriteoffService]
})
export class ReservationSearchWriteoffPageComponent implements OnInit {

	info_data = {};           // F4000501 全部資料      
	reservationList = [];     // F4000501 預約轉帳列表

	// 查詢頁資料送往確認頁
	allReservationData = {
		orderDate: '',
		orderNo: '',
		trnsToken: '',
		trnsfrDate: '',
		trnsfrOutAccnt: '',
		trnsfrInBank: '',
		trnsfrInAccnt: '',
		trnsfrAmount: '',
		notePayer: '',
		notePayee: '',
		status: '',
		statusDesc: '',
		SEND_INFO: '',
		USER_SAFE: ''
	};

	// 確認頁資料送結果頁
	reservationResultData = {};

	// original: 編輯頁，confirm: 確認頁，result: 結果頁
	showPage = 'original';

	// 安控機制
	transactionObj = {
		serviceId: 'F4000502',
		categoryId: '1',
		transAccountType: '1',
	};


	constructor(
		private _mainService: ReservationSearchWriteoffService,
		private _handleError: HandleErrorService,
		private _headerCtrl: HeaderCtrlService,
		private navgator: NavgatorService,
		private confirm: ConfirmService) { }

	ngOnInit() {
		this.getData();
	}


	// 取得資料，電文F4000501
	getData(): Promise<any> {
		return this._mainService.getData().then(
			(result) => {
				this.info_data = result.info_data;
				this.reservationList = result.reservationList;
			},
			(errorObj) => {
				this._handleError.handleError({
					type: 'dialog',
					title: 'POPUP.NOTICE.TITLE',
					content: "ERROR.EMPTY"
				});
				this.navgator.push('transfer');
			}
		);

	}

	// 安控機制
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.allReservationData.SEND_INFO = e.sendInfo;
			this.allReservationData.USER_SAFE = e.sendInfo.selected;
		} else {
			e['type'] = 'message';
			this._handleError.handleError(e);
		}
	}

	// 確認頁返回編輯頁
	toEditPage(e) {
		if (e) {
			this._headerCtrl.setLeftBtnClick(() => {
				this.navgator.push('transfer');
			});
			this.showPage = 'original'
		}
	}

	// 前往確認頁
	goConfirmPage(data) {
		this.allReservationData = {
			orderDate: data.orderDate,
			orderNo: data.orderNo,
			trnsToken: this.info_data['trnsToken'],
			trnsfrDate: data.trnsfrDate,
			trnsfrOutAccnt: data.trnsfrOutAccnt,
			trnsfrInBank: data.trnsfrInBank,
			trnsfrInAccnt: data.trnsfrInAccnt,
			trnsfrAmount: data.trnsfrAmount,
			notePayer: data.notePayer,
			notePayee: data.notePayee,
			status: data.status,
			statusDesc: data.statusDesc,
			SEND_INFO: this.allReservationData.SEND_INFO,
			USER_SAFE: this.allReservationData.USER_SAFE
		};
		this.showPage = 'confirm';
	}


	/**
	 * 	送電文
	 * @param security 
	 */
	public finalCheckData(security) {
		this._mainService.sendData(this.allReservationData, security).then(
			(result) => {
				if (result.status) {
					this.showPage = 'result';
					this.reservationResultData = result.info_data;
				} else {
					result['type'] = 'message';
					this._handleError.handleError(result);
					this._headerCtrl.updateOption({
						'leftBtnIcon': 'menu'
					});
				}
			},
			(errorObj) => {
				errorObj['type'] = 'message';
				this._handleError.handleError(errorObj);
				this._headerCtrl.updateOption({
					'leftBtnIcon': 'menu'
				});
			})
	}

}
