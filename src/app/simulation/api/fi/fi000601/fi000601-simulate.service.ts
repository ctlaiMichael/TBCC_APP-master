/**
 * [模擬]定期(不)定額異動資料查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000601_res_01 } from './fi000601-res-01';
import { fi000601_res_02 } from './fi000601-res-02';
import { fi000601_res_03 } from './fi000601-res-03';
import { fi000601_res_04 } from './fi000601-res-04';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000601SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let set_data: any;

    /*
    *A: 全部
    *B: 單筆申購
    *C: 贖回
    *D: 轉換
    * */
    switch (reqObj['transType']) {
      case 'B':
        set_data = fi000601_res_02;
        break;
      case 'C':
        set_data = fi000601_res_03;
        break;
      case 'D':
        set_data = fi000601_res_04;
        break;
      default:
        set_data = fi000601_res_01;
        break;
    }


    const output_data = PaginatorSimlationUtil.getResponse(set_data, paginatedInfo, 'details.detail');
    return output_data;
  }

}
