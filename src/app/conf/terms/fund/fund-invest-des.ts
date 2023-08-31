/**
 *
 */
import { InfomationOptions } from "@base/popup/infomation-options";
import { FlagUtil } from "@shared/util/formate/view/flag-util";
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class FundInvestDes extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    currency_list?= [];
    constructor() {
        super();
        this.title = '投資金額說明';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {
        // const data_list = [
        //     { currency: 'USD', amount: '1000', add: '100' }
        //     , { currency: 'HKD', amount: '7900', add: '100' }
        //     , { currency: 'GBP', amount: '600', add: '100' }
        //     , { currency: 'AUD', amount: '1300', add: '100' }
        //     , { currency: 'SGD', amount: '1600', add: '100' }
        //     , { currency: 'CHF', amount: '1200', add: '100' }
        //     , { currency: 'CAD', amount: '1300', add: '100' }
        //     , { currency: 'JPY', amount: '106000', add: '100' }
        //     , { currency: 'SEK', amount: '7500', add: '100' }
        //     , { currency: 'NZD', amount: '1400', add: '100' }
        //     , { currency: 'EUR', amount: '2400', add: '100' }
        //     , { currency: 'ZAR', amount: '7000', add: '100' }

        // ];

        const data_list = [
            { currency: 'USD', amount: '500', add: '100' }
            , { currency: 'HKD', amount: '5000', add: '1000' }
            , { currency: 'GBP', amount: '500', add: '100' }
            , { currency: 'AUD', amount: '500', add: '100' }
            , { currency: 'SGD', amount: '500', add: '100' }
            , { currency: 'CHF', amount: '500', add: '100' }
            , { currency: 'CAD', amount: '500', add: '100' }
            , { currency: 'JPY', amount: '50000', add: '10000' }
            , { currency: 'SEK', amount: '5000', add: '1000' }
            , { currency: 'NZD', amount: '500', add: '100' }
            , { currency: 'EUR', amount: '500', add: '100' }
            , { currency: 'ZAR', amount: '5000', add: '1000' }
            , { currency: 'CNY', amount: '10000', add: '1000' }

        ];
        this.currency_list = data_list;

        // let show_html = [];
        // data_list.forEach(item => {
        //     let tmp_html = '<div class="table_four_hl_tr spot">';
        //     tmp_html += '<p class="table_four_hl_td">';
        //     tmp_html += '<i class="' + FlagUtil.transIconFlag(item.currency) + '"></i>';
        //     tmp_html += item.currency + '(' + FlagUtil.transIconFlag(item.currency, 'chineseName') + ')';
        //     tmp_html += '</p>';
        //     tmp_html += '<p class="table_four_hl_td">';
        //     tmp_html += AmountUtil.amount(item.amount, 'TWD');
        //     tmp_html += '元</p>';
        //     tmp_html += '<p class="table_four_hl_td">';
        //     tmp_html += AmountUtil.amount(item.add, 'TWD');
        //     tmp_html += '元</p>';
        //     // tmp_html += '    <p class="table_four_hl_th"></p>';
        //     tmp_html += '</div>';
        //     show_html.push(tmp_html);
        // });
    
        // this.content = `
        //     <p class="inner_content">
        //     1.新臺幣信託基金投資： 國外基金每筆最低3萬元；國內基金每筆最低1萬元，以萬元為累增單位。<br>
        //     2.外幣信託基金投資：<br>
        //     </p>

        //     <div class="table_four_hl">
		// 			<div class="table_four_hl_tr">
		// 				<p class="table_four_hl_th">幣別</p>
		// 				<p class="table_four_hl_th">
		// 					<i>每筆最低<br>申購金額</i>
        //                 </p>
		// 				<p class="table_four_hl_th">
		// 					<i>增加單位</i>
		// 				</p>
		// 				<p class="table_four_hl_th"></p>
		// 			</div>
        //             ` + show_html.join('') + `
        //         </div>
        //         <p class="inner_content">
        //         但本行、 基金公司或信託投資標的對申購最低金額，另有規定者，從其所定。<br>
        // </p>
        // `;


        //new
        let show_html = [];
        data_list.forEach(item => {
            let tmp_html = '<div class="table_four_hl_tr_form">';
            tmp_html += '<p class="table_four_hl_td_2">';
            tmp_html += '<i class="' + FlagUtil.transIconFlag(item.currency) + '"></i><br>';
            tmp_html += item.currency + '<br>' +'(' + FlagUtil.transIconFlag(item.currency, 'chineseName') + ')';
            tmp_html += '</p>';
            tmp_html += '<p class="table_four_hl_td_2 font_money_blu">';
            tmp_html += AmountUtil.amount(item.amount, 'TWD');
            tmp_html += '元</p>';
            tmp_html += '<p class="table_four_hl_td_2 font_money_blu">';
            tmp_html += AmountUtil.amount(item.add, 'TWD');
            tmp_html += '元</p>';
            // tmp_html += '    <p class="table_four_hl_th"></p>';
            tmp_html += '</div>';
            show_html.push(tmp_html);
        });
    
        this.content = `
            <p class="inner_content">
            1.新臺幣信託基金投資： 國外基金每筆最低3萬元；國內基金每筆最低1萬元，以萬元為累增單位。<br>
            2.外幣信託基金投資：<br>
            </p>

            <div class="table_four_hl_form">
					<div class="table_four_hl_tr_form">
						<p class="table_four_hl_th_form">幣別</p>
						<p class="table_four_hl_th_form">
							每筆最低<br>申購金額
                        </p>
						<p class="table_four_hl_th_form">
							增加單位
						</p>
					</div>
                    ` + show_html.join('') + `
                </div>
                <p class="inner_content">
                但本行、 基金公司或信託投資標的對申購最低金額，另有規定者，從其所定。<br>
        </p>
        `;
    }

};
