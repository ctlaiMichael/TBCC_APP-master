/**
 * 基金帳號查詢
 * 1: 單筆申購
 * 2: 小額申購
 * 3: 預約單筆申購
 * 4: 新約簽訂註記查詢
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000401ResBody } from './fI000401-res';
import { FI000401ReqBody } from './fI000401-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { logger } from '@shared/util/log-util';


@Injectable()
export class FI000401ApiService extends ApiBase<FI000401ReqBody, FI000401ResBody> {
  constructor(
    public telegram: TelegramService<FI000401ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
    , private _handleError: HandleErrorService
    , private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000401');
  }


  /**
   * 基金庫存明細
   * req
   */
  getData(req: any): Promise<any> {
    const userData = this.authService.getUserInfo();
    this._logger.step('FUND', 'custId1:', userData.custId);

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new FI000401ReqBody();
    data.custId = userData.custId; // user info;
    data.trnsType = req.trnsType; // 1:單筆,2:小額,3.預約, 4.新約簽訂註記查詢
    if (data.pwd != null) {
      data.pwd = req.pwd;
    }
    this._logger.step('FUND', 'line 46, data:', data);

    let output = {
      status: false,
      msg: 'ERROR.RSP_FORMATE_ERROR',
      info_data: {}, // 儲存API
      twAcnt_data: [], // 台幣約定轉出帳號列表
      frgn_data: [], // 外幣約定轉出帳號列表
      trust_data: [], // 信託帳號列表
      pkg_data: [], // 定期不定額列表
      twAcnt_data_reservation: [], // 台幣約定轉出帳號列表(預約)
      frgn_data_twAcnt_data_reservation: [], // 外幣約定轉出帳號列表(預約)
    };
    return this.doEncode(data).then(
      (send_data) => {
    return super.send(data).then(
      (resObj) => {
        
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.info_data = jsonObj;
        // this._logger.step('FUND', 'line 63 jsonObj:', jsonObj);

        // 儲存台幣約定轉出帳號列表
        if (jsonObj.hasOwnProperty('twOutAcnts') && jsonObj['twOutAcnts'] && typeof jsonObj['twOutAcnts'] === 'object'
          && jsonObj['twOutAcnts'].hasOwnProperty('twOutAcnt')) {
          output.twAcnt_data = this.modifyTransArray(jsonObj['twOutAcnts']['twOutAcnt']);
          // this._logger.step('FUND', 'line 66 has twAcnt');
          // this._logger.step('FUND', 'output.twAcnt_data:', output.twAcnt_data);
        }
        // 儲存外幣約定轉出帳號列表
        if (jsonObj.hasOwnProperty('frgnOutAcnts') && jsonObj['frgnOutAcnts'] && typeof jsonObj['frgnOutAcnts'] === 'object'
          && jsonObj['frgnOutAcnts'].hasOwnProperty('frgnOutAcnt')) {
          output.frgn_data = this.modifyTransArray(jsonObj['frgnOutAcnts']['frgnOutAcnt']);
          // this._logger.step('FUND', 'line 74 has frgnOut');
          // this._logger.step('FUND', 'output.frgn_data:', output.frgn_data);
        }
        // 儲存信託帳號列表
        if (jsonObj.hasOwnProperty('trustAcnts') && jsonObj['trustAcnts'] && typeof jsonObj['trustAcnts'] === 'object'
          && jsonObj['trustAcnts'].hasOwnProperty('trustAcnt')) {
          output.trust_data = this.modifyTransArray(jsonObj['trustAcnts']['trustAcnt']);
          // this._logger.step('FUND', 'line 81 has trustAcnt');
          // this._logger.step('FUND', 'output.trust_data:', output.trust_data);
        }

        // 儲存定期不定額列表
        if (jsonObj.hasOwnProperty('pkgLists') && jsonObj['pkgLists'] && typeof jsonObj['pkgLists'] === 'object'
          && jsonObj['pkgLists'].hasOwnProperty('pkgList')) {
          output.pkg_data = this.modifyTransArray(jsonObj['pkgLists']['pkgList']);
          // this._logger.step('FUND', 'line 90 has pkgList');
          // this._logger.step('FUND', 'output.pkg_data:', output.pkg_data);
        }

        // frgnOutAcnts可以為空，不一定有資料
        if (req.trnsType == '1' || req.trnsType == '2' || req.trnsType == '3') {
          this._logger.step('FUND', 'line 99 output: ', req.trnsType);
          if (output.twAcnt_data.length <= 0 || output.trust_data.length <= 0) {
            return Promise.reject({
              title: 'ERROR.TITLE',
              content: 'ERROR.EMPTY'
            });
          }
        }
        // if (req.trnsType == '4' && jsonObj.hasOwnProperty('stopFundWording') == false) {
        //   let err = {
        //     type : 'message',
        //     content : 'ERROR.RSP_FORMATE_ERROR',
        //     title : 'ERROR.TITLE',
        //     button : 'POPUP.ALERT.OK_BTN',
        //     classType : 'error'
        //   };
        //   this._handleError.handleError(err);
        // }


        output.status = true;
        output.msg = '';
        // this._logger.step('FUND', 'line 109 output: ', output);
        if (data.trnsType == '1') {
          const data2 = new FI000401ReqBody();
          data2.custId = userData.custId; // user info;
          data2.trnsType = '3';
          return super.send(data2).then(
            (sues) => {
              let jsonObj2 = (sues.hasOwnProperty('body')) ? sues['body'] : {};
              logger.error('FUND', 'line 63 jsonObj:', jsonObj);
      
              // 儲存台幣約定轉出帳號列表
              if (jsonObj2.hasOwnProperty('twOutAcnts') && jsonObj2['twOutAcnts'] && typeof jsonObj2['twOutAcnts'] === 'object'
                && jsonObj2['twOutAcnts'].hasOwnProperty('twOutAcnt')) {
                output.twAcnt_data_reservation = this.modifyTransArray(jsonObj2['twOutAcnts']['twOutAcnt']);
              }
              // 儲存外幣約定轉出帳號列表
              if (jsonObj2.hasOwnProperty('frgnOutAcnts') && jsonObj2['frgnOutAcnts'] && typeof jsonObj2['frgnOutAcnts'] === 'object'
                && jsonObj2['frgnOutAcnts'].hasOwnProperty('frgnOutAcnt')) {
                output.frgn_data_twAcnt_data_reservation = this.modifyTransArray(jsonObj2['frgnOutAcnts']['frgnOutAcnt']);
              }
              logger.error('FUND :', output);
              return Promise.resolve(output);
            },
            (fail) => {
              logger.error('fail in 401 trnstype3:',fail)
              return Promise.reject(fail);
            }
          );
        }

        return Promise.resolve(output);
      },
      (errorObj) => {
        // this._logger.step('FUND', 'errorObj:', errorObj);
        return Promise.reject(errorObj);
      }
    );
  },
  (errorObj2) => {
    return Promise.reject(errorObj2);
  }
);
  }


  /**
   * 取得換約註記
   * trnsType = 4
   * newAgrCD: 新約簽訂註記 Y︰已簽訂 N︰未簽訂 不存在: 可能沒有信託帳號
   * stopFundWording: 若此欄位有值，則App停止基金業務，並顯示此wording內容
   */
  getAgreeNew(): Promise<any> {
    const custId = this.authService.getCustId();
    if (custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }

    const data = new FI000401ReqBody();
    data.custId = custId;
    data.trnsType = '4';

    let output = {
      status: false,
      msg: 'ERROR.RSP_FORMATE_ERROR',
      noFund: false,
      agreeFlag: false, // 已簽署換約狀態
      stopFund: false, // 基金停機狀態
      branchName: '',
      unitCall: ''
    };

    return super.send(data).then(
      (resObj) => {
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.status = true;
        output.msg = '';
        // 簽約註記+信託帳號權限
        let newAgrCD = this._formateService.checkField(jsonObj, 'newAgrCD');
        let branchName = this._formateService.checkField(jsonObj, 'branchName');
        let unitCall = this._formateService.checkField(jsonObj, 'unitCall');
        let newAgrCDUpper = newAgrCD.toLocaleUpperCase();
        output.branchName = branchName;
        output.unitCall = unitCall;
        if (newAgrCDUpper === 'N') {
          output.agreeFlag = false;
        } else if (newAgrCDUpper === 'Y') {
          output.agreeFlag = true;
        } else {
          // 無信託帳號
          output.noFund = true;
          output.agreeFlag = true;
        }
        // 中台強制停機
        let stopFundWording = this._formateService.checkField(jsonObj, 'stopFundWording');
        if (stopFundWording !== '') {
          output.stopFund = true;
          output.msg = stopFundWording;
        }
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

  private doEncode(data: FI000401ReqBody): Promise<any> {
    return this.authService.digitalEnvelop(data.pwd).then(
      (encodeStr) => {
        data.pwd = encodeStr.value;
        return Promise.resolve(data);
      },
      (errorObj2) => {
        return Promise.reject(errorObj2);
      }
    );
  }

}
