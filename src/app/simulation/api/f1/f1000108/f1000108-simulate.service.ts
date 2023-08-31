/**
 * [模擬] F1000108-OTP功能申請
 * result	結果	:	0-成功, 1-表失敗，需由Failure element取得錯誤代碼及訊息
 */

import { f100_0_res_01 } from './f1000108-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';

export class F1000108SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    let output = ObjectUtil.clone(f100_0_res_01);
    const custId = FieldUtil.checkField(reqObj, 'custId');
    const action = FieldUtil.checkField(reqObj, 'action');
    const phone = FieldUtil.checkField(reqObj, 'phone');
    const email = FieldUtil.checkField(reqObj, 'email');

    if (phone != '' && ['1', '2', '3'].indexOf(action) > -1) {
      output['MNBResponse']['result']['result'] = '0';
    } else {
      output['MNBResponse']['result']['result'] = '1';
    }

    // let user_id = FieldUtil.checkField(reqObj, 'userId');
    // if (/^OTP_/.test(user_id)) {
    //   output['MNBResponse']['result'] = this._modifyOTPData(user_id, output['MNBResponse']['result']);
    // }


    return output;
  }


  /**
   * 處理OTP相關參數
   * @param user_id 使用者代碼
   * @param data result資料
   */
  private _modifyOTPData(user_id, data) {

    return data;
  }

}
