import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { logger } from '@shared/util/log-util';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';
import { FormateService } from '@shared/formate/formate.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { EPayCardService } from '@pages/epay-card/shared/epay-card.service';

@Component({
    selector: 'app-qrcode-pay-result-card',
    templateUrl: './qrcode-pay-result-card.component.html',
    styleUrls: ['./qrcode-pay-result-card.component.css'],
	providers: [SocialsharingPluginService]
})
export class QrcodePayResultCardComponent implements OnInit {

    resultAll: any;
    result: any;
    mean: any;
    detail: any;
    qrcodeObj: any;
    showAcnt = '';
    constructor(
        private navgator: NavgatorService,
        private _headerCtrl: HeaderCtrlService,
        private socialShare: SocialsharingPluginService,
        private _formateService: FormateService,
        private epayService: EPayCardService
    ) { }

    ngOnInit() {
        this._init();
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('epay-card');
        });
    }

    _init() {
        logger.error('result');
        this.resultAll = this.navgator.getParams();
        this.result = this.resultAll.result.body;
        this.qrcodeObj = this.resultAll.qrcode;
        this.mean = this.resultAll.means;
        this.detail = this.resultAll.detail;
        let check_amt = this._formateService.checkField(this.result, 'trnsAmount');
        if (this.resultAll.webToAppRes) {
          this.epayService.webToAppRes(this.resultAll.webToAppRes);
        }

        if (this.detail == 'qrcodePayBeScanResult') {
            this._headerCtrl.updateOption({
                'title': '消費扣款-出示付款碼'
            });

            this.showAcnt = this._formateService.checkField(this.result, 'trnsfrNo');
            if (!this.showAcnt || typeof this.showAcnt == 'object') {
                this.showAcnt = this.result.defaultTrnsOutAcct;
            }
        } else if (this.detail == 'qrcodePayTaxResult') {
            // 如果是繳稅不除100
            if(check_amt == '') {
                this.result.trnsAmount = '--';
            }
        } else {
            // trnsAmount: 使用於繳稅、消費扣款、被掃，會被影響
            if (check_amt != '') {
                this.result.trnsAmount = this.result.trnsAmount / 100;
            } else {
                this.result.trnsAmount = '--';
            }
        }

        if (this.detail == 'qrcodePayBeScanResult') {
            this.result.trnsfrNo = this._formateService.transAccount(this.result.trnsfrNo, 'mask');
        }
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back'
        });
        logger.error('this.result', this.resultAll, this.result);
        logger.error('detail', this.detail);
        logger.error('result.authCode', this.result.authCode);
        logger.error('result', this.result);

    }

    clickBtn() {
        this.navgator.push('epay-card');
    }

    getred2() {
        let trnsfrOutAcct = AccountMaskUtil.socailSharingAccntFormat(this.result.trnsfrOutAcct);   // 轉出帳號
        let trnsfrAmount = AmountUtil.amount(this.result.trnsfrAmount, 'TWD');
        let params = {
            result: 'Ｈi,新春發大財，我用合庫APP送您紅包' + trnsfrAmount + '元(轉出帳號末五碼' + trnsfrOutAcct + ')祝您新的一年有～“鼠”不盡的財富！“鼠”不盡的幸福！'
        };
        this.navgator.push('cardlogin-qrcodeRed', params);

    }
    // 訊息分享 (P2P轉帳限定功能)
    socialSharing() {
		let trnsfrOutAcct = AccountMaskUtil.socailSharingAccntFormat(this.result.trnsfrOutAcct);   // 轉出帳號
		let trnsfrAmount = AmountUtil.amount(this.result.trnsfrAmount,'TWD');                        // 轉帳金額
		let trnsfrDate = this.result.trnsDateTime;
        // Hi, 我已於YYYY/MM/DD轉帳新台幣＄1元給你了(合作金庫銀行,轉出帳號末五碼XXXXX),請看看有沒有收到喔！
		let show_msg = [];
			show_msg.push('Hi, 我已於'+this._formateService.transDate(trnsfrDate, 'yyyy/MM/dd'));
			show_msg.push('轉帳新台幣$'+trnsfrAmount);
			show_msg.push('元給你了(合作金庫銀行,轉出帳號末五碼' + trnsfrOutAcct + '), 請看看有沒有收到喔!');

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
    epayScanBtn(){
        this.navgator.push('cardlogin-epayscan');
    }
}
