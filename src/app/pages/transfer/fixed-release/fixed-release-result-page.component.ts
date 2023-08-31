/**
 * 外幣綜活存轉綜定存
 */
import { Component, OnInit, transition, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FixedReleaseService } from '../shared/service/fixed-release.service';

@Component({
	selector: 'app-fixed-release-result',
	templateUrl: './fixed-release-result-page.component.html',
	styleUrls: [],
})



export class FixedReleaseResultComponent implements OnInit {
	/**
	 *參數設定
	 */
	@Input() resultObj; //取得交易結果電文
	constructor(
		private _logger: Logger
		, private mainService: FixedReleaseService
		, private _handleError: HandleErrorService
		, private _headerCtrl: HeaderCtrlService
		, private navgator: NavgatorService
	) {
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu',
			'title': '交易結果'
		});
	}
	goMenu() {
		this.navgator.push('transfer', {});
	}
	ngOnInit() {
	}
}
