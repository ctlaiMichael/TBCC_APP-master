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
import { FileUploadService } from './file-upload.service';
import { MortgageIncreaseService } from '../../service/mortgage-increase.service';
import { Base64FileUtil } from '@shared/util/formate/modify/base64-file-util';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css'],
    providers: [CameraPluginService, FileUploadService, CheckSecurityService]
})

export class FileUploadComponent implements OnInit {
    closeSecurity = false; //控制是否安控 true:關閉安控(p4)
    @Input() queryData: any;
    @Input() type: string;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() fullData: any; //前一頁傳來之reqData，這頁送電文用
    @Input() resver: string; //是否為預填單 'Y':預填,'N':非預填
    @Input() action: string; //紀錄返回狀態，'go':進入此頁，'back':返回此頁
    nowPage = 'page1';
    showCheckSecurity = false; // 送出
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
        tvr: '', //F9000409安控驗證機制
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
    reqData: any = {}; //申請上傳request api409
    info_data = {}; //電文回傳資訊 
    // info_data_409 = {}; //409電文回傳(申請)
    // info_data_408 = {}; //408電文回傳(上傳)

    // request
    userAddress = {
        'USER_SAFE': '',
        'SEND_INFO': ''
    };

    transactionObj = {
        serviceId: 'F9000409',
        categoryId: '6',
        transAccountType: '1',
        customAuth: ['2', '3'] // 客制權限 '2':憑證,'3':OTP
    };

    securityObj = {
        'action': 'init',
        'sendInfo': {}
    };

    safeE = {};

    //控制稍後或立即 true:立即，false:稍後
    nowLateFlag: boolean;
    selectCount = 0; //決定上傳幾張圖
    loadStatus = ''; //上傳狀態：'0':稍後上傳，'1'：1~5張，'2':全部傳

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private authService: AuthService
        , private _uiContentService: UiContentService
        , private confirm: ConfirmService
        , private cameraService: CameraPluginService
        , private sanitizer: DomSanitizer
        , private _allService: MortgageIncreaseService
        , private _mainService: FileUploadService
        , private _checkSecurityService: CheckSecurityService
        , private alert: AlertService
    ) { }

    ngOnInit() {
        this._logger.error("into editPage2!");
        this._logger.log("queryData:", this.queryData);
        this.onChangePage('page1');
        this.defaultImg = 'assets/images/plus-picture.png';
        this.doScrollTop();
        this.reqData = this._allService.getAllData(); //取得所有暫存資料，申請req
        this._logger.log("get reqData:", this.reqData);
        if (this.reqData['loanUsage'] == '09') {  // alex
            this.reqData['txkind'] = 'E';
            // this.reqData['kycloanUsage'] = '09';
        }
        //此功能為申請上傳，不會有補件上傳的狀況，因此reqData.source無'3'之情況
        if (this.type == 'mortgage') {
            this.reqData_load.source = '1'; //房貸
        } else {
            this.reqData_load.source = '2'; //信貸
        }
        //檢附資料上傳: '1', 補件上傳: '2'
        this.reqData_load['funcId'] = '1';
    }
    onBack1() {
        this.onBackPageData({}, 'file-upload', 'back');
    }
    onNext1() {
        this.doScrollTop();
        this.doBack();
        this.nowPage = 'page2';
    }
    onBack2() {
        this.doScrollTop();
        this.nowPage = 'page1';
    }
    //確認：走408上傳電文
    onNext2() {
        this.selectCount = this.selectPic(); //做req處理，以及圖片轉base64
        this._logger.log("selectCount:", this.selectCount);
        this.sendLoadType(this.selectCount);
    }
    //稍後上傳：不走408上傳電文 **改為沒上傳
    onLate() {
        this.nowLateFlag = false; //稍後
        this.stepBack();
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
        let count = 0;
        //如果選擇值等於預設圖片(+號圖)，代表該欄位不上傳
        //身分證上傳(正面)
        if (this.showPicData['pic1data'] == '') {
            this.reqData_load['isId'] = '0'; //不需要
            this.reqData_load['idCopy1'] = '';
        } else {
            this.reqData_load['isId'] = '1'; //需要
            //將上傳圖片轉為base64字串
            let idCopy1_64 = Base64FileUtil.toBase64(this.showPicData['pic1data']);
            this.reqData_load['idCopy1'] = idCopy1_64;
            count++;
        }
        //身分證上傳(反面)
        if (this.showPicData['pic2data'] == '') {
            this.reqData_load['isId'] = '0'; //不需要
            this.reqData_load['idCopy2'] = '';
        } else {
            this.reqData_load['isId'] = '1'; //需要
            let idCopy2_64 = Base64FileUtil.toBase64(this.showPicData['pic2data']);
            this.reqData_load['idCopy2'] = idCopy2_64;
            count++;
        }
        //身分證(正、反)，其中一個要上傳，isId就為 '1':需要
        if (this.showPicData['pic1data'] != '' || this.showPicData['pic2data'] != '') {
            this.reqData_load['isId'] = '1'; //需要
        } else {
            this.reqData_load['isId'] = '0'; //不需要
        }
        //財力證明文件上傳
        if (this.showPicData['pic3data'] == '') {
            this.reqData_load['isFin'] = '0'; //不需要
            this.reqData_load['finProof1'] = '';
        } else {
            this.reqData_load['isFin'] = '1'; //需要
            let finProof1_64 = Base64FileUtil.toBase64(this.showPicData['pic3data']);
            this.reqData_load['finProof1'] = finProof1_64;
            count++;
        }
        //在職證明文件上傳
        if (this.showPicData['pic4data'] == '') {
            this.reqData_load['isWork'] = '0'; //不需要
            this.reqData_load['workProof1'] = '';
        } else {
            this.reqData_load['isWork'] = '1'; //需要
            let workProof1_64 = Base64FileUtil.toBase64(this.showPicData['pic4data']);
            this.reqData_load['workProof1'] = workProof1_64;
            count++;
        }
        //戶籍謄本或戶口名簿謄本上傳
        if (this.showPicData['pic5data'] == '') {
            this.reqData_load['isHouse'] = '0'; //不需要
            this.reqData_load['houseProof1'] = '';
        } else {
            this.reqData_load['isHouse'] = '1'; //需要
            let houseProof1_64 = Base64FileUtil.toBase64(this.showPicData['pic5data']);
            this.reqData_load['houseProof1'] = houseProof1_64;
            count++;
        }
        //其他證明文件(如駕照、健保卡等)
        if (this.showPicData['pic6data'] == '') {
            this.reqData_load['isOther'] = '0'; //不需要
            this.reqData_load['otherProof1'] = '';
        } else {
            this.reqData_load['isOther'] = '1'; //需要
            let otherProof1_64 = Base64FileUtil.toBase64(this.showPicData['pic6data']);
            this.reqData_load['otherProof1'] = otherProof1_64;
            count++;
        }
        return count;
    }

    //決定走哪種上傳流程
    sendLoadType(count) {
        //不上傳(沒有選圖)
        if (count <= 0) {
            this._logger.log("into count:0");
            this.confirm.show('您目前無上傳任何證明文件，請確認仍暫不上傳嗎?', {
                title: '提醒您',
                btnYesTitle: '是，暫不上傳',
                btnNoTitle: '否，回上傳文件'
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
            //有上傳圖，但沒有全部上傳，1~5
        } else if (count > 0 && count < 6) {
            this.loadStatus = '1';
            this._logger.log("into count:1~5");
            this.nowLateFlag = true; //立即
            //req formate處理，ex:金額*10000
            // this.reqData = this._allService.formateReqData(this.reqData);
            this.stepBack();
            //全部上傳
        } else if (count >= 6) {
            this.loadStatus = '2';
            this._logger.log("into count:6");
            this.nowLateFlag = true; //立即
            //req formate處理，ex:金額*10000
            // this.reqData = this._allService.formateReqData(this.reqData);
            this.stepBack();
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
            if (this.nowPage == 'page1') {
                this.onBackPageData({}, 'file-upload', 'back');
            } else {
                this.nowPage = 'page1';
            }
        });
    }

    //安控相關 -------------------------- Start --------------------------

    // 安控函式
    securityOptionBak(e) {
        this._logger.log('securityOptionBak: ', e);
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.userAddress.SEND_INFO = e.sendInfo;
            this.userAddress.USER_SAFE = e.sendInfo.selected;
            this.securityObj = {
                'action': 'init',
                'sendInfo': e.sendInfo
            };
        } else {
            // do errorHandle 錯誤處理 推業或POPUP
            if (this.closeSecurity) {
                return false; // test no security
            }
            e['type'] = 'dialog';
            this._handleError.handleError(e.ERROR);
        }
    }

    stepBack() {
        this._logger.log("1. reqData:", this.reqData);
        let e = this.userAddress;
        //申請種類欄位防呆，2019/12/25有申請欄位送出為空之狀況
        if (this.reqData['txkind'] == null || typeof this.reqData['txkind'] == 'undefined' || this.reqData['txkind'] == '') {
            this._logger.log("into cant find reqData['txkind']");
            if (this.type == 'mortgage') {
                this.reqData['txkind'] = 'A'; //房貸增貸
            } else if (this.type == 'credit') {
                this.reqData['txkind'] = 'B'; //信貸
            } else {
                this.reqData['txkind'] = 'D'; //房屋貸款
            }
        }
        this._logger.log("before send 409api ,reqData['txkind']:", this.reqData['txkind']);
        //req防呆
        let Foolproof = this.checkFoolproof(this.reqData);
        if (Foolproof.kind == false || Foolproof.term == false || Foolproof.adrr == false || Foolproof.acct == false) {
            this._logger.log("into !Foolproof");
            return false;
        }
        this._mainService.sendData(this.reqData, e, this.reqData_load, this.nowLateFlag, this.loadStatus).then(
            (success) => {
                this._logger.log("api success:", success);
                this.info_data = success;
                this.onBackPageData(success, 'file-upload', 'go'); //成功走結果頁
            },
            (errorObj) => {
                this._logger.log("api errorObj:", errorObj);
                //使用者有可能按取消，因此api錯誤才推頁
                // if (errorObj.errorType == 'api') {
                // 2019/12/30 409申請電文因客戶提出otp輸入錯誤，整個流程要重做，因此改為alert錯誤訊息
                this._logger.log("into 409 api error alert, errorObj:", errorObj);
                // errorObj['type'] = 'message';
                // errorObj['button'] = 'PG_ONLINE.BTN.BACKLOAN';
                // errorObj['backType'] = 'online-loan';
                // }
                errorObj['type'] = 'alert';
                this._handleError.handleError(errorObj); //失敗
            }
        );
    }

    //req防呆
    checkFoolproof(checkData) {
        let output = {
            kind: false,
            term: false,
            adrr: false,
            acct: false
        };
        //申請種類防呆
        if (typeof checkData['txkind'] == 'undefined' || checkData['txkind'] == null || checkData['txkind'] == '') {
            this._logger.log("into txkind error");
            this.alert.show('查無申請種類', {
                title: '提醒您',
                btnTitle: '了解',
            }).then(
                () => {
                }
            );
            return output;
        } else {
            this._logger.log("into txkind success");
            output.kind = true;
        }
        //條款相關防呆
        if (checkData['agree'] == '' || checkData['agreeJc'] == '' || checkData['agreeJcVer'] == ''
            || checkData['agreeCt'] == '' || checkData['agreeCtVer'] == '' || checkData['agreeTr'] == ''
            || checkData['agreeTrVer'] == '' || checkData['agreeCm'] == '' || checkData['agreeCmVer'] == '') {
            this._logger.log("into term error");
            this.alert.show('查無條款資訊', {
                title: '提醒您',
                btnTitle: '了解',
            }).then(
                () => {
                }
            );
            return output;
        } else {
            this._logger.log("into term success");
            output.term = true;
        }
        //地址欄位防呆
        if (checkData['applyHouseAddr'] == '' || checkData['applyLiveAddr'] == '') {
            this._logger.log("into addr error");
            this.alert.show('查無地址欄位', {
                title: '提醒您',
                btnTitle: '了解',
            }).then(
                () => {
                }
            );
            return output;
        } else {
            this._logger.log("into addr success");
            output.adrr = true;
        }
        //帳號欄位防呆
        if (checkData['account'] == '') {
            let branchStatus = this._allService.getBranchStatus();
            this._logger.log("branchStatus:",branchStatus);
            //不是自選往來分行，又無委扣帳號，需防呆(信貸)
            if (branchStatus == true && this.type == 'credit') {
                this._logger.log("into account error");
                this.alert.show('查無帳號欄位', {
                    title: '提醒您',
                    btnTitle: '了解',
                }).then(
                    () => {
                    }
                );
                return output;
                //為自選往來，無委扣帳號不需防呆(信貸)
            } else {
                this._logger.log("into account success 2");
                output.acct = true
            }
            //帳號不為空
        } else {
            this._logger.log("into account success 1");
            output.acct = true;
        }
        this._logger.log("into all success");
        return output;
    }


    //安控相關 -------------------------- End --------------------------


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
        let allData = this._allService.allData;
        if (output.page == 'back') {
            output.data = allData;
        }
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
                        this.onBackPageData({}, 'file-upload', 'back');
                    } else if (this.nowPage == 'page2') {
                        this.nowPage = 'page1';
                    }
                });
                break;
        }

        this.doScrollTop();
    }

}
