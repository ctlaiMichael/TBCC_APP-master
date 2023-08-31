/**
 *
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class GoldbuyDesc extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    currency_list?= [];
    constructor() {
        super();
        this._initData();
    }

    private _initData() {
        this.title = '說明';
        this.btnTitle = 'BTN.CHECK';

        const data_list = [
            { weight: '3', discount: '0.07' }
            , { weight: '6', discount: '0.09' }
            , { weight: '9', discount: '0.11' }
            , { weight: '12', discount: '0.13' }
            , { weight: '15', discount: '0.15' }
            , { weight: '18', discount: '0.17' }
            , { weight: '21', discount: '0.19' }
            , { weight: '24', discount: '0.21' }
            , { weight: '27', discount: '0.22' }
            , { weight: '30', discount: '0.23'}
            , { weight: '50', discount: '0.24' }
            , { weight: '100', discount: '0.25' }

        ];
        this.currency_list = data_list;

        let show_html = [];
        data_list.forEach(item => {
            let tmp_html = '<li class="table_row">';
            tmp_html += '<span>' + item.weight + '公斤(含)以上</span>';
            tmp_html += '<i>' + item.discount + '%</i>';
            tmp_html += '</li>';
            show_html.push(tmp_html);
        });

        this.content = `
            <div class="row_single">
				<p class="inner_content">
					本業務自交易時間，自每一營業日本行黃金存摺第一次掛牌起，至下午三時三十分止。<br>
					大批買進黃金存摺價格折讓標準表(一公斤1000公克)：
                    <ul class="table_info table_th_style">
                        <li class="table_row">
							<span>黃金存摺</span>
							<i>折讓率</i>
						</li>
                        ` + show_html.join('') + `
					</ul>
				</p>
			</div>
        `;
    }

}
