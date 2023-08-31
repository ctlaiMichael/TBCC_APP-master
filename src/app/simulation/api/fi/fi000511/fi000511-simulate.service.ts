/**
 * [模擬]基金轉換申請(一轉三)
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000511_res_01 } from './fi000511-res-01';

export class FI000511SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000511_res_01;

  }
}
