import { SimulationApi } from '@api-simulation/simulation-api';
import { f9000502_res_01 } from './f9000502-res-01';

export class F9000502SimulateService implements SimulationApi {

	/** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
	public getResponse(reqObj) {

		return f9000502_res_01;
	}

}
