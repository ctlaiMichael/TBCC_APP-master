/**
 * 額度調整
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FC001003ApiService } from '@api/fc/fc001003/fc001003-api.service';
import { FC001004ApiService } from '@api/fc/fc001004/fc001004-api.service';
import { FC001009ApiService } from '@api/fc/fc001009/fc001009-api.service';
import { SmsService } from '@shared/transaction-security/sms/sms.service';
import { CheckService } from '@shared/check/check.service';
import { FormateService } from '@shared/formate/formate.service';
import { FC001005ApiService } from '@api/fc/fc001005/fc001005-api.service';


@Injectable()

export class CardQuotaService {
  /**
   * 參數處理
   */
  loadStatus = '';

  constructor(
    private _logger: Logger
    , private fc001003: FC001003ApiService
    , private fc001004: FC001004ApiService
    , private fc001005: FC001005ApiService
    , private fc001009: FC001009ApiService
    , private _msgUpService: SmsService
    , private _checkService: CheckService
    , private _formateService: FormateService
  ) {
  }



  /**
   * 額度調整查詢
   */
  getBaicData(set_data?: Object): Promise<any> {
    return this.fc001003.getData(set_data).then(
      (success) => {
        this._logger.log("fc001003 success:", success);
        return Promise.resolve(success);
      },
      (failed) => {
        this._logger.log("fc001003 failed:", failed);
        return Promise.reject(failed);
      }
    );
  }

  /**
 * 簡訊請求
 */
  getMessageData(set_data?: Object): Promise<any> {
    this._logger.log("set_data:", set_data);
    //呼叫簡訊module做簡訊流程
    return this._msgUpService.show('', set_data).then(
      (S) => {
        this._logger.log("S:", S);
        return Promise.resolve(S);
      },
      (F) => {
        this._logger.log("F:", F);
        return Promise.reject(F);
      }
    );
    // return this.fc001009.getData(set_data).then(
    //   (success) => {
    //     this._logger.log("fc001009 success:",success);
    //     return Promise.resolve(success);
    //   },
    //   (failed) => {
    //     this._logger.log("fc001009 failed:",failed);
    //     return Promise.reject(failed);
    //   }
    // );
  }

  /**
 * 額度調整
 */
  getQuotaData(set_data?: Object): Promise<any> {
    return this.fc001004.getData(set_data).then(
      (success) => {
        this._logger.log("fc001004 success:", success);
        return Promise.resolve(success);
      },
      (failed) => {
        this._logger.log("fc001004 failed:", failed);
        return Promise.reject(failed);
      }
    );
  }

  //發送fc001004、fc001005
  sendResultData(reqData, picReqData, loadStatus) {
    let output = {
      status: false,
      msg: 'CHECK.EMPTY', // 請輸入正確資料
      type: 'dialog',
      data: {
      },
      title: '',
      errorType: 'check',
      error_list: {
      },
      resultData: {
        classType: 'error',
        title: '',
        content: '',
        content_params: {}
      },
      stage: '', //判斷資料哪個階段，'1':申請，'2':上傳，'2'代表起碼已經申請成功
      resultStatus: '', //** '1':申請、上傳皆成功，'2':申請成功，上傳圖有漏(無全部上傳)，'3':申請成功，上傳失敗，'4':交易失敗or!4001
      ebkCaseNo: '' //案件編號
      // reqErr: true, //409 respCode: 4001為true，非為false
    };
    this.loadStatus = loadStatus;
    this._logger.log("loadStatus:",this.loadStatus);
    return this.fc001004.getData(reqData).then(
      (resObj) => {
        this._logger.log("fc001004 success:", resObj);
        let show_title = 'resObj';
        let show_content = resObj.respCodeMsg;
        output.status = true;
        output.errorType = '';
        output.msg = show_content;
        output.resultData = {
          classType: 'success',
          title: show_title,
          content: show_content,
          content_params: { date: this._formateService.transDate(resObj.dataTime, 'date') }
        };
        output.stage = '1'; //申請階段
        output.title = resObj.respCode;
        //申請成功，將104回傳txNo帶入 fc001005 request
        picReqData['txNo'] = resObj['info_data']['txNo'];
        //交易失敗 or respCode != 4001
        if (resObj['excError'] == false) {
          this._logger.log("into resObj['excError'] ");
          output.resultStatus = '4';
          return Promise.resolve(output);
        }
        //不是稍後上傳，發送fc001005上傳api
        if (this.loadStatus != '0') {
          this._logger.log("into loadtype == true");
          return this.fc001005.getData(picReqData).then(
            (uploadS) => {
              // V1: success
              this._logger.log("uploadS:", uploadS);
              output.stage = '2'; //圖片上傳階段
              output.title = uploadS.respCode;
              //若申請、上傳皆為成功，需判斷情境
              //全部上傳(滿圖)
              if (this.loadStatus == '2') {
                output.resultStatus = '1';
              }
              //*2020/05/25 目前因為只有上傳一種項目，因此沒有resultStatus = 2之情境，未來有追加項目需判斷
              // else {
              //   //圖有漏，選擇1~5張    
              //   output.resultStatus = '2';
              // }
              return Promise.resolve(output);
            },
            (uploadE) => {
              // V2: warning 圖失敗
              //* 要改 會接不到
              this._logger.log("into upload error, uploadE:", uploadE);
              output.stage = '2'; //圖片上傳階段
              output.msg = uploadE.content;
              output.resultData.classType = 'warning';
              output.errorType = 'api';
              output.title = '申請上傳失敗';
              //情境判斷(申請成功，但上傳失敗)
              output.resultStatus = '3';
              this._logger.log("uploadE, output:", output);
              return Promise.resolve(output); //圖片上傳失敗扔然resolve回去
            }
          );
        } else {
          // V2: warning 圖補(稍後傳)
          output.resultStatus = '1'; //都成功，因為不需發上傳api
          return Promise.resolve(output);
        }
      },
      (errorObj) => {
        this._logger.log("fc001004 errorObj:", errorObj);
        errorObj.errorType = 'api';
        output.msg = errorObj.content;
        output.resultData.classType = 'warning';
        output.errorType = 'api';
        output.title = '申請失敗';
        output.resultStatus = '4';
        return Promise.resolve(output); //這裡resolve回去 結果頁自行判斷顯示
      }
    );
  }

  /**
   * 檢核 申請日
   * nextWorkDay => nextWorkDay次營業日
   * setDate: 畫面選擇之申請日
   * 
   * 企業規則：
   * 1.申請日不得小於下一營業日
   * 2.申請日需大於今日
   * 3.申請日不得大於90日(下一營業日+90日or今日+90日)
   * 4.迄日不得小於申請日
   */
  checkApplyDate(setDate: any, nextWorkDay: any, ) {
    let output = {
      status: false,
      msg: '',
      data: setDate
    };
    this._logger.log("into checkApplyDate, setDate:", setDate);
    this._logger.log("into checkApplyDate, nextWorkDay:", this._formateService.transClone(nextWorkDay));
    nextWorkDay = this._formateService.transDate(nextWorkDay, { formate: 'yyyy/MM/dd', chinaYear: false });
    this._logger.log("into checkApplyDate, nextWorkDay is turn, nextWorkDay:", this._formateService.transClone(nextWorkDay));
    let nextWorkSecond = (new Date(nextWorkDay + ' 00:00:00')).getTime();
    let setDateFormate = this._formateService.transDate(setDate, { formate: 'yyyy/MM/dd', chinaYear: false });
    let setDateSecond = (new Date(setDateFormate + ' 00:00:00')).getTime();
    //基本日期檢核
    let checkStartDate = this._checkService.checkDate(setDate);
    if (checkStartDate['status'] == false) {
      output.status = false;
      output.msg = checkStartDate['msg'];
      return output;
    } else {
      output.status = true;
      output.msg = '';
    }
    //申請日不得小於下一營業日
    if (setDateSecond < nextWorkSecond) {
      output.status = false;
      output.msg = '申請日不得小於下一營業日';
      return output;
    } else {
      output.status = true;
      output.msg = '';
    }
    //申請日需大於今日
    let today = new Date; //今日
    let todaySecond = today.getTime(); //今日毫秒數
    if (setDateSecond < todaySecond) {
      output.status = false;
      output.msg = '申請日需大於今日';
      return output;
    } else {
      output.status = true;
      output.msg = '';
    }
    //申請日不得大於90日(下一營業日+90日or今日+90日)
    //一天：24*3600*1000 => 86400000
    let days90 = 86400000 * 90; //90天
    if ((setDateSecond > todaySecond + days90) || (setDateSecond > nextWorkSecond + days90)) {
      output.status = false;
      output.msg = '申請日不得大於90日';
      return output;
    } else {
      output.status = true;
      output.msg = '';
    }
    return output;
  }

  /**
   * 檢核 申請迄日
   * endDate: 迄日
   * applyDate: 申請日
   * 
   * 企業規則：
   * 1.迄日不得小於申請日
   */
  checkEndDate(endDate: any, applyDate: any) {
    let output = {
      status: false,
      msg: '',
      data: endDate
    };
    let endDateFormate = this._formateService.transDate(endDate, { formate: 'yyyy/MM/dd', chinaYear: false });
    let endDateSecond = (new Date(endDateFormate + ' 00:00:00')).getTime();
    let applyDateFormate = this._formateService.transDate(applyDate, { formate: 'yyyy/MM/dd', chinaYear: false });
    let applyDateSecond = (new Date(applyDateFormate + ' 00:00:00')).getTime();
    this._logger.log("checkEndDate, endDateSecond:", endDateSecond);
    this._logger.log("checkEndDate, applyDateSecond:", applyDateSecond);
    //日期基本檢核
    let checkEndDate = this._checkService.checkDate(endDate);
    if (checkEndDate['status'] == false) {
      output.status = false;
      output.msg = checkEndDate['msg'];
      return output;
    } else {
      output.status = true;
      output.msg = '';
    }
    //迄日不得小於申請日
    if (endDateSecond < applyDateSecond) {
      output.status = false;
      output.msg = '迄日不得小於申請日';
      return output;
    } else {
      output.status = true;
      output.msg = '';
    }
    return output;
  }

  /**
   * 檢核 申請日與迄日 間隔不可超過90日
   * endDate: 迄日
   * applyDate: 申請日
   * 
   */
  checkEndtoStartDate(endDate: any, applyDate: any) {
    this._logger.log("into checkEndtoStartDate");
    let output = {
      status: false,
      msg: '',
      data: {
        endDate: endDate,
        applyDate: applyDate
      }
    };
    let endDateFormate = this._formateService.transDate(endDate, { formate: 'yyyy/MM/dd', chinaYear: false });
    let endDateSecond = (new Date(endDateFormate + ' 00:00:00')).getTime();
    let applyDateFormate = this._formateService.transDate(applyDate, { formate: 'yyyy/MM/dd', chinaYear: false });
    let applyDateSecond = (new Date(applyDateFormate + ' 00:00:00')).getTime();
    this._logger.log("checkEndDate, endDateSecond:", endDateSecond);
    this._logger.log("checkEndDate, applyDateSecond:", applyDateSecond);
    //一天：24*3600*1000 => 86400000
    let days90 = 86400000 * 90; //90天
    this._logger.log("endDateSecond-applyDateSecond:", endDateSecond - applyDateSecond);
    this._logger.log("days90:", days90);
    if ((endDateSecond - applyDateSecond) > days90) {
      output.status = false;
      output.msg = '申請日與迄日不得超過90日';
      return output;
    } else {
      output.status = true;
      output.msg = '';
    }
    return output;
  }

  /**
   * formate fc001004 request欄位，ex:金額*10000
   * setData: 畫面輸入欄位
   */
  formateReqData(setData) {
    this._logger.log("into formateReqData, setData:", setData);
    let reqData = this._formateService.transClone(setData);
    reqData['applyAmount'] = (parseInt(setData['applyAmount']) * 10000).toString(); //金額*10000
    //formate日期相關
    if (setData['applyDate'].indexOf('/') > -1) {
      this._logger.log("into applyDate indexOf('/') > -1");
      reqData['applyDate'] = setData['applyDate'].replace(/\//g, "");
    }
    if (setData['endDate'].indexOf('/') > -1) {
      this._logger.log("into endDate indexOf('/') > -1");
      reqData['endDate'] = setData['endDate'].replace(/\//g, "");
    }
    this._logger.log("reqData:", this._formateService.transClone(reqData));
    return reqData;
  }


  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

}
