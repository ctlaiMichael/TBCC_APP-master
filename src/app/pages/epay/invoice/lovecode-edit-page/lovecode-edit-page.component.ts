import { Component, OnInit } from '@angular/core';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { InvoiceService } from '@pages/epay/shared/service/invoice/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
    selector: 'app-lovecode-edit-page',
    templateUrl: './lovecode-edit-page.component.html'
})
export class LovecodeEditPageComponent implements OnInit {

    orgLoveCode: string = '';
    orgSocialWelfareName: string = '';
    ShowList: string = "N";
    mobileBarcode: string = "";
    defaultBarcode: string = "";
    keyword: string = ''; // 搜尋之關鍵字
    selectedLV: any = ''; // 選擇之捐贈碼
    queryLV: any = {}; // 搜尋結果
    default_charityName = {};
    loveCodeCount: number = -1; // 搜尋結果總筆數
    constructor(
        private epayService: InvoiceService,
        private alertService: AlertService,
        private navigator: NavgatorService,
        private _handleError: HandleErrorService,
        private route: ActivatedRoute,
        private _headerCtrl: HeaderCtrlService
    ) { }

    ngOnInit() {

        this._headerCtrl.setLeftBtnClick(() => {
            this.navigator.push('invoice', {}, {changeDefaultCode: '2'});
        });
        
        //變更愛心條碼時，取得由上一頁面傳來的捐款機構名稱

        this.route.queryParams.subscribe(params => {
            let orgLoveCodeFalg = false;
            if (params.hasOwnProperty('socialWelfareName') && params.hasOwnProperty('orgLoveCode')) {
                if (params.socialWelfareName == '' || params.orgLoveCode == '') {
                    this.orgLoveCode = '未設定捐贈碼';
                } else {
                    this.orgSocialWelfareName = params.socialWelfareName; // 接到傳參值(url)
                    this.orgLoveCode = params.orgLoveCode;
                    orgLoveCodeFalg = true;

                }
            }
            if (params.hasOwnProperty('mobileBarcode') && params.mobileBarcode != '') {
                this.mobileBarcode = params.mobileBarcode;
                this.defaultBarcode = '1';
            } else if (orgLoveCodeFalg) {
                this.defaultBarcode = '2';
            } else {
                this.defaultBarcode = '1';
            }
        });
      
    }

    // 隱藏查詢結果
    hideLvList() {
        this.ShowList = "N";
    }

    // 查詢
    clickSearch() {
        // 清空已選擇的捐贈碼
        this.selectedLV = "";

        // 檢核關鍵字
        if (typeof this.keyword !== 'string' || this.keyword.length <= 0) {
            this.alertService.show("請輸入關鍵字");
            return;
        } else {
            this.epayService.sendFQ000406(this.keyword).then(
                (resObj) => {
                    if (!!resObj) {
                        let newres = this.epayService.convertRes(resObj);
                        if (typeof newres == "string") {
                            this.alertService.show(newres);
                            return;
                        } else {
                            //開啟查詢清單
                            this.ShowList = "Y";

                            if (typeof newres.details == 'undefined' || newres.details == null) {
                                this.loveCodeCount = 0;
                            } else {
                                this.loveCodeCount = newres.details.length;
                            }

                            if (this.loveCodeCount > 0) {
                                this.queryLV = {};
                                this.queryLV = newres.details.map(function (inp) {
                                    var newinp = {};
                                    newinp['rowNum'] = String(inp.rowNum);
                                    newinp['SocialWelfareBAN'] = inp.SocialWelfareBAN;
                                    newinp['LoveCode'] = inp.LoveCode;
                                    newinp['SocialWelfareName'] = inp.SocialWelfareName;
                                    newinp['SocialWelfareAbbrev'] = inp.SocialWelfareAbbrev;
                                    newinp['lvClassType'] = inp.rowNum % 2 == 0 ? 'invest' : 'invest2'
                                    return newinp;
                                });
                            }
                        }
                    } else {
                        this.alertService.show("搜尋失敗");
                        return;
                    }
                },
                (errObj) => {
                    this._handleError.handleError(errObj);
                }
            )
        }
    }

    // 點選捐贈碼
    selectLV(LV) {
        this.selectedLV = LV;
    }

    // 確定
    clickSubmit() {
        if ((typeof this.selectedLV == 'undefined') || (this.selectedLV == '')) {
            this.alertService.show("請選擇捐贈碼喔！");
            return;
        }

        //關閉查詢清單
        this.ShowList = "N";

        //儲存捐贈碼到中台

        let reqObj = {
            'mobileBarcode': this.mobileBarcode,
            'loveCode': this.queryLV[this.selectedLV].LoveCode,
            'socialWelfareName': this.queryLV[this.selectedLV].SocialWelfareName,
            'defaultBarcode': this.defaultBarcode === "" ? "2" : this.defaultBarcode
        };
        this.selectedLV = ''; // 重置已選擇捐贈碼
        this.epayService.sendFQ000305(reqObj).then(
            (resObj) => {
                if (!!resObj && resObj['trnsRsltCode'] == '0') {
                    this.alertService.show('捐贈碼儲存成功');
                    // 返回帶參數告知哪裡回去
                    this.navigator.push('invoice', {}, {changeDefaultCode: '2'}); // 雲端發票首頁
                    return;
                } else {
                    this.alertService.show('捐贈碼儲存失敗');
                    return; // 停留原頁
                }
            },
            (errObj) => {
                this._handleError.handleError(errObj);
            }
        );
    }
}
