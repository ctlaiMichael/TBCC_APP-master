/**
 * Header
 */
import { Component, OnInit, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
	selector: 'app-reservation-search-writeoff-result-page',
	templateUrl: './reservation-search-writeoff-result-page.component.html',
	styleUrls: [],
	providers: []
})

export class ReservationSearchWriteoffResultPageComponent implements OnInit {

	@Input() reservationResultData;    // F4000502 電文結果資料
	@Input() reservationRusultInfo;    // 結果頁資料呈現需由編輯頁傳來(因F4000502回傳資料不完整)

	constructor(
		private navgator: NavgatorService,
		private _headerCtrl: HeaderCtrlService) { }

	ngOnInit() {
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu',
			'title': '交易結果',
			'style': 'result'
		});
	}

	accountView() {
		this.navgator.push('home');
	}

}
