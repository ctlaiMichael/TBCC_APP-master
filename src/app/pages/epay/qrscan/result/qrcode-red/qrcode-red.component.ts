import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { logger } from '@shared/util/log-util';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';
import { FormateService } from '@shared/formate/formate.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Component({
    selector: 'app-qrcode-red',
    templateUrl: './qrcode-red.component.html',
    styleUrls: ['./qrcode-red.component.css'],
    providers: [SocialsharingPluginService]
})
export class QrcodeRedComponent implements OnInit {

    resultAll: any;
    result: any;
    mean: any;
    detail: any;
    qrcodeObj: any;
    pic = { options: '1' };
    write = '';
    constructor(
        private navgator: NavgatorService,
        private _headerCtrl: HeaderCtrlService,
        private socialShare: SocialsharingPluginService,
        private _formateService: FormateService
    ) { }

    ngOnInit() {
        this._init();
    }

    _init() {
        this.resultAll = this.navgator.getParams();
        this.write = this.resultAll.result;
        this._headerCtrl.updateOption({
            'title': '傳送祝福賀卡'
        });






    }

    clickBtn() {
        this.navgator.push('epay');
    }


    // 訊息分享 (P2P轉帳限定功能)
    socialSharing() {
        // let trnsfrOutAcct = AccountMaskUtil.socailSharingAccntFormat(this.result.trnsfrOutAcct);   // 轉出帳號
        let trnsfrOutAcct = '122';
        // let trnsfrAmount = AmountUtil.amount(this.result.trnsfrAmount, 'TWD');                        // 轉帳金額
        let trnsfrAmount = '123456789';
        // let trnsfrDate = this.result.trnsDateTime;
        let trnsfrDate = '1977/11/11';
        // Hi, 我已於YYYY/MM/DD轉帳新台幣＄1元給你了(合作金庫銀行,轉出帳號末五碼XXXXX),請看看有沒有收到喔！
        let show_msg = [];
            show_msg.push('Hi, 我已於' + this._formateService.transDate(trnsfrDate, 'yyyy/MM/dd'));
            show_msg.push('轉帳新台幣$' + trnsfrAmount);
            show_msg.push('元給你了(合作金庫銀行,轉出帳號末五碼' + trnsfrOutAcct + '), 請看看有沒有收到喔!');

        let imgpath = '';
        // this.socialShare.shareMsg({
        // 	subject: '',
        // 	message: show_msg.join('')
        // }).then(
        // 	(success) => {
        // 		// success
        // 	},
        // 	(error) => {
        // 		// error
        // 	}
        // );
        if (this.pic.options == '1') { imgpath = 'assets/images/505.jpg' ;
        }else if ( this.pic.options == '2') { imgpath = 'assets/images/506.jpg'; }
        
        this.socialShare.shareImg(
        {
            subject: '分享的標題(email)',
            // message: '分享的訊息',
            url: '分享的連結'
        }
        , imgpath
        , {
            content: this.write,
            font: '30px Arial',
            x: 30,
            y: 80,
            width: 0,
            height: 35
        }
    ).then(
        () => {
            // success
        },
        () => {
            // error
        }
    );
    }
}
