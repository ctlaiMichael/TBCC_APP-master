/**
 * [模擬]定期(不)定額異動資料查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000701_res_01 } from './fi000701-res-01';
import { fi000701_res_02 } from './fi000701-res-02';
import { fi000701_res_03 } from './fi000701-res-03';
import { fi000701_res_real } from './fi000701-res-real';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000701SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let set_data: any;
    let check_str = [];
    if (reqObj['unitType']) {
      check_str.push(reqObj['unitType']);
    }
    if (reqObj['investType']) {
      check_str.push(reqObj['investType']);
    }
    if (reqObj['filterFlag']) {
      check_str.push(reqObj['filterFlag']);
    }
    if (check_str.length > 0) {
      let find_key = check_str.join('_');
      if (typeof fi000701_res_real[find_key] != 'undefined') {
        set_data = fi000701_res_real[find_key];
      }
    }

    if (!set_data) {
      switch (reqObj['unitType']) {
        case 'A':
          set_data = fi000701_res_03;
          break;
        case 'N':
          set_data = fi000701_res_02;
          break;
        case 'Y':
        default:
          set_data = fi000701_res_01;
          break;
      }
    }

    const output_data = PaginatorSimlationUtil.getResponse(set_data, paginatedInfo, 'details.detail');
    return output_data;
  }

}
