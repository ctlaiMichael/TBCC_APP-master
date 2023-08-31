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
import { AlertService } from '@shared/popup/alert/alert.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CameraPluginService } from '@lib/plugins/camera-plugin.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Base64FileUtil } from '@shared/util/formate/modify/base64-file-util';
import { MainUploadService } from '@pages/online-loan/shared/service/main-upload.service';

@Component({
    selector: 'app-main-upload-edit',
    templateUrl: './main-upload-edit.component.html',
    styleUrls: ['./main-upload-edit.component.css'],
    providers: [CameraPluginService,MainUploadService]
})

export class MainUploadEditPageComponent implements OnInit {
    @Input() queryData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'page1';
    defaultImg = '';
    showPicData = {
        // pic1: 'assets/images/plus-picture.png',
        // pic2: 'assets/images/plus-picture.png',
        // pic3: 'assets/images/plus-picture.png',
        // pic4: 'assets/images/plus-picture.png',
        // pic5: 'assets/images/plus-picture.png',
        // pic6: 'assets/images/plus-picture.png'
        pic1: '', //顯示
        pic2: '',
        pic3: '',
        pic4: '',
        pic5: '',
        pic6: '',
        pic1data: '', //送出
        pic2data: '',
        pic3data: '',
        pic4data: '',
        pic5data: '',
        pic6data: ''
    };

    showPreview = false; // 是否預覽
    previewId = ''; // 選的項目
    previewPic: any; // 預覽圖
    previewPicData: any; // 預覽圖

    //證明文件上傳request api408
    reqData_load: any = {
        custId: '', //身分證字號
        txNo: '', //案件編號
        tvr: '', //F9000409安控驗證機制 => 補件上傳預設''，不需要改
        funcId: '', //功能代號
        isId: '', //是否需要身分證影本
        isFin: '', //是否需要財力證明
        isWork: '', //是否需要在職文件證明
        isHouse: '', //是否需要戶籍證明
        isOther: '', //是否需要其他文件證明
        idCopy1: '', //身分證影本1
        idCopy2: '', //身分證影本2
        finProof1: '', //財力證明
        workProof1: '', //在職文件證明
        houseProof1: '', //戶籍證明
        otherProof1: '', //其他證明文件
        source: '' //資料來源
    };
    info_data_408 = {};

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private alert: AlertService
        , private _uiContentService: UiContentService
        , private confirm: ConfirmService
        , private cameraService: CameraPluginService
        , private sanitizer: DomSanitizer
        , private _loadService: MainUploadService
    ) { }

    ngOnInit() {
        this._logger.error("into editPage2!");
        this._logger.log("queryData:", this.queryData);
        this.reqData_load['txNo'] = this.queryData['ebkCaseNo']; //帶入501查詢之案件編號
        this.reqData_load['source'] = '3'; //補件上傳
        this.reqData_load['funcId'] = '2'; //補件上傳
        this.onChangePage('page1');
        this.defaultImg = 'assets/images/plus-picture.png';
        this.doScrollTop();
    }
    onBack1() {
        this.onBackPageData({}, 'editPage', 'back');
    }
    onNext1() {
        this.doScrollTop();
        this.nowPage = 'page2';
    }
    onBack2() {
        this.doScrollTop();
        this.nowPage = 'page1';
    }
    onNext2() {
        this.selectPic(); //做req處理，以及圖片轉base64
        this._logger.log("send api, reqData_load:",this.reqData_load);
        this._loadService.sendUpLoad(this.reqData_load).then(
            (result) => {
                this._logger.log("408 result:", result);
                this.info_data_408 = result.info_data;
                this._logger.log("info_data_408:", this.info_data_408);
                this.onBackPageData({}, 'editPage', 'go'); //成功走結果頁
            },
            (errorObj) => {
                this._logger.log("408 errorObj:", errorObj);
                errorObj['type'] = 'message';
                errorObj['button'] = 'PG_ONLINE.BTN.BACKLOAN';
                errorObj['backType'] = 'online-loan';
                this._handleError.handleError(errorObj);
            }
        );
    }

    /**
     * 判斷那些欄位需要上傳(使用者選擇的)
     * 
     * pic1: 身分證上傳(正面) => req:idCopy1
     * pic2: 身分證上傳(反面) => req:idCopy2
     * pic3: 財力證明文件上傳 => req:finProof1
     * pic4: 在職證明文件上傳 => req:workProof1
     * pic5: 戶籍謄本或戶口名簿謄本上傳 => req:houseProof1
     * pic6: 其他證明文件(如駕照、健保卡等) => req:otherProof1
     */
    selectPic() {
        //如果選擇值等於預設圖片(+號圖)，代表該欄位不上傳
        //身分證上傳(正面)
        if (this.showPicData['pic1data'] == '') {
            this._logger.log("idCopy1 ==");
            this.reqData_load['isId'] = '0'; //不需要
            this.reqData_load['idCopy1'] = '';
        } else {
            this._logger.log("idCopy1 !==");
            this.reqData_load['isId'] = '1'; //需要
            //將上傳圖片轉為base64字串
            let idCopy1_64 = Base64FileUtil.toBase64(this.showPicData['pic1data']);
            this.reqData_load['idCopy1'] = idCopy1_64;
        }
        //身分證上傳(反面)
        if (this.showPicData['pic2data'] == '') {
            this._logger.log("idCopy2 ==");
            this.reqData_load['isId'] = '0'; //不需要
            this.reqData_load['idCopy2'] = '';
        } else {
            this._logger.log("idCopy2 !==");
            this.reqData_load['isId'] = '1'; //需要
            let idCopy2_64 = Base64FileUtil.toBase64(this.showPicData['pic2data']);
            this.reqData_load['idCopy2'] = idCopy2_64;
        }
        //身分證(正、反)，其中一個要上傳，isId就為 '1':需要
        if (this.showPicData['pic1data'] != '' || this.showPicData['pic2data'] != '') {
            this.reqData_load['isId'] = '1'; //需要
        } else {
            this.reqData_load['isId'] = '0'; //不需要
        }
        //財力證明文件上傳
        if (this.showPicData['pic3data'] == '') {
            this._logger.log("finProof1 ==");
            this.reqData_load['isFin'] = '0'; //不需要
            this.reqData_load['finProof1'] = '';
        } else {
            this._logger.log("finProof1 !==");
            this.reqData_load['isFin'] = '1'; //需要
            let finProof1_64 = Base64FileUtil.toBase64(this.showPicData['pic3data']);
            this.reqData_load['finProof1'] = finProof1_64;
        }
        //在職證明文件上傳
        if (this.showPicData['pic4data'] == '') {
            this._logger.log("workProof1 ==");
            this.reqData_load['isWork'] = '0'; //不需要
            this.reqData_load['workProof1'] = '';
        } else {
            this._logger.log("workProof1 !==");
            this.reqData_load['isWork'] = '1'; //需要
            let workProof1_64 = Base64FileUtil.toBase64(this.showPicData['pic4data']);
            this.reqData_load['workProof1'] = workProof1_64;
        }
        //戶籍謄本或戶口名簿謄本上傳
        if (this.showPicData['pic5data'] == '') {
            this._logger.log("houseProof1 ==");
            this.reqData_load['isHouse'] = '0'; //不需要
            this.reqData_load['houseProof1'] = '';
        } else {
            this._logger.log("houseProof1 !==");
            this.reqData_load['isHouse'] = '1'; //需要
            let houseProof1_64 = Base64FileUtil.toBase64(this.showPicData['pic5data']);
            this.reqData_load['houseProof1'] = houseProof1_64;
        }
        //其他證明文件(如駕照、健保卡等)
        if (this.showPicData['pic6data'] == '') {
            this._logger.log("otherProof1 ==");
            this.reqData_load['isOther'] = '0'; //不需要
            this.reqData_load['otherProof1'] = '';
        } else {
            this._logger.log("otherProof1 !==");
            this.reqData_load['isOther'] = '1'; //需要
            let otherProof1_64 = Base64FileUtil.toBase64(this.showPicData['pic6data']);
            this.reqData_load['otherProof1'] = otherProof1_64;
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
            this.previewPicData = this.showPicData[pic_name+'data'];
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
                    this.showPicData[this.previewId+'data'] = '';
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
            this.showPicData[this.previewId+'data'] = this.previewPicData;
        }
        this.onChangePage('back_upload');
    }



    /**
    * 重新設定page data
    * @param item
    */
    onBackPageData(item, page?, type?) {
        const output = {
            'page': 'list-item',
            'type': 'page_info',
            'data': item
        };
        output.page = page;
        output.type = type;
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
                        this.onBackPageData({}, 'editPage', 'back');
                    } else if (this.nowPage == 'page2') {
                        this.nowPage = 'page1';
                    }
                });
                break;
        }

        this.doScrollTop();
    }

}
