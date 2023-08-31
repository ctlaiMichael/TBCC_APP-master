/**
 * [模擬]停損/獲利點設定查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000705_res_01 } from './fi000705-res-01';

export class FI000705SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000705_res_01;
  }

}
