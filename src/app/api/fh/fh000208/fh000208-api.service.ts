import { Injectable } from '@angular/core';
import { FH000208ResBody } from './fh000208-res';
import { FH000208ReqBody } from './fh000208-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { CheckService } from '@shared/check/check.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class FH000208ApiService extends ApiBase<FH000208ReqBody, FH000208ResBody> {
  constructor(public telegram: TelegramService<FH000208ResBody>,
    public errorHandler: HandleErrorService,
    private _formateService: FormateService,
    public authService: AuthService,
    private _logger: Logger,
    private checkService: CheckService
  ) {
    super(telegram, errorHandler, 'FH000208');
  }

  getData(data: FH000208ReqBody): Promise<any> {
    // custId有登入帶進來，無登入為空
    const custId = this.authService.getCustId();
    if (custId != '') {
      data.custId = custId;
    } else {
      data.custId = '';
    }

    let check_data = this.encodeCardData(data);
    if (!check_data.status) {
      this._logger.error('CardEncode error', check_data);
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: '信用卡資料輸入錯誤'
      });
    }

    let reqData = new FH000208ReqBody();
    reqData['custId'] = this._formateService.checkField(data, 'custId');
    reqData['hospitalId'] = this._formateService.checkField(data, 'hospitalId');
    reqData['branchId'] = this._formateService.checkField(data, 'branchId');
    reqData['personId'] = this._formateService.checkField(data, 'personId');
    reqData['creditCardNo'] = check_data.data['creditCardNo'];
    reqData['validDate'] = check_data.data['validDate'];
    reqData['checkCode'] = check_data.data['checkCode'];
    reqData['totalCount'] = this._formateService.checkField(data, 'totalCount');
    reqData['totalAmount'] = this._formateService.checkField(data, 'totalAmount');
    reqData['queryTime'] = this._formateService.checkField(data, 'queryTime');
    reqData['trnsToken'] = this._formateService.checkField(data, 'trnsToken');
    reqData['details'] = this._formateService.checkField(data, 'details');




    return super.send(reqData).then(
      (resObj) => {
        let output: any = {
          transRes: {},
          info_data: {},
          data: [],
          status: false,
          msg: '',
          error_type: ''
        };
        let checkRes = TransactionApiUtil.modifyResponse(resObj);
        if (checkRes.trnsRsltCode == '2') {
          // 特殊處理
          checkRes.classType = 'warning';
          checkRes.title = '已扣款交易異常，請至櫃檯處理';
        }
        output.transRes = checkRes;
        output.status = checkRes.status;
        output.msg = checkRes.msg;
        output.error_type = checkRes.classType;

        let jsonObj = checkRes.body;
        output.info_data = jsonObj;
        let check_obj = this.checkObjectList(jsonObj, 'rdetails.detail');
        if (typeof check_obj !== 'undefined') {
          output.data = this.modifyTransArray(check_obj);
          delete output.info_data['rdetails'];
        }
        output.info_data['trnsFee'] = this._formateService.checkField(output.info_data, 'trnsFee'); // 手續費
        output.info_data['trnsNo'] = this._formateService.checkField(output.info_data, 'trnsNo'); // 單據列印序號
        output.info_data['stan'] = this._formateService.checkField(output.info_data, 'stan'); // 銀行交易序號
        output.info_data['hostCodeMsg'] = this._formateService.checkField(output.info_data, 'hostCodeMsg'); // 主機訊息代碼
        output.info_data['trnsRsltCode'] = this._formateService.checkField(output.info_data, 'trnsRsltCode'); // 交易結果代碼
        output.info_data['specialInfo'] = this._formateService.checkField(output.info_data, 'specialInfo'); // specialInfo
        output.info_data['detailInfoURL'] = this._formateService.checkField(output.info_data, 'detailInfoURL'); // 病友注意事項及用藥資訊URL
        output.info_data['authCode'] = this._formateService.checkField(output.info_data, 'authCode'); // authCode	交易授權碼

        // if (output.info_data['trnsRsltCode'] == '') {
        //   return Promise.reject({
        //     title: 'ERROR.TITLE',
        //     content: 'ERROR.RSP_FORMATE_ERROR'
        //   });
        // }

        // 交易結果狀態處理:
        // trnsRsltCode	交易結果代碼 0-交易成功,1-交易失敗,X-交易異常,2-已扣款交易異常請至櫃台處理
        // if (output.info_data['trnsRsltCode'] == '0') {
        //   output.status = true;
        //   output.msg = '';
        // } else if (output.info_data['trnsRsltCode'] == 'X' || output.info_data['trnsRsltCode'] == '2') {
        //   output.error_type = 'warning';
        // } else {
        //   output.error_type = 'error';
        // }
        return Promise.resolve(output);

      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

  private encodeCardData(data) {
    let output = {
      status: false,
      msg: 'ERROR.DATA_FORMAT_ERROR',
      data: {
        creditCardNo: '',
        validDate: '',
        checkCode: ''
      }
    };
    let inpCard = this._formateService.checkField(data, 'creditCardNo');
    let inpDate = this._formateService.checkField(data, 'validDate');
    let inpCode = this._formateService.checkField(data, 'checkCode');
    this._logger.log('card', inpCard, inpDate, inpCode);
    // 欄位檢查
    let error_list = [];
    if (!this.checkService.checkNumber(inpCard, 'positive', true) || inpCard.length != 16) {
      error_list.push('卡號錯誤');
    }
    if (!this.checkService.checkNumber(inpDate, 'positive', true) || inpDate.length != 6) {
      error_list.push('有效月年錯誤');
    }
    if (!this.checkService.checkNumber(inpCode, 'positive', true) || inpCode.length != 3) {
      error_list.push('檢核碼');
    }
    if (error_list.length > 0) {
      output.msg = error_list.join(',');
      return output;
    }

    // 計算基準碼
    const baseCode = this._formateService.transDate(new Date(), 'MMddHHmmss');
    this._logger.log('baseCode:', baseCode);

    const creditCardConvered = this.strCard(inpCard); // 轉換卡號
    const allstr = creditCardConvered + inpDate + inpCode + baseCode; // 組合字串
    this._logger.log('allstr:', allstr);
    const codeA = baseCode.substr(3); // 基準A
    this._logger.log('codeA: ', codeA);
    let allhexString = this.stringtoHex(allstr); // String to HexString
    this._logger.log('allhexString:', allhexString);

    const y = allhexString.length; // 取得HexString總長度
    const placeA = parseInt(codeA, 10) % y;
    this._logger.log('placeA:', placeA);
    const code1 = allhexString.substr(0, placeA); // 取HexSting(0-切割位置)
    const code2 = allhexString.substr(placeA); // 取HexString(切割位置-結尾)
    let allhexStringChanged = code2 + code1; // 將HexString重組
    this._logger.log('allhexStringChanged(重組後):', allhexStringChanged);
    let changepoint = codeA.substr(codeA.length - 1); // 基準D
    this._logger.log('changepoint:', changepoint);
    let changepointC = parseInt(changepoint, 10) + 17; // 位置碼C
    allhexStringChanged = this.changeCharUsingCharArray(allhexStringChanged, changepoint, changepointC);
    if (allhexStringChanged == '') {
      output.msg = '轉換錯誤';
      return output;
    }
    this._logger.log('allhexStringChanged:', allhexStringChanged);
    const orderless = baseCode + baseCode.substr(6, 4); // 打亂位置
    this._logger.log('orderless:', orderless);
    const insertStr = ['a', 'b', 'c', 'd', 'e', 'f'];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < orderless.length; j++) {
        // 打亂位置增加a-f亂數
        let a = Math.floor(Math.random() * 6);
        allhexStringChanged = this.addStrChar(allhexStringChanged, parseInt((orderless.substr(j, 1)), 10) * 8, insertStr[a]);
      }
    }
    this._logger.log('allhexStringChanged(打亂後):', allhexStringChanged);
    let sendcreditCardNo = allhexStringChanged.substr(0, 16) + baseCode.substr(-2); // 傳送虛擬信用卡號
    let sendvalidDate = allhexStringChanged.substr(16, 6); // 傳送虛擬有效年月
    let sendcheckCode = allhexStringChanged.substr(22) + baseCode; // 傳送虛擬檢查碼+發送月日時分秒
    this._logger.log('sendcreditCardNo:', sendcreditCardNo);
    this._logger.log('sendvalidDate:', sendvalidDate);
    this._logger.log('sendcheckCode:', sendcheckCode);

    output.status = true;
    output.msg = '';
    output.data.creditCardNo = sendcreditCardNo;
    output.data.validDate = sendvalidDate;
    output.data.checkCode = sendcheckCode;
    return output;
  }

  /**
   * 卡號轉換
   * @param str
   */
  private strCard(str) {
    const trans_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let str_length = str.length;
    let i = 0;
    let output = '';
    for (i = 0; i < str_length; i++) {
      if (typeof str[i] != 'undefined' && typeof trans_list[str[i]] != 'undefined') {
        output += trans_list[str[i]];
      }
    }
    return output;
  }

  /**
   * trans to hex
   * @param str
   */
  private stringtoHex(str: string) {
    let val = '';
    let i = 0;
    for (i; i < str.length; i++) {
      if (val == '') {
        val = str.charCodeAt(i).toString(16);
      } else {
        val += str.charCodeAt(i).toString(16);
      }
    }
    return val;
  }

  /**
   * 位置互換
   * @param str
   * @param indexA
   * @param indexB
   */
  private changeCharUsingCharArray(str, preIndexA, indexB) {
    let chars = str.split('');
    let indexA = parseInt(preIndexA, 10);
    if (indexA >= indexB) {
      return '';
    }
    if (typeof chars[indexA] == 'undefined' || typeof chars[indexB] == 'undefined') {
      return '';
    }
    let tempStrA = chars[indexA];
    let tempStrB = chars[indexB];
    chars.splice(indexA, 1, tempStrB);
    chars.splice(indexB, 1, tempStrA);
    let output = chars.join('');
    return output;
  }

  /**
   * 插入字元
   * @param str
   * @param pos
   * @param addstr
   */
  private addStrChar(str, pos, addstr) {
    let fixedStr = str.substr(0, pos) + addstr + str.substr(pos);
    return fixedStr;
  }


}
