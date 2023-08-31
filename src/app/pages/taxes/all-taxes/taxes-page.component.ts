/**
 * Header
 * 
 * menuData 為可繳交稅款清單，供使用者選擇。
 * taxesData 將使用者所選稅款之資料存入
 * 
 */
import { Component, OnInit } from '@angular/core';
import { TaxesService } from '../shared/service/taxes.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ActivatedRoute } from '@angular/router';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { TaxesDetailPageComponent } from './taxes-detail-page.component';
import { FuelFeeService } from '../shared/service/fuel-fee.service';


@Component({
	selector: 'app-taxes-page',
	templateUrl: './taxes-page.component.html',
	styleUrls: [],
	providers: [TaxesService, FuelFeeService, TaxesDetailPageComponent]
})
export class TaxesPageComponent implements OnInit {

	/**
	 * 參數設定
	 */

	menuData = [];    // 可繳交稅款項目清單
	authType = [];    // 該使用者所有安控機制(繳交稅費款只提供OTP/憑證)
	allFeeData = [];  // 為了汽機車燃料費而宣告
	isInTime = true;  // 所選稅款是否在開徵起訖期間

	// 繳稅款頁面切換('first':可繳稅項目頁，'original':編輯頁)
	showPage = '';
	type_name = '';

	// 可繳稅項目頁資料送至編輯頁
	taxesData = {
		taxId: '',       // 可繳交稅款代號
		startDate: '',   // 開徵起日
		endDate: '',     // 開徵迄日
		taxType: '',     // 稅別
		taxName: ''      // 稅別名稱
	};

	constructor(
		private _mainService: TaxesService,
		private _handleError: HandleErrorService,
		private _headerCtrl: HeaderCtrlService,
		private route: ActivatedRoute,
		private _formateService: FormateService,
		private authService: AuthService,
		private alert: AlertService,
		private navgator: NavgatorService,
		private taxesDeatail: TaxesDetailPageComponent,
	) {
	}



	ngOnInit() {
		if (this.authService.getUserInfo().isTax != '1') {
			this.alert.show('TRANS_SECURITY.ERROR.201', {
				title: '提醒您'
			}).then(
				() => {
					//確定
					this.navgator.push('taxes-fees');
				}
			);
		} else {
			// 判斷該使用者是否有憑證或OTP。
			let OTPInfo = this.authService.checkAllowOtp();
			let CAInfo = this.authService.checkAllowOtpAndCA();
			if (OTPInfo == false && CAInfo == false) {
				this.alert.show('TRANS_SECURITY.ERROR.200', {
					title: '提醒您'
				}).then(
					() => {
						//確定
						this.navgator.push('taxes-fees');
					}
				);
			} else {
				this.getData();
			}
		}
	}

	getData(): Promise<any> {
		return this._mainService.getData().then(
			(result) => {
				this.menuData = result.data;
				this.menuData.forEach(element => {
					this.allFeeData[element.taxId] = element;
				})
				//取得帶過來的參數(url)
				this.route.queryParams.subscribe(params => {
					this.type_name = this._formateService.checkField(params, "type");
					if (this.type_name == 'fuel-fee') {
						// 判斷汽機車燃料使用費是否在開徵起迄日間
						this.isInTime = this.taxesDeatail.CheckDateIsOver(this.taxesData.startDate, this.taxesData.endDate);
						if (this.isInTime) {
							this.onGoEvent(this.allFeeData[16]);
						} else {
							this.navgator.push('taxes-fees');
							this.alert.show('PG_TAX.COMMON.OUTOFTIME', {
								title: '提醒您'
							});
						}
					} else {
						this.showPage = 'first';
					}
				});
			},
			(errorObj) => {
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
			}
		);
	}

	/**
	 * 在稅款列表，選取稅款後，將其資料帶往編輯頁
	 * @param taxsData 
	 */
	onGoEvent(taxsData: any) {
		this.taxesData = {
			taxId: taxsData.taxId,
			startDate: taxsData.startDate,
			endDate: taxsData.endDate,
			taxType: taxsData.taxType,
			taxName: taxsData.taxName
		}
		if ('16' == taxsData.taxId) {
			// 進入特規，汽機車燃料使用費。
			this.isInTime = this.taxesDeatail.CheckDateIsOver(this.taxesData.startDate, this.taxesData.endDate);
			if (this.isInTime) {
				this.taxesDeatail.getFuelFeeData(this.taxesData);
				this.showPage = 'original';
			} else {
				this.showPage = 'first';
				this.alert.show('PG_TAX.COMMON.OUTOFTIME', {
					title: '提醒您'
				});
			}
		} else {
			this.isInTime = this.taxesDeatail.CheckDateIsOver(this.taxesData.startDate, this.taxesData.endDate);
			if (this.isInTime) {
				this.showPage = 'original';
			} else {
				this.showPage = 'first';
				this.alert.show('PG_TAX.COMMON.OUTOFTIME', {
					title: '提醒您'
				});
			}

		}
	}


	/**
	 * 編輯頁返回列表頁
	 * @param e 
	 */
	toFirstPage(e) {
		if (e) {
			this._headerCtrl.updateOption({
				'title': 'FUNC_SUB.TAX.TAX'
			});
			this.showPage = 'first'
		}
	}
}
