/**
 * [模擬] F1000106-裝置申請
 * result	結果	:	0-成功, 1-表失敗，需由Failure element取得錯誤代碼及訊息
 * OtpIdentity	OTP裝置認證識別碼
 */

import { f100_0_res_01 } from './f1000106-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';

export class F1000106SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    let output = ObjectUtil.clone(f100_0_res_01);
    let num = Math.floor(Math.random() * 10000);
    output['MNBResponse']['result']['OtpIdentity'] = PadUtil.padLeft(num.toString(), 4, '0');

    return output;
  }

}
