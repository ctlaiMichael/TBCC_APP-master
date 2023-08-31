/**
 * [模擬]贖回轉換約定帳號查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000502_res_01, fi000502_res_02 } from './fi000502-res-01';

export class FI000502SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    if (reqObj.trnsType == '1') {
      return fi000502_res_01;
    } else {
      return fi000502_res_02;
    }
  }
}
