/**
 * [模擬]基金預約單筆申購申請
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000405_res_01 } from './fi000405-res-01';

export class FI000405SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000405_res_01;

  }
}
