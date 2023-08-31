/**
 * [模擬]停損/獲利點設定
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000706_res_01 } from './fi000706-res-01';

export class FI000706SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000706_res_01;
  }

}
