
/**
 * [模擬]我的金庫查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { f2000501_res_01, f2000501_res_real, f2000501_res_error } from './f2000501-res-01';

export class F2000501SimulateService implements SimulationApi {

  public getResponse(reqObj) {

    // let output_data = f2000501_res_01;

    // let output_data = f2000501_res_real;
    let output_data = f2000501_res_error;

    return output_data;
  }

}
