import { Injectable } from '@angular/core';
import { F1000101ReqBody } from '@api/f1/f1000101/f1000101-req';
import { F1000101ApiService } from '@api/f1/f1000101/f1000101-api.service';
import { AuthService } from '@core/auth/auth.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { FtLoginService } from '../../../login/shared/ftlogin.service';
import { BiometricService } from '@lib/plugins/biometric.service';
import { FN000104ReqBody } from '@api/fn/fn000104/fn000104-req';
import { FN000104ApiService } from '@api/fn/fn000104/fn000104-api.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class NocardTransService {

  constructor(
    private biometricService: BiometricService,
    private F1000101: F1000101ApiService,
    private FN000104: FN000104ApiService,
    private authService: AuthService,
    private tcbb: TcbbService,
    private alert: AlertService,
    private ftloginService: FtLoginService,
    private logger: Logger,
    private _formateService: FormateService,
  ) { }

  /****************************************************************************
   * 一般網銀密碼驗證                                                           *
   * @param onlineBankPwd 網銀密碼                                             *
   ****************************************************************************/
  async commonVerify(onlineBankPwd) {
    // 取得userInfo
    const userData = this.authService.getUserInfo();
    // 取得數位信封加密之網銀密碼
    const resPwd = await this.authService.digitalEnvelop(onlineBankPwd);
    const form = new F1000101ReqBody();
    form.userId = userData.userId.toUpperCase();
    form.custId = userData.custId;
    form.password = resPwd.value;

    // 取cn
    const res_cn = await this.tcbb.setF1000102Data({ nbCert: this.authService.nbCert }, form.custId, form.userId);
    let reqHeader = {
        header: { cn: res_cn.cn }
    };
    const f1000101res = await this.F1000101.send(form, reqHeader);
    // alert('f1000101res.body:' + JSON.stringify(f1000101res.body));
    return f1000101res.body;
  }

  /**************************************************************************
   * 生物辨識認證：若生物辨識認證失敗改走一般認證                               *
   * @memberof NocardTransConfirmComponent                                  *
   *************************************************************************/
  biometricVerify(ftloginRemember, userData): Promise<any> {

    return new Promise((resolve, reject) => {

      // 比對生物辨識資訊 與 當前使用者登入資訊 是否相同
      if (ftloginRemember.comparecustId !== userData.custId &&
        ftloginRemember.compareuserId !== userData.userId) {
        this.alert.show('您現在的ID與設定生物辨識的ID不同，請先使用原帳號作一般登入', { title: '錯誤' }).then(
          (success) => {
            reject();
          }
        );
      } else {
        this.ftloginService.requestBioService(userData, '請將您的指紋置於感應區域上').then(
          (res) => {
            this.logger.warn('requestBioService success', res);
            resolve(res);
          },
          (error) => {
            this.logger.warn('requestBioService error', error);
            reject(error);
        });
      }
    });
  }

  /**************************************************************************
   * 檢核欄位資料                                                            *
   * @checkDataObj 被檢核資料                                                *
   * @commErrorCount 網銀密碼錯誤次數                                         *
   *************************************************************************/
  checkData(checkDataObj, commErrorCount?) {
    return new Promise((resolve) => {
      let passCount = 0;
      if (typeof checkDataObj === 'object') {
        // === 編輯頁欄位檢核 === //

        // 錯誤訊息
        let errorMsg = {
          withdrawAcct: '',     // 提款帳號
          withdrawMoney: '',    // 提款金額
          withdrawPwd: '',      // 提款密碼
          checkPwd: ''          // 再次確認提款密碼
        };

        // 密碼檢核規則(正規表示式):是否為純數字
        let reg1 = /^\d+$/;

        // 檢核無誤之編輯資料
        let allEditReserveData = {
          transType: 'reserve', // 交易類型: 預約無卡提款(reserve)
          custId: '',           // 客戶者ID
          userId: '',           // 使用者ID
          bankId: '006',        // 銀行代號
          withdrawAcct: '',     // 提款帳號
          withdrawMoney: '',    // 提款金額
          withdrawPwd: '',      // 提款密碼
          pwdLength: 0,         // 提款密碼長度
          remeberPwd: false,    // 記住提款密碼
        };

        // 提款帳號檢核
        if (checkDataObj.selectAcct >= 0) {
          errorMsg.withdrawAcct = '';
          // 寫入編輯資料-提款帳號
          allEditReserveData.withdrawAcct = checkDataObj.withdrawAcct;
          passCount++;
        } else {
          errorMsg.withdrawAcct = 'true';
        }

        // 提款金額檢核
        if ( !!checkDataObj.withdrawMoney) {
          //  提款金額是否為千元
          if ( (Number(checkDataObj.withdrawMoney) % 1000) !== 0) {
            errorMsg.withdrawMoney = '提款金額請以千元為單位';
          } else {
            // 提款金額不得超過3萬
            if ( (Number(checkDataObj.withdrawMoney) / 1000) > 30) {
              errorMsg.withdrawMoney = '提款金額不得超過3萬';
            } else {
              errorMsg.withdrawMoney = '';
              // 寫入編輯資料-提款金額
              allEditReserveData.withdrawMoney = checkDataObj.withdrawMoney;
              passCount++;
            }
          }
        } else {
          errorMsg.withdrawMoney = '提款金額請以千元為單位';
        }

        // 提款密碼檢核
        if ( !!checkDataObj.withdrawPwd ) {
          errorMsg.withdrawPwd = '';
          // 提款密碼檢核是否為重複或連續數字
          if (this.checkPassWord(checkDataObj.withdrawPwd, 6, 12, reg1, 7) !== '') {
            switch (this.checkPassWord(checkDataObj.withdrawPwd, 6, 12, reg1, 7)) {
              case 'ERR001':
                errorMsg.withdrawPwd = '請輸入6-12位數字';
                break;
              case 'ERR002':
                errorMsg.withdrawPwd = '提款密碼不可為重覆或連續數字';
                break;
            }
          } else {
            // 寫入編輯資料-提款密碼
            allEditReserveData.withdrawPwd = checkDataObj.withdrawPwd;
            allEditReserveData.pwdLength = checkDataObj['withdrawPwd'].length;
            passCount++;
          }
        } else {
          errorMsg.withdrawPwd = '請輸入6-12位數字';
        }

        // 二次提款密碼檢核
        if ( !!checkDataObj.checkPwd ) {
          errorMsg.checkPwd = '';

          // 提款密碼檢核是否為重複或連續數字
          if (this.checkPassWord(checkDataObj.checkPwd, 6, 12, reg1, 7) !== '') {
            switch (this.checkPassWord(checkDataObj.checkPwd, 6, 12, reg1, 7)) {
              case 'ERR001':
                errorMsg.checkPwd = '請輸入6-12位數字';
                break;
              case 'ERR002':
                errorMsg.checkPwd = '提款密碼不可為重覆或連續數字';
                break;
            }
          } else {
            // 判斷是否與第一次的密碼相同
            if (checkDataObj.checkPwd == checkDataObj.withdrawPwd) {
              passCount++;
            } else {
              errorMsg.checkPwd = '提款密碼與確認提款密碼不一致，請重新輸入';
            }
          }
        } else {
          errorMsg.checkPwd = '請輸入6-12位數字';
        }

        // 回傳結果
        let outputData = {
          allEditReserveData: allEditReserveData,
          errorMsg: errorMsg,
          passCount: passCount
        };

        resolve(outputData);

      } else {
        // === 確認頁欄位檢核 === //
        let errorMsg = {
          onlineBankPwd: ''           // 網銀密碼
        };
        // 回傳結果
        let outputData = {
          errorMsg: errorMsg,
          passCount: passCount,
          commErrorCount: commErrorCount
        };

        if (!!checkDataObj) {
          // 取得一般網銀認證結果
          this.commonVerify(checkDataObj).then(
            (res_success) => {
              // alert('res_success:' + JSON.stringify(res_success));
              if ( res_success['validateResult'] === '0') {
                // validateResult為0，驗證通過
                passCount++;
                outputData['passCount'] = passCount;
                resolve(outputData);
              } else {
                if (res_success['OtpSttsInfo']['PwdStatus'] === '1') {
                  // PwdStatus為1，代表密碼鎖定
                  outputData['commErrorCount'] = 5;
                  resolve(outputData);
                }
              }
            },
            (error_false) => {
              this.logger.debug('error_false:', error_false);
              errorMsg.onlineBankPwd = '網銀登入密碼錯誤，請重新輸入。';
              if (!!error_false.resultData.body) {
                switch (error_false.resultData.body.respCode) {
                  case '012':
                      commErrorCount = 5;
                    break;
                  default:
                      commErrorCount++;
                    break;
                }
              }
              outputData['errorMsg'] = errorMsg;
              outputData['commErrorCount'] = commErrorCount;
              resolve(outputData);
            }
          );
        } else {
          errorMsg.onlineBankPwd = '請輸入網銀登入密碼';
          outputData['errorMsg'] = errorMsg;
          resolve(outputData);
        }
      }
    });
  }

  /**
   * 提款密碼規則檢核-不可為重複(部分重複)或連續(部分連續)純數字，不能有英文
   * @password      密碼本文
   * @minLen        密碼最小長度
   * @maxLen        密碼最大長度
   * @ruleReg       檢核規則正規表示式:是否為純數字、是否為全英文、是否需含有英文大小寫...
   * @sequenceNum   設定連續/相同字元長度上限
   */
  checkPassWord(password: string, minLen: number, maxLen: number, ruleReg: any, sequenceNum: number) {
    /***********************************************************************
     * 錯誤代碼      錯誤原因                 顯示訊息
     * ERR001       密碼長度不符上下限        請輸入6-12位數字
     *              非純數字
     * ERR002       連續數字超過設定上限      提款密碼不可為重覆或連續數字
     *              相同數字超過設定上限
     ***********************************************************************/
    let pwdLength = password.length;        // 密碼本文長度
    let result = '';                        // 回傳結果
    let regFlag = ruleReg.test(password);   // 檢核表示式規則之結果
    let positiveCount = 0;                  // 檢核連續正序字元之計數器
    let invertedCount = 0;                  // 檢核連續反序字元之計數器
    let sameCount     = 0;                  // 檢核相同字元之計數器
    // 密碼長度檢核
    if (pwdLength < minLen || pwdLength > maxLen) {
      result = 'ERR001';
    }

    // 檢核表示式規則
    if (!regFlag) {
      result = 'ERR001';
    }

    // 檢核連續正序字元
    for (let p = 1; p < pwdLength; p++) {
      let ch = password.charCodeAt(p);
      let temp = password.charCodeAt(p - 1);
      if (ch - temp === 1) {
        // 正序字元檢核
        positiveCount++;
        if (positiveCount >= sequenceNum) {
          result = 'ERR002';
        }
      } else {
        positiveCount = 0;
      }
    }

    // 檢核連續反序字元
    for (let i = 1; i < pwdLength; i++) {
      let ch = password.charCodeAt(i);
      let temp = password.charCodeAt(i - 1);
      if (temp - ch === 1) {
        // 正序字元檢核
        invertedCount++;
        if (invertedCount >= sequenceNum) {
          result = 'ERR002';
        }
      } else {
        invertedCount = 0;
      }
    }

    // 檢核相同字元
    for (let s = 1; s < pwdLength; s++) {
      let ch = password.charCodeAt(s);
      let temp = password.charCodeAt(s - 1);
      if (ch - temp === 0) {
        // 正序字元檢核
        sameCount++;
        if (sameCount >= sequenceNum) {
          result = 'ERR002';
        }
      } else {
        sameCount = 0;
      }
    }
    // 回傳檢核結果
    if (!!result) {
      return result;
    } else {
      result = '';
      return result;
    }
  }

  /********************************************************************************
   * 發送fn000104電文，進行預約交易申請                                             *
   ********************************************************************************/
  makeReservation(outputData): Promise<any>  {
    return new Promise((resolve, reject) => {
      let req_data = new FN000104ReqBody();
      req_data = outputData;

      this.FN000104.send(req_data).then(
        (res) => {
          // this.logger.debug('fn000104_res:', res);
          resolve(res.body);
        },
        (error) => {
          // this.logger.debug('fn000104_err:', error);
          let jsonObj = (error.resultData.hasOwnProperty('body')) ? error.resultData['body'] : {};
          let jsonHeader = (error.resultData.hasOwnProperty('header')) ? error.resultData['header'] : {};
          let output = {
            dataTime: this._formateService.checkField(jsonHeader, 'responseTime'),
            info_data: this._formateService.transClone(jsonObj),
            custId: jsonHeader.custId,
          };
          reject(output);
        }
      );
    });
  }
}
