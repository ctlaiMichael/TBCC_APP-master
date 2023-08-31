/**
 * 外幣綜活存轉綜定存
 */
import { Component, OnInit, transition, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ForeignToForeignService } from '@pages/foreign-exchange/shared/service/foreign-to-foreign.service';
import { FormateService } from '@shared/formate/formate.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';

@Component({
    selector: 'app-foreign-to-foreign-result',
    templateUrl: './foreign-to-foreign-result.component.html',
    providers: [ForeignToForeignService,SocialsharingPluginService]
})



export class ForeignToForeignResultComponent implements OnInit {
    /**
     *參數設定
     */

    @Input() formObj;//取得表單物件
    @Input() securityResult;//取得表單物件
    info_data:object;//取得電文資料
    resultCode:string;
    isReservation: boolean=false;

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
    }
    socialSharing() {
        //Hi, 我已經把HKD 2000元換成TWD 3000元囉!
        let show_msg = [];
        let trnsDateTime = this._formateService.transDate(this.formObj.trnsDateTime,'yyyy/MM/dd');
        if (!this.formObj.isReservation) {    //即時
            show_msg.push('Hi, 我已於'+ trnsDateTime);
            show_msg.push('把'+this.formObj.trnsfrOutCurr + ' ' + this.formObj.trnsfrOutAmount);
            show_msg.push('元換成'+ this.formObj.trnsfrInCurr +' ' +this.formObj.trnsfrInAmount +'元囉!');
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
    backMenu(){
        this.navgator.push('foreign-exchange');
    }
}
