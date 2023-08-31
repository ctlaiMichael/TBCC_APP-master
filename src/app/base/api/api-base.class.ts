import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { TelegramOption } from '@core/telegram/telegram-option';
import { TelegramService } from '@core/telegram/telegram.service';
import { JsonConvertUtil } from '@shared/util/json-convert-util';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { SystemError } from '@conf/error/system-error';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { PAGE_SETTING } from '@conf/page';
import { logger } from '@shared/util/log-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { HTTP_SERVER_STOP_LIST, HTTP_SERVER_TIMEOUT_LIST } from '@conf/http-status';

/**
 * Form上行Send格式
 * Response下行Response格式
 */
export class ApiBase<Request, Response> {
  serviceId: string;

  /**
   * 建構
   * @param telegram 電文Service
   * @param serviceId 電文ID
   */
  constructor(
    protected telegram: TelegramService<Response>,
    protected errorHandler: HandleErrorService,
    serviceId: string) {
    this.serviceId = serviceId;
  }


  send(data: Request, option?: TelegramOption): Promise<any> {
    return this.telegram.send(this.serviceId, data, option)
      .then((returnDataDecryptRes) => {
        // logger.debug('ok1:', returnDataDecryptRes);
        logger.debug('ok2:', JSON.stringify(returnDataDecryptRes));
        const tempData: any = returnDataDecryptRes;  // HSMerr {'error': 'HSM error', 'result': '-401'};
        // logger.debug('ok22:', JSON.stringify(tempData));
        let tempWord = '';
        if (typeof tempData.value !== 'undefined') {
          tempWord = tempData.value;
          tempWord = tempWord.replace(/[\n\t\r]/g, ''); // 去除\n \t
        } else if (!!tempData.error) {
          const err = new HandleErrorOptions(tempData.error, 'ERROR.TITLE');
          err.resultCode = tempData.result;
          return Promise.reject(err);
          // return this.errorHandler.handleError(err).then(() => {
          //   // 將錯誤回傳給API Service
          //   return Promise.reject(err);
          // });
          // return Promise.reject(err);
        }
        const prePaJsonObj = (typeof tempData.value !== 'undefined') ? JSON.parse(tempWord) : tempData;
        // 打開ok3註解可以顯示下行電文內容
        // 然後把正式環境電文內容貼到模擬電文的body裡面
        // logger.debug('ok3:' + JSON.stringify(prePaJsonObj));
        let paJsonObj: object;
        try {
          paJsonObj = JsonConvertUtil.converFromXmlJson(prePaJsonObj); // 重新整理res
        } catch (error) {
          let err = new HandleErrorOptions();
          err = { ...err, ...(SystemError.DATA_FORMAT_ERROR) };
          return Promise.reject(err);
        }
        // logger.debug('ok4:', paJsonObj );
        // logger.debug('ok5:', JSON.stringify(paJsonObj) );
        // logger.debug('typeof prePaJsonObj.MNBResponse.result:' + typeof prePaJsonObj.MNBResponse.result);
        // logger.debug('typeof prePaJsonObj.MNBResponse.failure:' + typeof prePaJsonObj.MNBResponse.failure);
        if (!!prePaJsonObj.MNBResponse && typeof prePaJsonObj.MNBResponse.result === 'object') {
          // logger.debug('success');
          return Promise.resolve(paJsonObj);
        } else if (!!prePaJsonObj.MNBResponse && typeof prePaJsonObj.MNBResponse.failure === 'object') {
          // logger.debug('failure');
          // TODO 回覆格式轉換為 HendleErrorOption
          let err = new HandleErrorOptions(paJsonObj['body'].respCodeMsg, 'ERROR.TITLE');
          err.resultCode = paJsonObj['body'].respCode;
          err.resultData = paJsonObj;
          return Promise.reject(err);
        } else if (!!prePaJsonObj.debugMessage && typeof prePaJsonObj.debugMessage !== 'undefined') {
          // logger.debug('debugMessage');
          // TODO 回覆格式轉換為 HendleErrorOption
          let err = new HandleErrorOptions(paJsonObj['body'].respCodeMsg, 'ERROR.TITLE');
          err.resultCode = paJsonObj['body'].respCode;
          err.resultData = paJsonObj;
          return Promise.reject(err);
        } else if (!!prePaJsonObj.fatalError && typeof prePaJsonObj.fatalError !== 'undefined') {
          // logger.debug('fatalError');
          // TODO 回覆格式轉換為 HendleErrorOption
          let err = new HandleErrorOptions(paJsonObj['body'].respCodeMsg, 'ERROR.TITLE');
          err.resultCode = paJsonObj['body'].respCode;
          err.resultData = paJsonObj;
          return Promise.reject(err);
        }
      })
      .catch(error => {
        logger.error('err: in apibase', JSON.parse(JSON.stringify(error)));
        let err;
        if (!!error && error.name === 'TimeoutError') {
          // 回覆格式轉換為 HendleErrorOption
          err = new HandleErrorOptions('ERROR.CONNECTION_TIMEOUT', 'ERROR.TITLE');
        } else if (!!error && !!error.body && !!error.body.respCodeMsg) {
          // for 快速登入特殊錯誤訊息
          if (error.body.respCode === 'ERRBI_0001') {
            err = error;
          } else if (error.body.respCode === 'ERRBI_0005') {
            err = error;
          } else {
            err = new HandleErrorOptions(error.body.respCodeMsg, 'ERROR.TITLE');
            err.resultCode = error.body.respCode;
            err.resultData = error;
          }
        } else if (!!error && error.content === 'ERROR.NO_NETWORK') {
          // err = error;
          err = new HandleErrorOptions('ERROR.NO_NETWORK', 'ERROR.TITLE');
        } else if (!!error && error.name === 'HttpErrorResponse') {
          // err = new HandleErrorOptions('ERROR.NO_SERVICE', 'ERROR.TITLE');
          let er_status = FieldUtil.checkField(error, 'status');
          let error_list = HTTP_SERVER_STOP_LIST;
          let timeout_error_list = HTTP_SERVER_TIMEOUT_LIST;
          let error_code = er_status.toString();
          if (error_list.indexOf(error_code) > -1 ) {
            // 親愛的客戶您好，目前系統維護中，請稍後再試。造成您的不便，敬請見諒。
            err = new HandleErrorOptions('ERROR.NO_SERVICE', 'ERROR.TITLE');
            err.resultCode = error_code;
            err.resultData = error;
          } else if (timeout_error_list.indexOf(error_code) > -1 ) {
            err = new HandleErrorOptions('ERROR.CONNECTION_TIMEOUT', 'ERROR.TITLE');
            err.resultCode = error_code;
            err.resultData = error;
          } else {
            // err = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(' + er_status + ')', 'ERROR.TITLE');
            err = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。', 'ERROR.TITLE');
            err.resultCode = er_status;
            err.resultData = error;
          }
        } else if (!err) {
          err = error;
        }
        // 調整將錯誤統一回傳給Service處理
        return Promise.reject(err);
        // if (error.body.hasOwnProperty('certCheck') && error.body.certCheck === 'ERROR') {
        //   return Promise.reject(err);
        // } else {
        //   return this.errorHandler.handleError(err).then(() => {
        //     // 將錯誤回傳給API Service
        //     return Promise.reject(err);
        //   });
        // }

        // console.error(err);
        // // TODO 回覆格式轉換為 HendleErrorOption
        // const error = new HandleErrorOptions(err.body.respCodeMsg || 'ERROR.DATA_FORMAT_ERROR', 'ERROR.TITLE');
        // logger.debug(JSON.stringify(error));
        // return Promise.reject(error);
      });
  }

  /**
   *
   * @param page 查詢頁數
   * @param sort 排序 ['排序欄位', 'ASC|DESC']
   * pageSize: 0 第一頁
   *           2~N 第2~n頁
   */
  modifyPageReq(data, page?: number, sort?: Array<any>) {
    let output = {
      pageSize: '',
      pageNumber: '',
      sortColName: '',
      sortDirection: '',
    };
    if (data.hasOwnProperty('pageNumber') && typeof page !== 'undefined') {
      data['pageNumber'] = page;
    }
    // tslint:disable-next-line:radix
    const check_page = parseInt(data['pageNumber']);
    if (!data.hasOwnProperty('pageNumber') || check_page <= 0 || check_page == 1) {
      data['pageNumber'] = 0;
    }
    // tslint:disable-next-line:radix
    const check_pagesize = parseInt(data['pageSize']);
    if (!data.hasOwnProperty('pageSize') || data['pageSize'] === '' || check_pagesize <= 0) {
      data['pageSize'] = PAGE_SETTING.PAGE_SIZE;
    }

    if (typeof sort !== 'undefined') {
      if (typeof sort[0] != 'undefined' && sort[0] !== '' && sort[0]) {
        data['sortColName'] = sort[0];
      }
      if (typeof sort[1] == 'string' && sort[1] !== '' && sort[1]) {
        data['sortDirection'] = (sort[1].toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
      }
    }

    output['pageSize'] = data['pageSize'].toString();
    output['pageNumber'] = data['pageNumber'].toString();
    output['sortColName'] = data['sortColName'];
    output['sortDirection'] = data['sortDirection'];
    // logger.debug("pageCheck", JSON.parse(JSON.stringify(output)));
    return output;
  }

  /**
   *  分頁資料整理
   * @param set_data
   */
  protected pagecounter(set_data: Object) {
    let totalPages;
    let output_data = {
      pageSize: 0,
      totalPages: 1
    };
    if (set_data.hasOwnProperty('paginatedInfo')
      && typeof set_data['paginatedInfo'] === 'object'
      && set_data['paginatedInfo'].hasOwnProperty('totalRowCount')
      && set_data['paginatedInfo'].hasOwnProperty('pageSize')
    ) {

      totalPages = Math.ceil(set_data['paginatedInfo']['totalRowCount'] / (set_data['paginatedInfo']['pageSize']));
      // tslint:disable-next-line: radix
      output_data.pageSize = parseInt(set_data['paginatedInfo']['pageSize']);
      output_data.totalPages = totalPages;
    }

    return output_data;
  }

  /**
     * Array轉碼 (for 合庫)
     */
  protected modifyTransArray(obj: any): Array<any> {
    return ObjectCheckUtil.modifyTransArray(obj);
  }

  /**
   * 檢查物件
   * @param jsonObj 檢查物件
   * @param check_list 檢查層級
   * @param return_type 回傳類別
   */
  protected checkObjectList(jsonObj: any, check_list: string, return_type?: string): any {
    return ObjectCheckUtil.checkObjectList(jsonObj, check_list, return_type);
  }

  /**
   * 重組TelegramOption
   * @param security CheckSecurityService doSecurityNextStep 回傳物件
   * @param other_set 其他設定
   */
  protected modifySecurityOption(security, other_set?: Object) {
    let df_option = new TelegramOption();
    let option = { ...df_option, ...other_set };

    let header_set = this.checkObjectList(security, 'header');
    if (!header_set) {
      header_set = this.checkObjectList(security, 'headerObj');
    }
    if (header_set) {
      option.header = header_set;
    } else {
      // 有些程式因為component包裝處理，多一個物件這樣寫
      const header_set_some = this.checkObjectList(security, 'securityResult.headerObj');
      if (header_set_some) {
        option.header = header_set_some;
      } else {
        logger.step('Telegram', 'modifySecurityOption', 'error headerObj', header_set, security);
      }
    }
    return option;
  }


}
