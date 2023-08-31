/**
 * [模擬]基金轉換申請
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000507_res_01 } from './fi000507-res-01';

export class FI000507SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000507_res_01;

  }
}
