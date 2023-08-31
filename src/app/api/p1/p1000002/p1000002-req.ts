import { ReqBody } from '@base/api/model/req-body';

export class P1000002ReqBody extends ReqBody {
	custId = '';           // 身分證字號
	editType = ''; // 新增:add、修改:edit、刪除:del、查詢:qry
	id = ''; // 修改、刪除時要帶值
	currency = ''; // 幣別列表可從fb000201取得
	type = ''; // 外幣換台幣: ForeignExchange	台幣換外幣: TWDExchange 
	exchangeType = ''; // 即期: PROMPT 	現鈔: CASH
	condition = ''; // 大於: Big  小於: Small
	exchange = ''; // 匯率:	例如: 31.11
	frequency = ''; // 通之1次: OnlyOnce	每營業日: BusinessOnce
	constructor() {
		super();
	}
}
