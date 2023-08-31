/**
 * OTP服務
 * email: 目前前端不顯示此欄位，但發送必須有此資料
 * 安控權限：固定為憑證
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { OtpServiceService } from '@pages/security/shared/service/otp-service.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice'; // 安控
@Component({
  selector: 'app-otp-service',
  templateUrl: './otp-service-page.component.html',
  providers: [OtpServiceService]
})
export class OtpServicePageComponent implements OnInit {
  /**
   * 參數處理
   */
  private back_path = 'user-set'; // 個人設定選單
  data: any;
  hiddenStepBar = true;
  showResult = false;
  nowStep = '1';
  stepMenuData = [];
  editType = 'wait';
  editFlag = false;
  readOnlyFlag = false; // 若無下載憑證，僅提供閱讀功能(無安控)
  agreeProvision: any; // 同意條款
  // 原始資料
  info_data = {
    phone: {
      show: true,
      readOnlyFlag: false,
      oldval: '', // 原始資料
      title: '', // 欄位名稱
      placeholder: '' // 輸入注意事項
    },
    email: {
      show: true,
      readOnlyFlag: false,
      oldval: '', // 原始資料
      title: '', // 欄位名稱
      placeholder: '' // 輸入注意事項
    }
  };
  // 輸入資料
  inp_data = {
    phone: '',
    email: ''
  };
  // 錯誤資料
  error_data = {
    phone: '',
    email: ''
  };
  resultData: any;

  constructor(
    private _logger: Logger
    , private _mainService: OtpServiceService
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private confirm: ConfirmService
  ) { }

  ngOnInit() {
    this.agreeProvision = this._mainService.getProvision(); // 條款內容
    this._mainService.checkAuth().then(
      (resObj) => {
        this._logger.log('OTP', 'checkAuth', resObj);
        this.editType = resObj.type;
        this.editFlag = (this.editType == 'edit') ? true : false;
        this.info_data = resObj.data;
        this.readOnlyFlag = resObj.readOnlyFlag;
        this.stepMenuData = this._mainService.getSetpBarMenu(resObj.type);
        this._modifyLayout(resObj.title);  // 變更標題
        this.onChangePage(this.editType);
        // logger.error(this.editType);
      },
      (errorObj) => {
        errorObj['type'] = 'message';
        this._handleError.handleError(errorObj);
      }
    );
  }


  /**
   * 放棄編輯
   * readOnlyFlag 無編輯，直接返回
   */
  cancelEdit() {
    if (this.readOnlyFlag) {
      this.navgator.push(this.back_path);
      return true;
    }
    let msg_title = 'POPUP.CANCEL_EDIT.TITLE'; // 提醒您
    // 您尚未完成OTP申請，是否確定要取消OTP申請？
    let msg_content = 'PG_OTP.SERVICE.FIELD.CONFIRM';

    this.confirm.show(msg_content, {
      title: msg_title
    }).then(
      () => {
        this.navgator.push(this.back_path);
      },
      () => {
        // no do
      }
    );
  }

  /**
   * 同意條款
   * @param e
   */
  onProvision(e) {
    this._logger.step('OTP', 'onProvision', e);
    let page = e.page;
    let pageType = e.type;
    let tmp_data = e.data;
    if (tmp_data === true) {
      // agree
      this.onChangePage('form');
    } else {
      // disagree
      this.navgator.push(this.back_path);
    }

  }

  /**
   * step 返回
   * @param e
   */
  onStepBarEvent(e) {
    this._logger.log(e);
    // 目前不提供stepbar click事件，故此處暫不處理
  }

  /**
   * 變更步驟
   */
  onChangeStep(step) {
    this.nowStep = step;
  }

  /**
   * 輸入返回事件
   * @param e
   */
  onInputBack(e, type: string) {
    // this._logger.step('OTP', 'onInputBack', type, e);
    if (this.inp_data.hasOwnProperty(type)) {
      if (this.error_data.hasOwnProperty(type) && this.error_data[type] != '') {
        this.error_data[type] = '';
      }
      this.inp_data[type] = e;
    }
  }


  /**
   * 安控檢核
   * @param e
   */
  securityOptionBak(e) {
    this._logger.step('OTP', 'securityOptionBak', e);

    // if (e.status) {
    //   // 取得需要資料傳遞至下一頁子層變數
    //   this.userAddress.SEND_INFO = e.sendInfo;
    //   this.userAddress.USER_SAFE = e.sendInfo.selected;
    // } else {
    //   // do errorHandle 錯誤處理 推業或POPUP
    //   e.ERROR['type'] = 'message';
    //   this._handleError.handleError(e.ERROR);
    // }
  }


  /**
   * 儲存
   */
  onSaveEvent() {
    this._mainService.sendData(this.inp_data, this.info_data, this.editFlag).then(
      (resData) => {
        // 變更標題
        this.resultData = resData.resultData;
        this.onChangePage('result');
      },
      (errorObj) => {
        if (errorObj.hasOwnProperty('errorCode') && errorObj['errorCode'] === 'USER_CANCEL') {
          // 使用者取消，不動作
          return false;
        }
        if (errorObj.hasOwnProperty('errorType') && errorObj['errorType'] === 'check' && errorObj.hasOwnProperty('error_list')) {
          this.error_data = errorObj['error_list'];
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
        } else if (errorObj.hasOwnProperty('errorType')) {
          // 結果切換變更標題
          // logger.error('other error', errorObj);
          this.resultData = errorObj.resultData;
          this.onChangePage('result');
        } else {
          errorObj['type'] = 'message';
          this._handleError.handleError(errorObj);
        }
      }
    );
  }


  /**
   * 子層返回事件
   * @param e
   */
  onBackPage(e) {
    this._logger.step('OTP', 'onBackPage', e);
    // let page = '';
    // let pageType = '';
    // let tmp_data: any;
    // if (typeof e === 'object') {
    //   if (e.hasOwnProperty('page')) {
    //     page = e.page;
    //   }
    //   if (e.hasOwnProperty('type')) {
    //     pageType = e.type;
    //   }
    //   if (e.hasOwnProperty('data')) {
    //     tmp_data = e.data;
    //   }
    // }
    // if (page === 'bind' && pageType === 'step') {
    //   this.onChangePage(tmp_data);
    // }
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
      case 'read': // 申請
        this.hiddenStepBar = true;
        this.onChangeStep('read');
        break;
      case 'add': // 申請
        this.hiddenStepBar = false;
        this.onChangeStep('agree');
        break;
      case 'edit': // 異動
      case 'form': // 編輯
        this.hiddenStepBar = false;
        this.onChangeStep('form');
        break;
      case 'check': // 檢查
        this.hiddenStepBar = false;
        const check_data = this._mainService.checkOtpData(this.inp_data, this.editFlag);
        if (!check_data.status) {
          this.error_data = check_data.error_list;
          this._handleError.handleError({
            type: 'dialog',
            title: 'ERROR.TITLE',
            content: check_data.msg
          });
        } else {
          this.onChangeStep('check');
        }
        break;
      case 'result': // 結果
        this.hiddenStepBar = true;
        this.showResult = true;
        this.onChangeStep('result');
        break;
      default:
        this._handleError.handleError({
          type: 'dialog',
          title: 'ERROR.TITLE',
          content: 'ERROR.STEP_BAR.MISS_KEY' // 指定步驟不存在
        });
        break;
    }
  }

  /**
   * 改變標題項目
   * @param title header標題
   */
  private _modifyLayout(title) {
    // 變更標題
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': title
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.cancelEdit();
    });

  }

}
