/**
 * 文件上傳-編輯頁2
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CameraPluginService } from '@lib/plugins/camera-plugin.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Base64FileUtil } from '@shared/util/formate/modify/base64-file-util';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { CardUploadService } from './card-upload.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-card-upload',
    templateUrl: './card-upload.component.html',
    styleUrls: ['./card-upload.component.css'],
    providers: [CameraPluginService, CardUploadService, CheckSecurityService]
})

export class CardUploadComponent implements OnInit {
    closeSecurity = false; //控制是否安控 true:關閉安控(p4)
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() basicData: any;
    @Input() custId: any;
    @Input() type: string; //判斷補件上傳:'1' or 申請流程上傳:'0'
    nowPage = 'page1';
    showCheckSecurity = false; // 送出
    defaultImg = '';
    showPicData = {
        pic1: '', //顯示
        pic1data: '', //送出
    };

    showPreview = false; // 是否預覽
    previewId = ''; // 選的項目
    previewPic: any; // 預覽圖
    previewPicData: any; // 預覽圖

    //證明文件上傳request fc001005
    picReqData: any = {
        custId: '',
        txNo: '', //案件編號
        finProofReqr: '', //是否需財力證明圖檔
        finProof1: '' //財力證明1
    };
    //控制稍後或立即 true:立即，false:稍後
    nowLateFlag: boolean;
    selectCount = 0; //決定上傳幾張圖
    loadStatus = ''; //上傳狀態：'0':稍後上傳，'1'：1~5張，'2':全部傳

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _uiContentService: UiContentService
        , private confirm: ConfirmService
        , private cameraService: CameraPluginService
        , private sanitizer: DomSanitizer
        , private alert: AlertService
    ) { }

    ngOnInit() {
        this._logger.error("into editPage2!");
        this._logger.log("basicData:", this.basicData);
        this._logger.log("custId:", this.custId);
        this.onChangePage('page1');
        this.defaultImg = 'assets/images/plus-picture.png';
        //一開始就處理，除了圖片以外的fc001005 request欄位
        this.picReqData['custId'] = this.custId;
        this.picReqData['txNo'] = this.basicData['txNo'];
        this._logger.log("picReqData:", this.picReqData);
        this.doScrollTop();
    }
    onBack1() {
        this.onBackPageData(this.picReqData, 'upload', 'back', this.loadStatus);
    }
    onNext1() {
        this.selectCount = this.selectPic(); //做req處理，以及圖片轉base64
        this._logger.log("selectCount:", this.selectCount);
        this.sendLoadType(this.selectCount);
    }
    //稍後上傳：不走fc001005上傳電文 **改為沒上傳
    onLate() {
        this.nowLateFlag = false; //稍後
        this.onBackPageData(this.picReqData, 'upload', 'go', this.loadStatus);
        // this.stepBack();
    }

    /**
     * 判斷那些欄位需要上傳(使用者選擇的)
     * 
     * pic1: 財力證明(正面) => req:finProofReqr
     */
    selectPic() {
        let count = 0;
        //如果選擇值等於預設圖片(+號圖)，代表該欄位不上傳
        //財力證明文件
        if (this.showPicData['pic1data'] == '') {
            this.picReqData['finProofReqr'] = '0'; //不需要
            this.picReqData['finProof1'] = '';
        } else {
            this.picReqData['finProofReqr'] = '1'; //需要
            //將上傳圖片轉為base64字串
            let idCopy1_64 = Base64FileUtil.toBase64(this.showPicData['pic1data']);
            this.picReqData['finProof1'] = idCopy1_64;
            count++;
        }
        return count;
    }

    //決定走哪種上傳流程
    sendLoadType(count) {
        //不上傳(沒有選圖)
        if (count <= 0) {
            //正常申請流程
            if (this.type == '0') {
                this._logger.log("into count:0");
                this.confirm.show('您目前無上傳任何證明文件，請確認仍暫不上傳嗎?', {
                    title: '提醒您',
                    btnYesTitle: '是，暫不上傳',
                    btnNoTitle: '否，回上傳頁'
                }).then(
                    (late) => {
                        this._logger.log("click, into late");
                        this.loadStatus = '0';
                        //req formate處理，ex:金額*10000
                        // this.reqData = this._allService.formateReqData(this.reqData);
                        this.onLate(); //稍後上傳
                    },
                    (back) => {
                        this._logger.log("click, into back");
                        return false; //回上傳文件
                    }
                );
                //補件上傳，必須選擇圖片，不可稍後上傳   
            } else {
                this.alert.show('請選擇上傳之圖檔', {
                    title: '提醒您',
                    btnTitle: '了解',
                }).then(
                    () => {
                        return false;
                    }
                );
            }
        }
        //有上傳圖，但沒有全部上傳，1~5 (*2020/05/25 目前只有上傳一種項目，若後續追加項目，需比照申貸開啟此判斷)
        //  else if (count > 0 && count < 6) {
        //     this.loadStatus = '1';
        //     this._logger.log("into count:1~5");
        //     this.nowLateFlag = true; //立即
        //     this.onBackPageData(this.picReqData, 'upload', 'go',this.loadStatus);
        //     //req formate處理，ex:金額*10000
        //     // this.reqData = this._allService.formateReqData(this.reqData);
        //     // this.stepBack();
        //     
        // }
        //  else if (count >= 6) {
        //全部上傳(*2020/05/25 目前因為只有一種項目，因此判斷>=1)
        else if (count >= 1) {
            this.loadStatus = '2';
            this._logger.log("into count:6");
            this.nowLateFlag = true; //立即
            this.onBackPageData(this.picReqData, 'upload', 'go', this.loadStatus);
        } else {
            this._logger.log("type error");
            return false;
        }
    }


    doScrollTop() {
        this._uiContentService.scrollTop();
    }

    /**
     * 圖片選擇
     */
    chosePic(pic_name) {
        this.previewId = pic_name;
        if (!!this.showPicData[pic_name]) {
            this.previewPic = this.showPicData[pic_name];
            this.previewPicData = this.showPicData[pic_name + 'data'];
        } else {
            this.previewPic = '';
            this.previewPicData = '';
        }
        this.onChangePage('preview');
    }

    /**
     * 相機相簿事件
     * @param type
     */
    openCamera(type: string) {
        new Promise((resolve, reject) => {
            if (type == 'photo') {
                // 開啟相簿
                this.cameraService.openPicFile().then(resolve, reject);
            } else {
                // 開啟相機
                this.cameraService.openCamera().then(resolve, reject);
            }
        }).then(
            (res) => {
                if (!!res['data'] && typeof res['data'] == 'string') {
                    let tmp_url = this.sanitizer.bypassSecurityTrustResourceUrl(res['data']);
                    this.previewPic = tmp_url;
                    this.previewPicData = res['data'];
                } else {
                    this.previewPic = '';
                    this.previewPicData = '';
                }
            },
            (err) => {
                if (!!err.isCancel) {
                    // no do
                } else {
                    err['type'] = 'dialog';
                    this._handleError.handleError(err);
                }
            }
        );

    }

    /**
     * 刪除圖片
     */
    delPic() {
        this.confirm.show('是否確定刪除選擇的圖片。', {
            title: 'ERROR.INFO_TITLE'
        }).then(
            () => {
                if (this.showPicData[this.previewId] !== 'undefined') {
                    this.previewPic = '';
                    this.previewPicData = '';
                    this.showPicData[this.previewId] = '';
                    this.showPicData[this.previewId + 'data'] = '';
                }
                this.onChangePage('back_upload');
            },
            () => {
                // no do
            }
        );
    }

    /**
     * 確定圖片
     */
    checkPic() {
        if (!!this.previewPic && typeof this.showPicData[this.previewId] !== 'undefined') {
            this.showPicData[this.previewId] = this.previewPic;
            this.showPicData[this.previewId + 'data'] = this.previewPicData;
        }
        this.onChangePage('back_upload');
    }

    //返回處理
    doBack() {
        this._headerCtrl.setLeftBtnClick(() => {
            //因為返回因此帶回fc001004資料
            this.onBackPageData(this.picReqData, 'upload', 'back', this.loadStatus);
        });
    }


    /**
    * 重新設定page data
    * @param item
    */
    onBackPageData(item, page?, type?, loadStatus?) {
        const output = {
            'page': 'list-item',
            'type': 'page_info',
            'data': item,
            'loadStatus': loadStatus
        };
        output.page = page;
        output.type = type;
        this._logger.log("output:", output);
        this.backPageEmit.emit(output);
    }

    /**
    * 失敗回傳
    * @param error_obj 失敗物件
    */
    onErrorBackEvent(error_obj, page) {
        const output = {
            'page': 'list-item',
            'type': 'error',
            'data': error_obj
        };
        this.errorPageEmit.emit(output);
    }


    /**
    * 頁面切換
    * @param pageType 頁面切換判斷參數
    *        'apply' : 申請綁定頁
    *        'bind' : 裝置綁定頁
    * @param pageData 其他資料
    */
    onChangePage(pageType: string, pageData?: any) {
        switch (pageType) {
            case 'preview': // 前往預覽頁
                this.showPreview = true;
                this._headerCtrl.setLeftBtnClick(() => {
                    this.onChangePage('back_upload');
                });
                break;
            case 'back_upload': // 返回上傳頁
            default:
                // 此功能無返回步驟功能!!!
                this.showPreview = false;
                this._headerCtrl.setLeftBtnClick(() => {
                    if (this.nowPage == 'page1') {
                        this.onBackPageData(this.picReqData, 'upload', 'back', this.loadStatus);
                    } else if (this.nowPage == 'page2') {
                        this.nowPage = 'page1';
                    }
                });
                break;
        }

        this.doScrollTop();
    }

}
