/**
 * FI000801-觀察清單
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000801ResBody } from './fi000801-res';
import { FI000801ReqBody } from './fi000801-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';


@Injectable()
export class FI000801ApiService extends ApiBase<FI000801ReqBody, FI000801ResBody> {
  constructor(
    public telegram: TelegramService<FI000801ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000801');
  }


  send(type,setType?): Promise<any> {
    /**
     * 參數處理
     */
    let set_data = new FI000801ReqBody();
    const custId = this.authService.getCustId();
    if (custId == '' || type == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    set_data.custId = custId;
    set_data.group = type;
    console.log('api type',type)
    if (parseInt(type) == 4) {
      console.log('all no type =4',type);
      return Promise.resolve({
        status:false,
        info_data: {},
        groupType: '1'
      });
    }
    return super.send(set_data).then(
      (response) => {
        let output = {
          status: false,
          msg: 'Error',
          info_data: {},
          groupType: type,
          headerTime: ''
        };
        

        let telegramHeader = (response.hasOwnProperty('header')) ? response.header : {};
        if (telegramHeader.hasOwnProperty('requestTime')) {
          output.headerTime = telegramHeader.requestTime;
        };

        let jsonObj = (response.hasOwnProperty('body')) ? response['body'] : {};
        console.log('jsonObj', jsonObj);

        if (jsonObj.hasOwnProperty('fundLists') && jsonObj['fundLists'] &&jsonObj['fundLists'].hasOwnProperty('fundList')) { //有資料回傳
          jsonObj['fundLists']['fundList'] = this.modifyTransArray(jsonObj.fundLists.fundList);
          output.status = true;
          output.msg = '';
          output.info_data = jsonObj;
        } else {  //無資料繼續查下個組合
          console.log('nulllllll')
          if(setType=='0'){ //首次
            type=(parseInt(type) + 1).toString();
            return this.send(type,'0');
          }else{
            output.status = true;
            output.msg = '';
            output.info_data = jsonObj;
          }
        }
        console.log('801 api', output);
        if (output.status) {
          console.log('statussss', type);
          return Promise.resolve(output);
        }
      },
      (errorObj) => {
        console.error('errorObj ',errorObj)
        if(errorObj['resultCode']=='F001' && setType=='0'){
          type=(parseInt(type) + 1).toString();
          return this.send(type,'0');
        }else{
          return Promise.reject(errorObj);
        }
      }
    );

  }


}
