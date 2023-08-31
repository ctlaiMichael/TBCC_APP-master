/**
 * [模擬]基金投資標的查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000401_res_01, fi000401_res_02, fi000401_res_04, fi000401_res_05, fi000401_res_06 } from './fi000401-res-01';
import { fi000401_res_real } from './fi000401-res-real';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { DateUtil } from '@shared/util/formate/date/date-util';

export class FI000401SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    let output: any;
    let tmp_custId = reqObj.custId;
    // 單筆

    switch (reqObj.trnsType) {
      case '2':
        // 小額
        // output = ObjectUtil.clone(fi000401_res_02);
        output = ObjectUtil.clone(fi000401_res_real['res_02']);
        break;
      case '3':
        // 預約單筆
        output = ObjectUtil.clone(fi000401_res_05);
        break;
      case '4':
        // 新約簽訂註記查詢
        output = ObjectUtil.clone(fi000401_res_04);
        break;
      default:
      case '1':
        output = ObjectUtil.clone(fi000401_res_01);
        let tmp_time = DateUtil.transDate('NOW_TIME', 'HHii');
        if (tmp_time >= '1500' || tmp_custId == 'nextdate') {
          // 過營業時間
          output = ObjectUtil.clone(fi000401_res_06);
        }
        break;
    }
    return output;
  }

}
