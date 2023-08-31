/**
 * 微交互設定檔
 */
import { MICRO_FUNC_OPTION } from '@conf/menu/micro-func-option';
const image_list = {
    'plus01': 'assets/images/plus01.png', // 資訊卡
    'plus02': 'assets/images/plus02.png', // 電腦
    'plus03': 'assets/images/plus03.png', // 氣球
    'plus04': 'assets/images/plus04.png', // 手機
};
// 功能設定
const setFunc = (func_id, image_path?: string) => {
    let output = {
        // id: '',
        image_path: '',
        name: '',
        routing_path: ''
    };
    let micro_set: any;
    if (MICRO_FUNC_OPTION.hasOwnProperty(func_id) && MICRO_FUNC_OPTION[func_id]) {
        micro_set = MICRO_FUNC_OPTION[func_id];
    } else {
        func_id = 'home';
        micro_set = MICRO_FUNC_OPTION[func_id]; // default
    }
    // output.id = func_id;
    output.image_path = micro_set.image_path;
    output.name = micro_set.name;
    output.routing_path = micro_set.url;
    if (typeof image_path !== 'undefined' && image_path !== '') {
        output.image_path = image_path;
    }

    return output;
};

// tslint:disable-next-line: class-name
export const microInteractionOptions = {
    // 首頁
    default: [
        // 理財金庫
        setFunc('moneydj'),
        // 信用卡
        setFunc('card'),
        // 金融資訊
        setFunc('financial'),
        // epay
        setFunc('epay')
    ]
    // 最新消息
    , news: [
        // 金融資訊
        setFunc('financial'),
        // epay
        setFunc('epay'),
        // 信用卡
        setFunc('card'),
        // 投資理財
        setFunc('fund')
    ]
    // 存款查詢
    , deposit: [
        // 台幣轉帳
        setFunc('twd-transfer'),
        // 信用卡
        setFunc('card'),
        // 金融資訊
        setFunc('financial'),
        // 投資理財
        setFunc('fund')
    ]
    // 外匯業務
    , forex: [
        // 存款查詢
        setFunc('deposit'),
        // 轉帳服務
        setFunc('transfer'),
        // 金融資訊
        setFunc('financial'),
        // 外匯優惠
        setFunc('forex-active')
    ]
    // 轉帳服務
    , transfer: [
        // epay
        setFunc('epay'),
        // 存款查詢
        setFunc('deposit'),
        // 金融資訊
        setFunc('financial'),
        // 繳交各項費用稅款
        setFunc('taxes-fees'),
    ]
    // 繳交各項費用稅款
    , 'taxes-fees': [
        // 醫療服務
        setFunc('hospital'),
        // 產壽險服務
        setFunc('insurance'),
        // 信用卡
        setFunc('card'),
        // 轉帳服務
        setFunc('transfer')
    ]
    // 投資理財
    , fund: [
        // 線上櫃台
        setFunc('front-desk'),
        // 外匯業務
        setFunc('foreign-exchange'),
        // 金融資訊
        setFunc('financial'),
        // 存款查詢
        setFunc('deposit')
    ]
    // 金融資訊
    , financial: [
        // 線上櫃台
        setFunc('front-desk'),
        // 外匯業務
        setFunc('foreign-exchange'),
        // 投資理財
        setFunc('fund'),
        // 台幣轉帳
        setFunc('twd-transfer')
    ]
    // 醫療服務
    , hospital: [
        // 產壽險服務
        setFunc('insurance'),
        // 繳稅費
        setFunc('taxes-fees'),
        // 信用卡
        setFunc('card'),
        // 轉帳服務
        setFunc('transfer')
    ]
    // 產壽險服務
    , insurance: [
        // 醫療服務
        setFunc('hospital'),
        // 繳稅費
        setFunc('taxes-fees'),
        // 信用卡
        setFunc('card'),
        // 轉帳服務
        setFunc('transfer')
    ]
    // 授信
    , credit: [
        // epay
        setFunc('epay'),
        // 存款查詢
        setFunc('deposit'),
        // 轉帳服務
        setFunc('transfer'),
        // 產壽險服務
        setFunc('insurance')
    ]
    // 合庫epay
    , epay: [
        // 存款查詢
        setFunc('deposit'),
        // 台幣轉帳
        setFunc('twd-transfer'),
        // 信用卡
        setFunc('card'),
        // 繳稅費
        setFunc('taxes-fees')
    ]
    // 服務據點
    , location: [
        // 線上櫃台
        setFunc('front-desk'),
        // 智能客服
        setFunc('robot'),
        // 線上取號
        setFunc('ticket'),
        // 最新消息
        setFunc('news')
    ]
    // 線上櫃台
    , 'front-desk': [
        // 投資理財
        setFunc('fund'),
        // 金融資訊
        setFunc('financial'),
        // 存款查詢
        setFunc('deposit'),
        // epay
        setFunc('epay')
    ]
    // 個人設定
    , 'user-set':[
        // 服務據點
        setFunc('locationkey'),
        // 線上櫃台
        setFunc('front-desk'),
        // 存款查詢
        setFunc('deposit'),
        // epay
        setFunc('epay')
    ]

};
