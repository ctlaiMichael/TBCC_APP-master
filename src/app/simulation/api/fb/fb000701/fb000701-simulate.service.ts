
import { fb000701_res_01 } from './fb000701-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { DateUtil } from '@shared/util/formate/date/date-util';

export class FB000701SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };

    let output = ObjectUtil.clone(fb000701_res_01);
    let now_time = DateUtil.transDate('NOW_TIME', 'object');
    output.MNBResponse.result.goldRateDate = [(now_time.data.year - 1911), now_time.data.month, now_time.data.day].join('');
    output.MNBResponse.result.goldRateTime = [now_time.data.hour, now_time.data.min, now_time.data.sec].join('');

    return output;
  }

}
