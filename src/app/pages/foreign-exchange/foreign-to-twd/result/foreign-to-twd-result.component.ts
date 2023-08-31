/**
 * 外匯業務外幣轉台幣
 */
import { Component, OnInit, transition, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ForeignToTwdService } from '@pages/foreign-exchange/shared/service/foreign-to-twd.service';
import { FormateService } from '@shared/formate/formate.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Component({
    selector: 'app-foreign-to-twd-result',
    templateUrl: './foreign-to-twd-result-page.component.html',
    providers: [ForeignToTwdService,SocialsharingPluginService]
})



export class ForeignToTwdResultComponent implements OnInit {
    /**
     *參數設定
     */

    @Input() formObj;//取得表單物件
    @Input() securityResult;//取得表單物件
    info_data: object;//取得電文資料
    resultCode: string;
    isReservation: boolean;

    constructor(
        private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private _formateService: FormateService
        , private socialShare: SocialsharingPluginService
    ) {
    }

    ngOnInit() {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'menu'
        });
        if (this.formObj.hasOwnProperty('isReservation') && this.formObj['isReservation'] === false) {
            this.isReservation = false;
        } else {
            this.isReservation = true;
        }
    }
    socialSharing() {
        let trnsDateTime_current = this._formateService.transDate(this.formObj.trnsDateTime, 'yyyy/MM/dd');
        let trnsfrDate = this._formateService.transDate(this.formObj.trnsfrDate, 'yyyy/MM/dd')     //日期
        // Hi, 我已經把HKD 2000元換成TWD 3000元囉!
        // Hi, 我已經預約11/11把台幣 1000元換成HKD囉!到時請看看有沒有收到喔!

        let show_msg = [];
        if (!this.formObj.isReservation) {    //即時
            let trnsfrInAmount = AmountUtil.amount(this.formObj.trnsfrInAmount, 'TWD');   //金額
            show_msg.push('Hi, 我已於'+trnsDateTime_current);
            show_msg.push('把'+this.formObj.trnsfrOutCurr + ' ' + this.formObj.trnsfrOutAmount);
            show_msg.push('元換成台幣 '+ trnsfrInAmount + '元囉!');
        } else { //預約
            let trnsfrAmount=AmountUtil.amount(this.formObj.trnsfrAmount);
            show_msg.push('Hi, 我已經預約');
            show_msg.push(trnsfrDate);
            show_msg.push('把'+this.formObj.trnsfrOutCurr+' '+trnsfrAmount);
            show_msg.push('元換成台幣囉!到時請看看有沒有收到喔!');
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
