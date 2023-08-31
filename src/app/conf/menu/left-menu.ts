export const LEFT_MENU = [
    {
        name: 'LEFT_MENU.HOME', // 首頁
        icon: 'icon_main',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'home', // 對映routing-path
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.NEWS', // 最新消息
        icon: 'icon_news',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'news',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.EPAY', // 合庫E Pay
        icon: 'icon_epay menu_icon_epay',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        // url: 'web:epay',
        url: 'epay-scan',
        url_params: {}
    }, {
        name: 'LEFT_MENU.DEPOSIT', // 存款查詢
        icon: 'icon_deposit',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'deposit',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.TRANSFER', // 轉帳服務
        icon: 'icon_exchange',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'transfer',
        url_params: {}
    }
    // 無卡提款
    , {
      name: 'LEFT_MENU.CARDLESS', // 無卡提款
      icon: 'icon_nocard',
      hasSubMenu: true,
      enabled: true,
      display_role: false,
      url: 'nocard',
      url_params: {}
    }
    , {
        name: 'LEFT_MENU.CREDIT_CARD', // 信用卡
        icon: 'icon_card',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        // url: 'card',
        url: 'web:card',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.FOREIGN_EXCHANGE', // 外匯業務
        icon: 'icon_foreign',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'foreign-exchange',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.INVESTMENT', // 投資理財
        icon: 'icon_fund',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'fund',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.CREDIT', // 授信業務
        icon: 'icon_loan',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'credit',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.LOAN', // 線上申貸
        icon: 'icon_infor',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'online-loan',
        url_params: {}
    }
    // 第二階段功能，暫時關閉
    , {
        name: 'LEFT_MENU.GOLD', // 黃金存摺
        icon: 'icon_gold',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'gold-business',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.TAX', // 繳交各項費用稅款
        icon: 'icon_bill',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'taxes-fees',
        url_params: {}
    }

    , {
        name: 'LEFT_MENU.USER_SET', // 個人設定(整合安控管理&其他服務)
        icon: 'icon_set',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'user-set',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.FINANCIAL', // 金融資訊
        icon: 'icon_financial',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'financial',
        url_params: {}
    }
     //2019/11/11 新增
     , {
        name: 'LEFT_MENU.MSG_OVERVIEW', // 訊息總覽
        icon: 'icon_financial',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'msg-overview',
        url_params: {}
    }
    // 5/8 移至其他服務
    , {
        name: 'FUNC.OTHER', // 其他服務
        icon: 'icon_othifo',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'other-service',
        url_params: {}
    }
    //2019/09/24 新增
    , {
        name: '線上櫃檯', // 線上櫃檯
        icon: 'icon_infor',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'front-desk',
        url_params: {}
    }

];


// 以下為選單設定檔暫存
    /*
    // 5/2 確認整併到個人設定
    // , {
    //     name: 'LEFT_MENU.SECURITY', // 安控管理
    //     icon: 'icon_safe',
    //     hasSubMenu: true,
    //     enabled: true,
    //     display_role: false,
    //     url: 'security',
    //     url_params: {}
    // }
    // , {
    //     name: 'LEFT_MENU.OTHER', // 其他服務
    //     icon: 'icon_user',
    //     hasSubMenu: true,
    //     enabled: true,
    //     display_role: false,
    //     url: 'user-set',
    //     url_params: {}
    // }
    // 5/8 移至其他服務
    , {
        name: 'LEFT_MENU.MEDICAL', // 醫療服務
        icon: 'icon_hospital',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'hospital',
        url_params: {}
    }, {
        name: 'LEFT_MENU.INSURANCE', // 產壽險服務
        icon: 'icon_protection',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'insurance',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.LOCATION', // 服務據點
        icon: 'icon_location',
        enabled: true,
        display_role: false,
        url: 'locationkey',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.TREASURY', // 理財金庫
        icon: 'icon_mgt',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'web:moneydj',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.CUSTOMER_SERVICE', // 智能客服
        icon: 'icon_service',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'web:robot',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.STOCK', // 下單開戶
        icon: 'icon_buy',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'web:luckydraw',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.TICKET', // 線上取號
        icon: 'icon_ticket',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'take-number',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.INVOICE', // 雲端發票
        icon: 'icon_cloud',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'web:einvoice',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.HCE', // HCE
        icon: 'icon_hce',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'app:hce',
        url_params: {}
    }
    // , {
    //     name: 'LEFT_MENU.LIFE', // 生活資訊  [20190508 需求單移除]
    //     icon: 'icon_life',
    //     hasSubMenu: false,
    //     enabled: true,
    //     display_role: false,
    //     url: 'web:mWebEasyInfo',
    //     url_params: {}
    // }
    , {
        name: 'MAIN_MENU.ONLINE_INSURANCE', // 網路預約投保
        icon: 'icon_insurance',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'web:onlineInsurance',
        url_params: {}
    }
    // */

