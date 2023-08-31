
import { f9000201_res_01 } from './f9000201-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';


export class F9000201SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
      const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
      let output_data = PaginatorSimlationUtil.getResponse(f9000201_res_01, paginatedInfo, 'details.detail');
      return output_data;
  }

}
