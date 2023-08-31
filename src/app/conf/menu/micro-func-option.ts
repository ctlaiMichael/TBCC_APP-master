/**
 * 微交互功能設定
 */
const image_list = {
    'plus01': 'assets/images/plus01.png', // 資訊卡
    'plus02': 'assets/images/plus02.png', // 電腦
    'plus03': 'assets/images/plus03.png', // 氣球
    'plus04': 'assets/images/plus04.png', // 手機
    'home': 'assets/images/icons/micro/micro_home.png', // 首頁
    'deposit': 'assets/images/icons/micro/micro_deposit.png', // 存款查詢
    'deposit-overview': 'assets/images/icons/micro/micro_deposit_overview.png', // 台幣存款查詢
    'foreign-exchange': 'assets/images/icons/micro/micro_foreign_exchange.png', // 外匯業務
    'foreign-exchange-inquiry': 'assets/images/icons/micro/micro_foreign_inquiry.png', // 外幣存款查詢
    'forex-active': 'assets/images/icons/micro/micro_news.png', // 外匯優惠
    'transfer': 'assets/images/icons/micro/micro_transfer.png', // 轉帳服務
    'twd-transfer': 'assets/images/icons/micro/micro_twd-transfer.png', // 台幣轉帳
    'taxes-fees': 'assets/images/icons/micro/micro_bill.png', // 繳交各項費用稅款
    'news': 'assets/images/icons/micro/micro_news.png', // 最新消息
    'financial': 'assets/images/icons/micro/micro_financial.png', // 金融資訊
    'gold': 'assets/images/icons/micro/micro_gold.png', // 黃金存摺牌價查詢
    'exchange': 'assets/images/icons/micro/micro_exchange.png', // 外幣匯率
    'location': 'assets/images/icons/micro/micro_location.png', // 服務據點
    'front-desk': 'assets/images/icons/micro/micro_front_desk.png', // 線上櫃台
    'hospital': 'assets/images/icons/micro/micro_hospital.png', // 醫療服務
    'insurance': 'assets/images/icons/micro/micro_insurance.png', // 產壽險服務
    'epay': 'assets/images/epay/logo/ep7.png', // 合庫E Pay
    'card': 'assets/images/icons/micro/micro_card.png', // 信用卡
    'fund': 'assets/images/icons/micro/micro_fund.png', // 投資理財
    'robot': 'assets/images/icons/micro/micro_robot.png', // 智能客服
    'ticket': 'assets/images/icons/micro/micro_ticket.png' //  線上取號
};
export const MICRO_FUNC_OPTION = {
    // -------------------- [系統] -------------------- //
    'home': {
        id: 'home',
        image_path: image_list['home'],
        name: 'LEFT_MENU.HOME', // 首頁
        routing_path: 'home'
    }
    // --- 首頁-編輯 --- //
    // --- 其他 --- //
    // -------------------- [系統 End] -------------------- //
    // -------------------- [登入] -------------------- //
    // -------------------- [登入 End] -------------------- //


    // ======================================== 主要功能 ======================================== //
    // -------------------- [存款查詢] -------------------- //
    // 存款查詢
    , 'deposit': {
        name: 'FUNC.DEPOSIT',
        image_path: image_list['deposit'],
        url: 'deposit'
    }
    // 台幣存款查詢
    , 'deposit-overview': {
        name: 'FUNC_SUB.FOREX.OVERVIEW',
        image_path: image_list['deposit-overview'],
        url: 'deposit-overview'
    }
    // -------------------- [存款查詢 End] -------------------- //
    // -------------------- [外匯業務] -------------------- //
    // 外匯業務
    , 'foreign-exchange': {
        name: 'FUNC.FOREX',
        image_path: image_list['foreign-exchange'],
        url: 'foreign-exchange'
    }
    // 外幣存款查詢
    , 'foreign-exchange-inquiry': {
        name: 'FUNC_SUB.FOREX.OVERVIEW',
        image_path: image_list['foreign-exchange-inquiry'],
        url: 'foreign-exchange-inquiry'
    }
    // 外匯優惠(外連)
    , 'forex-active': {
        name: 'FUNC_SUB.FOREX.FOREX_ACTIVE',
        image_path: image_list['forex-active'],
        url: 'web:forex-active'
    }
    // -------------------- [外匯業務 End] -------------------- //
    // -------------------- [黃金存摺] -------------------- //
    // -------------------- [黃金存摺 End] -------------------- //
    // -------------------- [授信業務] -------------------- //
    // -------------------- [授信業務 End] -------------------- //
    // -------------------- [轉帳服務] -------------------- //
    // 轉帳服務
    , 'transfer': {
        name: 'FUNC.TRANSFER',
        image_path: image_list['transfer'],
        url: 'transfer'
    }
    // 台幣轉帳
    , 'twd-transfer': {
        name: 'FUNC_SUB.TRANSFER.TWD',
        image_path: image_list['twd-transfer'],
        url: 'twd-transfer'
    }
    // -------------------- [轉帳服務 End] -------------------- //
    // -------------------- [繳交各項費用稅款] -------------------- //
    , 'taxes-fees': {
        name: 'SLIDER_MENU.TAX', // 繳稅費
        image_path: image_list['taxes-fees'],
        url: 'taxes-fees'
    }
    // -------------------- [繳交各項費用稅款 End] -------------------- //
    // -------------------- [個人設定] -------------------- //

    // -------------------- [個人設定 End] -------------------- //

    // ======================================== 其他功能 ======================================== //
    // -------------------- [最新消息] -------------------- //
    , 'news': {
        name: 'FUNC.NEWS',
        image_path: image_list['news'],
        url: 'news'
    }
    // 最新消息
    // , 'news-board': {
    //     name: 'FUNC.NEWS',
    //     image_path: image_list['news'],
    //     url: 'news-board'
    // }
    // -------------------- [最新消息 End] -------------------- //
    // -------------------- [金融資訊] -------------------- //
    , 'financial': {
        name: 'FUNC.FINANCIAL',
        image_path: image_list['financial'],
        url: 'financial'
    }
    , 'gold': {
        name: 'FUNC_SUB.FINANCIAL.GOLD',  // 黃金存摺牌價查詢
        image_path: image_list['gold'],
        url: 'gold'
    }
    , 'exchange': {
        name: 'FUNC_SUB.FINANCIAL.FOREX',  // 外幣匯率
        image_path: image_list['exchange'],
        url: 'exchange'
    }
    // -------------------- [金融資訊 End] -------------------- //
    // -------------------- [服務據點] -------------------- //
    , 'locationkey': {
        'name': 'FUNC.LOCATION', // 服務據點
        image_path: image_list['location'],
        'url': 'locationkey'
    }
    // -------------------- [服務據點 End] -------------------- //
    // -------------------- [線上櫃台] -------------------- //
    , 'front-desk': {
        name: 'FUNC.FRONT_DESK',  // 線上櫃台
        image_path: image_list['front-desk'],
        url: 'front-desk'
    }
    // -------------------- [線上櫃台 End] -------------------- //


    // ======================================== 特殊專區 ======================================== //
    // -------------------- [醫療服務&產壽險服務] -------------------- //
    // 醫療服務
    , 'hospital': {
        name: 'FUNC_SUB.OTHER.HOSPITAL',
        image_path: image_list['hospital'],
        url: 'hospital'
    }
    // 產壽險服務
    , 'insurance': {
        name: 'FUNC_SUB.OTHER.INSURANCE',
        image_path: image_list['insurance'],
        url: 'insurance'
    }
    // -------------------- [醫療服務&產壽險服務 End] -------------------- //
    // -------------------- [合庫E Pay] -------------------- //
    , 'epay': {
        name: 'FUNC.EPAY',
        image_path: image_list['epay'],
        url: 'epay-scan'
    }
    // -------------------- [合庫E Pay End] -------------------- //
    // -------------------- [信用卡] -------------------- //
    , 'card': {
        name: 'FUNC.CREDIT_CARD',
        image_path: image_list['card'],
        url: 'web:card'
    }
    // -------------------- [信用卡 End] -------------------- //
    // -------------------- [投資理財] -------------------- //
    , 'fund': {
        name: 'FUNC.FUND',  // 投資理財
        image_path: image_list['fund'],
        url: 'fund'
    }
    , 'moneydj': {
        name: 'FUNC_SUB.OTHER.MONEYDJ',  // 理財金庫
        image_path: image_list['fund'],
        url: 'web:moneydj'
    }
    // -------------------- [投資理財 End] -------------------- //
    // -------------------- [其他鏈結] -------------------- //
    , 'robot': {
        name: 'FUNC_SUB.OTHER.ROBOT', // 智能客服
        image_path: image_list['robot'],
        url: 'web:robot'
    }
    , 'ticket': {
        name: 'FUNC_SUB.OTHER.OTN', // 線上取號
        image_path: image_list['ticket'],
        url: 'take-number'
    }
    // -------------------- [其他鏈結 End] -------------------- //
};
