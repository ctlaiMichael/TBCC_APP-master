/**
 * [模擬]基金轉換確認
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000508_res_01 } from './fi000508-res-01';

export class FI000508SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000508_res_01;

  }
}
