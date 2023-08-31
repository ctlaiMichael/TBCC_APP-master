/**
 * 金融資訊選單
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';

@Component({
	selector: 'app-reservation-result',
	templateUrl: './reservation-result-page.component.html',
	styleUrls: [],
	providers: []
})
export class ReservationResultComponent implements OnInit {

	@Input() formObj;
	constructor(
		private _logger: Logger
		, private navgator: NavgatorService
		, private _headerCtrl: HeaderCtrlService
	) {
		// this._logger.step('Financial', 'hi');
	}

	ngOnInit() {
		this._headerCtrl.setLeftBtnClick(() => {
			this.backMenu();
		});
	}

	/**
	 * go
	 *
	 */

	backMenu() {
		this.navgator.push('foreign-exchange');
	}


	// --------------------------------------------------------------------------------------------
	//  ____       _            _         _____                 _
	//  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
	//  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
	//  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
	//  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
	// --------------------------------------------------------------------------------------------
	oncheckEvent() {

		// this.showPage = this.showPage ? false : true;
	}
}
