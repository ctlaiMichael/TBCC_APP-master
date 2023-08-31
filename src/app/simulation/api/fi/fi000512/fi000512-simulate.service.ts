/**
 * [模擬]基金轉換申請(一轉三)
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000512_res_01 } from './fi000512-res-01';

export class FI000512SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000512_res_01;

  }
}
