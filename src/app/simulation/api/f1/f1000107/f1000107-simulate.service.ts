/**
 * [模擬] F1000107-OTP裝置認證
 * result	結果	:	0-成功, 1-表失敗，需由Failure element取得錯誤代碼及訊息
 *    ERR10701 驗證碼錯誤，停留原畫面
 *    ERR10702 驗證碼失效，離開畫面
 */

import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { f100_0_res_01 } from './f1000107-res-01';
import { f100_0_res_02, f100_0_res_03 } from './f1000107-res-02';

export class F1000107SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    let output = ObjectUtil.clone(f100_0_res_01);
    let sessionService = new SessionStorageService();
    let simu_key = '_simula_f1000107';
    let tmp_info = sessionService.getObj('userTmpInfo');
    const check_identity = FieldUtil.checkField(tmp_info, 'BIND_identity');
    const set_identity = FieldUtil.checkField(reqObj, 'OtpIdentity');
    let count = sessionService.getObj(simu_key);
    if (!count) {
      count = 0;
    }
    // tslint:disable-next-line:radix
    count = parseInt(count);

    if (check_identity !== '' && set_identity !== check_identity) {
      // output = ObjectUtil.clone(f100_0_res_02);
      output = ObjectUtil.clone(f100_0_res_03);
      count++;
      if (count >= 3) {
        // 超過次數了!
        // output['MNBResponse']['failure']['codeFromHost'] = 'ERR10702';
        output['MNBResponse']['failure']['codeFromService'] = 'ERR10702';
        sessionService.remove(simu_key);
      } else {
        sessionService.setObj(simu_key, count);
      }
    } else {
      sessionService.remove(simu_key);
    }

    return output;
  }

}
