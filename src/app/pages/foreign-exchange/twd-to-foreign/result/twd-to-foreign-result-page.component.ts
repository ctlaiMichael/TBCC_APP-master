/**
 * 外匯業務外幣轉台幣
 */
import { Component, OnInit, transition, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FormateService } from '@shared/formate/formate.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Component({
	selector: 'app-twd-to-foreign-result',
	templateUrl: './twd-to-foreign-result-page.component.html',
	providers: [ SocialsharingPluginService]
})



export class TwdToForeigResultComponent implements OnInit {
	/**
	 *參數設定
	 */

	@Input() formObj;//取得表單物件
	@Input() securityResult;//安控機制
	info_data: object;//取得電文資料
	isReservation: boolean;

	constructor(
		private _headerCtrl: HeaderCtrlService
		, private navgator: NavgatorService
		, private _formateService: FormateService
		, private socialShare: SocialsharingPluginService) { }

	ngOnInit() {
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu'
		});
		if (this.formObj.hasOwnProperty('isReservation') && this.formObj['isReservation'] === false) {
			this.isReservation = false;
		} else {
			this.isReservation = true;
		}

		// if (this.securityResult.ERROR.status == true) {
		//     this._mainService.getResult(this.formObj, this.securityResult).then(
		//         (resObj) => {
		//             this.navgator.pageInitEnd(); // 取得資料後顯示頁面
		//             this.info_data = resObj.info_data;
		//         },
		//         (errorObj) => {
		//             this.navgator.pageInitEnd(); // 取得資料後顯示頁面
		//             errorObj['type'] = 'message';
		//             this._handleError.handleError(errorObj);
		//         });
		// } else {
		//     this.navgator.pageInitEnd(); // 取得資料後顯示頁面
		//     let errorObj;
		//     errorObj['type'] = 'message';
		//     this._handleError.handleError(errorObj);
		// }
	}
	socialSharing() {
        let trnsDateTime_current = this._formateService.transDate(this.formObj.trnsDateTime,'yyyy/MM/dd');
		let trnsfrDate = this._formateService.transDate(this.formObj.trnsfrDate, 'yyyy/MM/dd') //日期
		// Hi, 我已經把HKD 2000元換成TWD 3000元囉!
		// Hi, 我已經預約11/11把台幣 1000元換成HKD囉!到時請看看有沒有收到喔!

		let show_msg = [];
		if (!this.formObj.isReservation) {    //即時
			let trnsfrOutAmount = AmountUtil.amount(this.formObj.trnsfrOutAmount, 'TWD');   //金額
			show_msg.push('Hi, 我已於'+trnsDateTime_current);
			show_msg.push('把台幣 '+ trnsfrOutAmount);
			show_msg.push('元換成' + this.formObj.trnsfrInCurr + ' ' + this.formObj.trnsfrInAmount + '元囉!');
		} else { //預約
			let trnsfrAmount = AmountUtil.amount(this.formObj.trnsfrAmount, 'TWD');   //金額(預約)
			show_msg.push('Hi, 我已經預約');
			show_msg.push(trnsfrDate);
			show_msg.push('把台幣 ');
			show_msg.push(trnsfrAmount);
			show_msg.push('元換成' + this.formObj.trnsfrInCurr + '囉!到時請看看有沒有收到喔!');
		}

		this.socialShare.shareMsg({
			subject: '',
			message: show_msg.join('')
		}).then(
			(success) => {
				// success
			},
			(error) => {
				// error
			}
		);

	}
	backMenu() {
		this.navgator.push('foreign-exchange');
	}
}
