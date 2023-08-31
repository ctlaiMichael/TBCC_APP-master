
import { f100_0_res_01 } from './f1000101-res-01';
import { f100_0_res_02 } from './f1000101-res-02';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { f100_0_res_04 } from './f1000101-res-04';

export class F1000101SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    let output = ObjectUtil.clone(f100_0_res_01);

    if (!!output['MNBResponse']['result']) {
      // 登入成功處理
      let user_id = FieldUtil.checkField(reqObj, 'userId');
      user_id = user_id.toLocaleUpperCase();
      if (/^OTP_/.test(user_id) || /^BIND_/.test(user_id)) {
        output['MNBResponse']['result'] = this._modifyOTPData(user_id, output['MNBResponse']['result']);
      } else if (/^ONLY_/.test(user_id)) {
        output['MNBResponse']['result'] = this._modifySecurity(user_id, output['MNBResponse']['result']);
      }

    }

    return output;
  }

  /**
   * 處理OTP相關參數
   * @param user_id 使用者代碼
   * @param data result資料
   */
  private _modifyOTPData(user_id, data) {
    if (/^BIND_/.test(user_id)) {
      // tslint:disable-next-line:radix
      let bound = parseInt(user_id.replace('BIND_', ''));
      data['f10:BoundID'] = (bound >= 1 && bound <= 5) ? bound.toString() : '1';
    }
    if (/^OTP_/.test(user_id)) {
      // tslint:disable-next-line:radix
      let otpid = parseInt(user_id.replace('OTP_', ''));
      data['f10:OTPID'] = (otpid >= 1 && otpid <= 2) ? otpid.toString() : '1';
    }

    return data;
  }

  private _modifySecurity(user_id, data) {
    let auth_data = user_id.replace('ONLY_', '');
    let auth_list = auth_data.split('');
    let df_auth = (!!data['f10:DefAuthType']) ? data['f10:DefAuthType'] : '';
    let authType = (!!data['f10:AuthType']) ? data['f10:AuthType'].split(',') : [];
    let allow_list = ['1', '2', '3'];
    let set_auth_len = auth_list.length;
    if (set_auth_len >= 0) {
      if (set_auth_len == 1) {
        df_auth = auth_list.join('');
      }
      authType = [];
      auth_list.forEach((tmp) => {
        if (allow_list.indexOf(tmp.toString()) >= 0) {
          authType.push(tmp);
        }
      });
    }

    data['f10:DefAuthType'] = df_auth;
    data['f10:AuthType'] = authType.join(',');

    return data;
  }

}
