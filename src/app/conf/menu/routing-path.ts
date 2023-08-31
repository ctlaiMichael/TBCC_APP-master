export const ROUTING_PATH = {
    // -------------------- [系統] -------------------- //
    // --- 首頁 --- //
    '': {
        'url': 'home',
        'header': {
            'style': 'login',
            'leftBtnIcon': ''
        }
    },
    'home': {
        'url': 'home',
        'header': {
            'style': 'login',
            'leftBtnIcon': ''
        }
    },
    'user-home': {
        'url': '/home/user-home',
        'preInit': false, // 會出錯
        'header': {
            'style': 'user_home',
            'leftBtnIcon': 'menu',
            'showMainInfo': true,
            'rightBtnIcon': 'nav_right_edit_button'
        }
        , 'micro': 'default' // 是否顯示微交互
    },
    // --- 首頁-編輯 --- //
    'edit_mainBlock': {
        'url': '/edit/edit_mainBlock',
        'header': {
            'style': 'normal',
            'title': '編輯版面',  // 編輯版面',
            'backPath': 'user-home'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'edit_hotKey': {
        'url': '/edit/edit_hotKey',
        'header': {
            'style': 'normal',
            'title': '編輯版面',  // 編輯版面',
            'backPath': 'user-home'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'edit_hotKey_list': {
        'url': '/edit/edit_hotKey_list',
        'header': {
            'style': 'normal',
            'title': '編輯版面',  // 編輯版面',
            'backPath': 'user-home'
        }
    },
    'edit_slider': {
        'url': '/edit/edit_slider',
        'header': {
            'style': 'normal',
            'title': '編輯版面',  // 編輯版面',
            'backPath': 'user-home'
        }
    },
    'edit_slider_list': {
        'url': '/edit/edit_slider_list',
        'header': {
            'style': 'normal',
            'title': '我的快捷',  // 我的快捷',
        }
    },
    // --- 其他 --- //
    'result': {
        'url': '/result/resultError',
        'header': {
            'style': 'result',
            'leftBtnIcon': ''
        }
    },
    // --- 導覽頁 --- //
    'guide': {
        'url': '/layout/guide',
        'header': {
            'style': 'normal',
            'leftBtnIcon': 'menu'
        }
    },
    // -------------------- [系統 End] -------------------- //
    // -------------------- [登入] -------------------- //
    'login': {
        'url': '/login/1',
        'header': {
            'style': 'login',
            'leftBtnIcon': '',
            'rightSecBtn': 'noshow'
        }
    },
    // -------------------- [登入 End] -------------------- //

    // ======================================== 主要功能 ======================================== //
    // -------------------- [存款查詢] -------------------- //
    'deposit': {
        'url': 'deposit/menu',
        'header': {
            'title': 'FUNC.DEPOSIT'  // 存款查詢'
            , 'leftBtnIcon': 'menu'
            , 'style': 'normal'
        }
        // , 'micro': 'deposit' // 是否顯示微交互
    },
    'user-asset': {
        'url': '/deposit/user-asset',
        'header': {
            'style': 'normal',
            'leftBtnIcon': 'back',
            'title': 'FUNC_SUB.DEPOSIT.SUMMARY',  // 帳務總覽',
        }
        , 'micro': 'deposit' // 是否顯示微交互
    },
    'deposit-overview': {
        'url': 'deposit/overview',
        // 'preInit': true,
        'header': {
            'title': 'FUNC_SUB.DEPOSIT.OVERVIEW'  // 台幣存款總覽'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'deposit' // 是否顯示微交互
    },
    'deposit-insufficient-bill': {
        'url': 'deposit/insufficient-bill',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.DEPOSIT.INSUFFICIENT'  // 存款不足票據查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'deposit' // 是否顯示微交互
    },
    'deposit-day-remittance': {
        'url': 'deposit/day-remittance',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.DEPOSIT.DAY_REMITTANCE'  // 當日匯入匯款查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'deposit' // 是否顯示微交互
    },
    // -------------------- [存款查詢 End] -------------------- //
    // -------------------- [外匯業務] -------------------- //
    'foreign-exchange': {
        'url': 'foreign-exchange/menu',
        'header': {
            'title': 'FUNC.FOREX'  // 外匯業務'
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'forex' // 是否顯示微交互
    },
    'foreign-exchange-inquiry': {
        'url': 'foreign-exchange/deposit/list',
        // 'preInit': true,
        'header': {
            'title': 'FUNC_SUB.FOREX.OVERVIEW'  // 外幣存款查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'forex' // 是否顯示微交互
    },
    'transfer-twd-to-foreign': {
        'url': 'foreign-exchange/twd-to-foreign/main',
        'preInit': false,
        'urlParams': {
            'type': 'transfer'
        },
        'header': {
            'title': 'FUNC_SUB.FOREX.TWD_TO_FOREX'  // 台幣轉外幣(轉帳服務進入)
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190613 國外部說編輯頁不顯示微交互
        // , 'micro': 'forex' // 是否顯示微交互
    },
    'foreign-exchange-twd-to-foreign': {
        'url': 'foreign-exchange/twd-to-foreign/main',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FOREX.TWD_TO_FOREX'  // 台幣轉外幣'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190613 國外部說編輯頁不顯示微交互
        // , 'micro': 'forex' // 是否顯示微交互
    },
    'transfer-foreign-to-twd': {
        'url': 'foreign-exchange/foreign-to-twd/main',
        'preInit': false,
        'urlParams': {
            'type': 'transfer'
        },
        'header': {
            'title': 'FUNC_SUB.FOREX.FOREX_TO_TWD'  // 外幣轉台幣(轉帳服務進入)'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190613 國外部說編輯頁不顯示微交互
        // , 'micro': 'forex' // 是否顯示微交互
    },
    'foreign-exchange-foreign-to-twd': {
        'url': 'foreign-exchange/foreign-to-twd/main',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FOREX.FOREX_TO_TWD'  // 外幣轉台幣'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190613 國外部說編輯頁不顯示微交互
        // , 'micro': 'forex' // 是否顯示微交互
    },
    'foreign-exchange-foreign-to-foreign': {
        'url': 'foreign-exchange/foreign-to-foreign/main',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FOREX.FOREX_TO_FOREX'  // 外幣存款轉帳'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190613 國外部說編輯頁不顯示微交互
        // , 'micro': 'forex' // 是否顯示微交互
    },
    'foreign-exchange-demand-to-time': {
        'url': 'foreign-exchange/demand-to-time/edit',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FOREX.TO_TIME'  // 綜活存轉綜定存'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190613 國外部說編輯頁不顯示微交互
        // , 'micro': 'forex' // 是否顯示微交互
    },
    'foreign-exchange-time-deposit-terminate': {
        'url': 'foreign-exchange/time-deposit-terminate/edit',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FOREX.RELEASE'  // 綜定存中途解約'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190613 國外部說編輯頁不顯示微交互
        // , 'micro': 'forex' // 是否顯示微交互
    },
    'foreign-exchange-reservation-inquiry': {
        'url': 'foreign-exchange/reservation-inquiry/reservation-inquiry',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FOREX.RESERVE'  // 預約外幣轉帳查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'forex' // 是否顯示微交互
    },
    // js 轉 angular4(失敗)
    // 'foreign-exchange-insurance': {
    //     'url': 'foreign-exchange/insurance/edit',
    //     'preInit': false,
    //     'header': {
    //         'title': 'FUNC_SUB.FOREX.INSURANCE'  // 外幣繳保費'
    //         , 'leftBtnIcon': 'back'
    //         // , 'rightBtnIcon': ''
    //         // , 'backPath': ''
    //         , 'style': 'normal'
    //     }
    //     // 20190613 國外部說編輯頁不顯示微交互
    //     // , 'micro': 'forex' // 是否顯示微交互
    // },
    'foreign-insurance-pay': {
        'url': 'foreign-exchange/foreign-insurance-pay/foreign-insurance-pay',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FOREX.INSURANCE'  // 外幣繳保費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190613 國外部說編輯頁不顯示微交互
        // , 'micro': 'forex' // 是否顯示微交互
    },
    'foreign-exchange-personal-quota': {
        'url': 'foreign-exchange/personal-quota/personal-quota',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FOREX.QUOTA'  // 累計結匯查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // , 'micro': 'forex' // 是否顯示微交互
    },
    // angularJS 舊的
    'web:fund-forex': {
        'url': 'web:fund-forex',
        'header': {
            'title': 'FUNC_SUB.FOREX.INSURANCE'  // 外幣繳保費'
        }
    },
    // -------------------- [外匯業務 End] -------------------- //
    // -------------------- [黃金存摺] -------------------- //
    'gold-business': {
        'url': '/gold-business/menu',
        'header': {
            'title': 'FUNC.GOLD'  // 黃金存摺'
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // , 'micro': 'glod' // 是否顯示微交互
    },
    'gold-detail': {
        'url': '/gold-business/gold-detail',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.GOLD.OVERVIEW'  // 黃金交易明細查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // , 'micro': 'glod' // 是否顯示微交互
    },
    'gold-apply': {
        'url': '/gold-business/activation',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.GOLD.APPLY'  // 黃金存摺申請啟用
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'gold-buy': {
        'url': '/gold-business/gold-buy',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.GOLD.BUY'  // 黃金買進
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'gold-sell': { // 黃金回售
        'url': '/gold-business/gold-sell',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.GOLD.SELL'  // 黃金回售
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'gold-terms': {
        'url': '/gold-business/goldterms',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.GOLD.TERMS'  // 黃金定期定額買進變更/終止
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'goldList': {
        'url': '/gold-business/gold-detail/goldList',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.GOLD.LISTOVERVIEW'  // 交易明細
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'goldListPrice': {
        'url': '/gold-business/goldListPrice',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FINANCIAL.GOLD'  // 黃金存摺牌價
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },

    // -------------------- [黃金存摺 End] -------------------- //
    // -------------------- [授信業務] -------------------- //
    'credit': {
        'url': 'credit/menu',
        'preInit': false,
        'header': {
            'title': 'FUNC.CREDIT'  // 授信業務'
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // , 'micro': 'credit' // 是否顯示微交互
    },
    'credit-inquiry': {
        'url': 'credit/inquiry',
        'preInit': true,
        'header': {
            'title': 'FUNC_SUB.CREDIT.INQUIRY'  // 借款查詢
            , 'leftBtnIcon': 'back'
            , 'style': 'normal'
        }
        , 'micro': 'credit' // 是否顯示微交互
    },
    'credit-payment': {
        'url': 'credit/payment',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.CREDIT.PAYMENT'  // 繳納借款本息
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'credit' // 是否顯示微交互
    },
    // -------------------- [授信業務 End] -------------------- //
    // -------------------- [轉帳服務] -------------------- //
    'transfer': {
        'url': '/transfer/menu',
        'header': {
            'title': 'FUNC.TRANSFER'  // 轉帳服務'
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'transfer' // 是否顯示微交互
    },
    'twd-transfer': {
        'url': '/transfer/twd-transfer',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TRANSFER.TWD'  // 台幣轉帳'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部表示編輯業不出現微交互
        // , 'micro': 'transfer' // 是否顯示微交互
    },
    'reservation-search-writeoff': {
        'url': '/transfer/reservation-search-writeoff',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TRANSFER.RESERVE'  // 預約轉帳查詢及註銷'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部表示編輯業不出現微交互
        // , 'micro': 'transfer' // 是否顯示微交互
    },
    'current-to-fixed': {
        'url': '/transfer/current-to-fixed',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TRANSFER.TO_TIME'  // 綜活存轉綜定存'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部表示編輯業不出現微交互
        // , 'micro': 'transfer' // 是否顯示微交互
    },
    'fixed-release': {
        'url': '/transfer/fixed-release',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TRANSFER.RELEASE'  // 綜定存中途解約'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部表示編輯業不出現微交互
        // , 'micro': 'transfer' // 是否顯示微交互
    },
    // e-Bill全國繳費網
    'web:ebill': {
        'url': 'web:ebill',
        'header': {
            'title': 'FUNC_SUB.TAX.EBILL'  // e-Bill全國繳費網'
        }
    },
    // -------------------- [轉帳服務 End] -------------------- //
    // -------------------- [繳交各項費用稅款] -------------------- //
    'taxes-fees': {
        'url': '/taxes-fees/menu',
        'header': {
            'title': 'FUNC.TAX'  // 繳交各項費用稅款'
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說第二層選單顯示微交互
        , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'taxes': {
        'url': '/taxes-fees/taxes',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TAX.TAX'  // 各類稅費款'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'hinet-fee': {
        'url': '/taxes-fees/hinet-fee',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TAX.HINET'  // 中華電信費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'water': {
        'url': '/taxes-fees/water',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TAX.WATER'  // 台灣自來水費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'taipei-water': {
        'url': '/taxes-fees/taipei-water',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TAX.TAIPEI_WATER'  // 臺北自來水費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'electricity': {
        'url': '/taxes-fees/electricity',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TAX.ELECT'  // 電費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'health-insurance': {
        'url': '/taxes-fees/labor-health-national',
        'preInit': false,
        'urlParams': {
            'type': 'health'
        },
        'header': {
            'title': 'FUNC_SUB.TAX.HEALTH'  // 健保費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'labor-insurance': {
        'url': '/taxes-fees/labor-health-national',
        'preInit': false,
        'urlParams': {
            'type': 'labor'
        },
        'header': {
            'title': 'FUNC_SUB.TAX.LABOR'  // 勞保費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'national-annuity': {
        'url': '/taxes-fees/labor-health-national',
        'preInit': false,
        'urlParams': {
            'type': 'national'
        },
        'header': {
            'title': 'FUNC_SUB.TAX.NATIONAL'  // 國民年金保費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'tuition': {
        'url': '/taxes-fees/tuition',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.TAX.TUITION'  // 學費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    'fuel-fee': {
        'url': '/taxes-fees/taxes',
        'preInit': false,
        'urlParams': {
            'type': 'fuel-fee'
        },
        'header': {
            'title': 'FUNC_SUB.TAX.FUEL'  // 汽機車燃料使用費'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // 20190703 業發部說編輯頁不顯示微交互
        // , 'micro': 'taxes-fees' // 是否顯示微交互
    },
    // -------------------- [繳交各項費用稅款 End] -------------------- //
    // -------------------- [無卡提款] -------------------- //
    // 無卡提款首頁
    'nocard': {
        'url': '/nocard/menu',
        'header': {
            'title': 'FUNC.CARDLESS',
            'leftBtnIcon': 'menu'
        },
        // 'micro': 'nocardmenukey' // 是否顯示微交互
    },
    // 預約無卡提款
    'nocardreservationkey': {
        'url': '/nocard/nocard-transaction-reservation',
        'header': {
            'title': 'FUNC_SUB.CARDLESS.RESERVE_TRANS',
            'leftBtnIcon': 'back'
        }
    },
    // 交易紀錄查詢
    'nocardrecordkey': {
        'url': '/nocard/nocard-transaction-record',
        'header': {
            'title': 'FUNC_SUB.CARDLESS.SEARCH_TRANS',
            'leftBtnIcon': 'back'
        }
    },
    // 交易紀錄查詢-交易明細
    'nocarddetailrecordkey': {
        'url': '/nocard/nocard-transaction-detail',
        'header': {
            'title': 'FUNC_SUB.CARDLESS.SEARCH_DETAIL',
            'leftBtnIcon': 'back'
        }
    },
    // 無卡提款帳號設定
    'nocardagreementkey': {
        'url': '/nocard/nocard-setting',
        'header': {
            'title': 'FUNC_SUB.CARDLESS.ACCOUNT_SET',
            'leftBtnIcon': 'back'
        },
    },
    // 無卡提款帳號設定-新增/刪除帳號
    'nocardaddaccountkey': {
        'url': '/nocard/nocardaddaccountkey',
        'header': {
            'title': 'FUNC_SUB.CARDLESS.ACCOUNT_SET',
            'leftBtnIcon': 'back'
        },
    },
    // 無卡提款帳號設定-確認新增帳號
    'nocardconfirmaccountkey': {
        'url': '/nocard/nocardconfirmaccountkey',
        'header': {
            'title': 'FUNC_SUB.CARDLESS.ACCOUNT_SET',
            'leftBtnIcon': 'back'
        },
    },
    // 無卡提款帳號設定-結果
    'nocardresultkey': {
        'url': '/nocard/nocardresultkey',
        'header': {
            'title': 'FUNC_SUB.CARDLESS.ACCOUNT_SET',
            'leftBtnIcon': 'menu'
        },
    },

    // -------------------- [無卡提款 End] -------------------- //
    // -------------------- [個人設定] -------------------- //
    'user-set': {
        'url': '/user-set/menu',
        'header': {
            'title': 'MAIN_MENU.USER_SET'  // MAIN_MENU.USER_SET'
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'security': {
        // 此設定避免有殘存code，做的處理。若無問題請移除
        // 'url': '/security/menu',
        'url': '/user-set/menu', // 5/2 與其他服務整合
        'header': {
            'title': 'MAIN_MENU.USER_SET'  // MAIN_MENU.USER_SET'
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'security_ftlogin_agree': {
        'url': '/security/agree',
        'header': {
            'title': 'FUNC_SUB.USER_SET.BIOMETIC',  // 快速登入/交易設定'
            'backPath': 'user-set'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'security_ftlogin_set': {
        'url': '/security/ftloginset',
        'header': {
            'title': 'FUNC_SUB.USER_SET.BIOMETIC',  // 快速登入/交易設定',
            'backPath': 'user-set',
            'style': 'normal'
        }
        // , 'micro': 'user-set' // 是否顯示微交互
    },
    'epay_security_ftlogin_set': {
        'url': '/security/ftloginset',
        'urlParams': {
            'type': 'epay'
        },
        'header': {
            'title': 'FUNC_SUB.USER_SET.BIOMETIC',  // 快速登入/交易設定 EPAY進入',
            'backPath': 'user-set',
            'style': 'normal'
        }
        // , 'micro': 'user-set' // 是否顯示微交互
    },
    'security_patternlock_preface': { // 圖形鎖 - 同意條款
        'url': '/security/pattern-lock/preface',
        'header': {
            'title': 'FUNC_SUB.USER_SET.BIOMETIC',  // 快速登入/交易設定',
            'backPath': 'user-set'
        }
        // , 'micro': 'user-set' // 是否顯示微交互
    },
    'security_patternlock_set': { // 圖形鎖 - 設定圖形鎖
        'url': '/security/pattern-lock/setting',
        'header': {
            'title': 'FUNC_SUB.USER_SET.FTLOGIN',  // 快速登入',
            'backPath': 'security_ftlogin_set'
        }
        // , 'micro': 'user-set' // 是否顯示微交互
    },
    'certificateApplication': {
        'url': '/security/certificateApplication',
        'header': {
            'title': 'FUNC_SUB.USER_SET.TRANS_CA'  // 憑證服務'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'certificateService': {
        'url': '/security/certificateService',
        'header': {
            'title': 'FUNC_SUB.USER_SET.TRANS_CA',  // 憑證服務'
            'backPath': 'user-set'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'certificateChangepwd': {
        'url': '/security/certificateChangepwd',
        'header': {
            'title': 'FUNC_SUB.USER_SET.TRANS_CA_PSWD'  // 憑證保護密碼變更'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'certificateChange': {
        'url': '/security/certificateChange',
        'header': {
            'title': 'FUNC_SUB.USER_SET.TRANS_CA_PAY'  // 憑證到期繳費'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'certificateConfirm': {
        'url': '/security/certificateConfirm',
        'header': {
            'title': 'FUNC_SUB.USER_SET.TRANS_CA_PAY'  // 憑證到期繳費'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'certificateResult': {
        'url': '/security/certificateResult',
        'header': {
            'title': '繳費結果'  // 繳費結果'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'otp-service': {
        'url': '/security/otp-service',
        'header': {
            'title': 'FUNC_SUB.USER_SET.TRANS_OTP'  // OTP服務'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'device-bind': {
        'url': '/security/device-bind',
        'urlParams': {
            'type': '0'
        },
        'header': {
            'title': 'FUNC_SUB.USER_SET.TRANS_DEVICE'  // 裝置綁定服務
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    // 登入裝置綁定服務處理
    'device-bind-start': {
        'url': '/security/device-bind',
        'urlParams': {
            'type': '1'
        },
        'header': {
            'title': 'FUNC_SUB.USER_SET.TRANS_DEVICE_START'  // 首次登入裝置認證
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'systemInfo': {
        'url': '/security/systemInfo',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.SYSTEM'  // 系統資訊'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'netPwdChg': {
        'url': '/user-set/netPwdChg',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.USER_PSWD'  // 網路連線密碼變更'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'netCodeChg': {
        'url': '/user-set/netCodeChg',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.USER_ID'  // 網路連線代號變更'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'addressChg': {
        'url': '/user-set/addressChg',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.USER_ADDRE'  // 通訊地址變更'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'mailChg': {
        'url': '/user-set/mailChg',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.USER_EMAIL'  // E-mail變更'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'commonAccount': {
        'url': '/user-set/commonAccount',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.COMM_ACNT'  // 常用帳號設定'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'agreedAccount': {
        'url': '/user-set/agreedAccount',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.AGREED_ACNT'  // 約定轉入帳號設定'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'sslChg': {
        'url': '/user-set/sslChg/sslChg',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.TRANS_SSL'  // SSL轉帳密碼變更'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'statementMenu': {
        'url': '/user-set/statementMenu/statementMenu',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.USER_BILL'  // 綜合對帳單服務'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // , 'micro': 'user-set' // 是否顯示微交互
    },
    'statementEdit': {
        'url': '/user-set/statementMenu/statementEdit',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.USER_BILL'  // 綜合對帳單服務'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'commonMarket': {
        'url': '/user-set/commonMarket/commonMarket',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.MARKETING'  // 共同行銷約定'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    }, 'lost-report': {
        'url': '/user-set/lost-report',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.USER_SET.LOSS'  // 掛失服務'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'user-set' // 是否顯示微交互
    },
    'legal': {
        'url': '/user-set/legal',
        'header': {
            'title': 'FUNC.FRONT_DESK',  // 法尊客戶基本資料
            'style': 'normal'
            // , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },

    // -------------------- [個人設定 End] -------------------- //

    // ======================================== 其他功能 ======================================== //
    // -------------------- [最新消息] -------------------- //
    // 'news': {
    //     'url': '/news/menu',
    //     'header': {
    //         'title': 'FUNC.NEWS'  // 最新消息'
    //         , 'leftBtnIcon': 'menu'
    //         // , 'rightBtnIcon': ''
    //         // , 'backPath': ''
    //         , 'style': 'normal'
    //     }
    //     // , 'micro': 'news' // 是否顯示微交互
    // },
    // 最新消息
    'news': {
        'url': '/news/news-board',
        'preInit': false,
        'header': {
            'title': 'FUNC.NEWS'  // 最新消息'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'news' // 是否顯示微交互
    },
    // 優惠活動資訊
    'web:abouthot': {
        'url': 'web:abouthot',
        'header': {
            'title': 'FUNC_SUB.USER_SET.ABOUTHOT'  // 優惠活動資訊'
        }
    },
    // 信用卡活動訊息
    'web:creditcard': {
        'url': 'web:creditcard',
        'header': {
            'title': 'FUNC_SUB.USER_SET.CARDHOT'  // 信用卡活動訊息'
        }
    },
    // -------------------- [最新消息 End] -------------------- //
    // -------------------- [金融資訊] -------------------- //
    'financial': {
        'url': '/financial/menu',
        'header': {
            'title': 'FUNC.FINANCIAL'  // 金融資訊'
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        // , 'micro': 'financial' // 是否顯示微交互
    },
    'gold': {
        'url': '/financial/goldPrice/gold',
        'preInit': true,
        'header': {
            'title': 'FUNC_SUB.FINANCIAL.GOLD'  // 黃金存摺牌價查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'financial' // 是否顯示微交互
    },
    'exchange': {
        'url': '/financial/exchange/exchange',
        'preInit': true,
        'header': {
            'title': 'FUNC_SUB.FINANCIAL.FOREX'  // 外幣匯率'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'financial' // 是否顯示微交互
    },
    'twdSave': {
        'url': '/financial/twdSave',
        'preInit': true,
        'header': {
            'title': 'FUNC_SUB.FINANCIAL.DEPOSIT_RATE'  // 台幣存款利率'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'financial' // 是否顯示微交互
    },
    'twdLoan': {
        'url': '/financial/twdLoan',
        'preInit': true,
        'header': {
            'title': 'FUNC_SUB.FINANCIAL.LOAD_RATE'  // 台幣放款利率'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'financial' // 是否顯示微交互
    },

    'foreignSave': {
        'url': '/financial/foreignSave',
        'preInit': true,
        'header': {
            'title': 'FUNC_SUB.FINANCIAL.FOREX_DEPOSIT_RATE'  // 外幣存款利率'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'financial' // 是否顯示微交互
    },
    // 'foreignSaveDetail': {
    //   'url': '/financial/foreignSaveDetail',
    //   'header': {
    //     'title': '外幣存款利率內容'  // 外幣存款利率內容'
    //     , 'leftBtnIcon': 'back'
    //     // , 'rightBtnIcon': ''
    //     // , 'backPath': ''
    //     , 'style': 'normal'
    //   }
    //   , 'micro': 'financial' // 是否顯示微交互
    // },
    'foreignLoan': {
        'url': '/financial/foreignLoan',
        'preInit': true,
        'header': {
            'title': 'FUNC_SUB.FINANCIAL.FOREX_LOAD_RATE'  // 外幣放款利率'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'financial' // 是否顯示微交互
    },
    'ticketRate': {
        'url': '/financial/ticketRate',
        'preInit': true,
        'header': {
            'title': 'FUNC_SUB.FINANCIAL.TICKET'  // 票券利率'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'financial' // 是否顯示微交互
    },
    'bondRate': {
        'url': '/financial/bondRate',
        'preInit': true,
        'header': {
            'title': 'FUNC_SUB.FINANCIAL.BOND'  // 債券利率'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'financial' // 是否顯示微交互
    },
    // -------------------- [金融資訊 End] -------------------- //
    // -------------------- [服務據點] -------------------- //
    'locationkey': {
        'url': '/location',
        'preInit': false,
        'header': {
            'title': 'FUNC.LOCATION' // 服務據點  // LEFT_MENU.LOCATION' // 服務據點
        }
        , 'micro': 'location' // 是否顯示微交互
    },
    'mapshowkey': {
        'url': '/location/mapshowkey',
        'preInit': false,
        'header': {
            'title': 'FUNC.LOCATION', // 服務據點(地圖頁面)  // LEFT_MENU.LOCATION', // 服務據點(地圖頁面)
            'leftBtnIcon': ''
        }
    },
    // -------------------- [服務據點 End] -------------------- //
        // -------------------- [線上取號] -------------------- //
    'take-number': {
        'url': '/take-number',
        'preInit': false,
        'header': {
            'title': '線上取號',
            // 'style': 'login',
        }
    },
    'take-number-map': {
        'url': '/take-number/map',
        'preInit': false,
        'header': {
            'title': '分行位置'
        }
    },
    'take-number-operate': {
        'url': '/take-number/operate',
        'preInit': false,
        'header': {
            'title': '選擇業務'
        }
    },
    'take-number-my-branch': {
        'url': '/take-number/my-branch',
        'preInit': false,
        'header': {
            'title': '常用分行'
        }
    },
    'take-number-ticket': {
        'url': '/take-number/ticket',
        'preInit': false,
        'header': {
            'title': '完成取號'
        }
    },
    // -------------------- [線上取號 End] -------------------- //
    // -------------------- [線上櫃台] -------------------- //
    'front-desk': {
        'url': 'front-desk/menu',
        'header': {
            'title': 'FUNC.FRONT_DESK',  // 線上櫃台',
            'style': 'normal'
            , 'leftBtnIcon': 'menu' // 20190508 改到其他服務下
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },
    //--------20190920 Boy 因應合庫需求變更-------//
    'front-desk-home': {
        'url': 'front-desk/menu',
        'urlParams': {
            'type': 'home'
        },
        'header': {
            'title': 'FUNC.FRONT_DESK',  // 線上櫃台',
            'style': 'normal'
            // , 'leftBtnIcon': 'back' 
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },
    //------------------------------------------//
    'reser-form': {
        'url': 'front-desk/reser-form',
        'header': {
            'title': 'FUNC_SUB.FRONT_DESK.RESER_FORM',  // 預約填單
            'style': 'normal'
            // , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },
    'reser-deposit': {
        'url': 'front-desk/reser-form/reser-deposit',
        'header': {
            'title': 'FUNC_SUB.RESER_FORM.RESER_DEPOSIT',  // 預約填單-台幣存款
            'style': 'normal'
            // , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },
    'reser-withdrawal': {
        'url': 'front-desk/reser-form/reser-withdrawal',
        'header': {
            'title': 'FUNC_SUB.RESER_FORM.RESER_WITHDRAWAL',  // 預約填單-台幣提款
            'style': 'normal'
            // , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },
    'reser-transfer': {
        'url': 'front-desk/reser-form/reser-transfer',
        'header': {
            'title': 'FUNC_SUB.RESER_FORM.RESER_TRANSFER',  // 預約填單-台幣自行轉帳
            'style': 'normal'
            // , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },
    'reser-norm': {
        'url': 'front-desk/reser-form/reser-norm',
        'header': {
            'title': 'FUNC_SUB.RESER_FORM.RESER_NORM',  // 預約開立一般存款帳戶
            'style': 'normal'
            // , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },
    'acnt-bla-cert': {
        'url': 'front-desk/acnt-bla-cert',
        'header': {
            'title': 'FUNC_SUB.FRONT_DESK.ACNT_BLA_CERT',  // 線上申請存款餘額證明申請
            'style': 'normal'
            // , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },
    // 9700 法遵客戶資料
    'launder-prevention': {
        'url': 'front-desk/launder-prevention',
        'header': {
            'title': 'FUNC_SUB.FRONT_DESK.LAUNDER_PREVENTION'
            , 'style': 'normal'
        }
        // , 'micro': '' // 是否顯示微交互
    },
    
    // 線上櫃台-線上申貸
        'online-loan-desk': {
            'url': 'front-desk/online-loan-desk/loan-test',
            'header': {
            'title': '線上申請貸款'
            , 'style': 'normal'
        }
        // , 'micro': '' // 是否顯示微交互
    },
    // 線上櫃台-紓困貸款
    'online-loan-desk1': {
        'url': 'front-desk/online-loan-desk/loan-test',
        'header': {
        'title': '線上申請貸款'
        , 'style': 'normal'
        , 'aa' : '1'
    }
    // , 'micro': '' // 是否顯示微交互
    },
    // -------------------- [線上櫃台 End] -------------------- //
    
    // -------------------- [線上申貸 Start] -------------------- //
    'online-loan': {
        'url': '/online-loan/menu',
        'header': {
            'title': 'LEFT_MENU.LOAN',  // 線上櫃台',
            'style': 'normal'
            // , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
        }
        // , 'micro': 'front-desk' // 是否顯示微交互
    },
        // 
        'mortgage-loan': {
            'url': '/online-loan/mortgage-increase',
            'preInit': false,
            'header': {
                'title': 'FUNC_SUB.LOAN.MORTGAGE_INCREASE'  // 線上申請房貸增貸
                , 'leftBtnIcon': 'back'
                // , 'rightBtnIcon': ''
                // , 'backPath': ''
                , 'style': 'normal'
            }
            // , 'micro': 'fund' // 是否顯示微交互
        },
        'credit-loan': {
            'url': '/online-loan/credit-loan',
            'preInit': false,
            'header': {
                'title': 'FUNC_SUB.LOAN.CREDIT_LOAN'  // 線上申請信用貸款
                , 'leftBtnIcon': 'back'
                // , 'rightBtnIcon': ''
                // , 'backPath': ''
                , 'style': 'normal'
            }
            // , 'micro': 'fund' // 是否顯示微交互
        },
        'credit-loan1': {
            'url': '/online-loan/credit-loan',
            'preInit': false,
            'header': {
                'title': 'FUNC_SUB.LOAN.CREDIT_LOAN'  // 線上申請信用貸款
                , 'leftBtnIcon': 'back'
                // , 'rightBtnIcon': ''
                // , 'backPath': ''
                , 'style': 'normal'
                , 'aa' : '2'
            }
            // , 'micro': 'fund' // 是否顯示微交互
        },
        'main-upload': {
            'url': '/online-loan/main-upload/main',
            'preInit': false,
            'header': {
                'title': 'FUNC_SUB.LOAN.FILE_UPLOAD'  // 文件上傳
                , 'leftBtnIcon': 'back'
                // , 'rightBtnIcon': ''
                // , 'backPath': ''
                , 'style': 'normal'
            }
            // , 'micro': 'fund' // 是否顯示微交互
        },
        'schedule-query': {
            'url': '/online-loan/schedule-query/query-main',
            'preInit': false,
            'header': {
                'title': 'FUNC_SUB.LOAN.SCHEDULE_QUERY'  // 申請進度查詢
                , 'leftBtnIcon': 'back'
                // , 'rightBtnIcon': ''
                // , 'backPath': ''
                , 'style': 'normal'
            }
            // , 'micro': 'fund' // 是否顯示微交互
        },
        'sign-protection': {
            'url': '/online-loan/sign-protection/sign-main',
            'preInit': false,
            'header': {
                'title': 'FUNC_SUB.LOAN.SIGN_PROTECTION'  // 線上簽約對保
                , 'leftBtnIcon': 'back'
                // , 'rightBtnIcon': ''
                // , 'backPath': ''
                , 'style': 'normal'
            }
            // , 'micro': 'fund' // 是否顯示微交互
        },
        'contract-download': {
            'url': '/online-loan/contract-download/download-main',
            'preInit': false,
            'header': {
                'title': 'FUNC_SUB.LOAN.CONTRACT_DOWNLOAD'  // 線上約據下載
                , 'leftBtnIcon': 'back'
                // , 'rightBtnIcon': ''
                // , 'backPath': ''
                , 'style': 'normal'
            }
            // , 'micro': 'fund' // 是否顯示微交互
        },
        'house-loan': {
            'url': '/online-loan/house-loan',
            'preInit': false,
            'header': {
                'title': 'FUNC_SUB.LOAN.HOUSE_LOAN'  // 線上申請房屋貸款
                , 'leftBtnIcon': 'back'
                // , 'rightBtnIcon': ''
                // , 'backPath': ''
                , 'style': 'normal'
            }
            // , 'micro': 'fund' // 是否顯示微交互
        },
        'credit-resver-loan': {
            'url': '/online-loan/credit-resver-loan',
            'preInit': false,
            'header': {
                'title': 'FUNC_SUB.LOAN.CREDIT_LOAN'  // 線上申請信用貸款(預填單)
                , 'leftBtnIcon': 'back'
                // , 'rightBtnIcon': ''
                // , 'backPath': ''
                , 'style': 'normal'
            }
            // , 'micro': 'fund' // 是否顯示微交互
        },
        // bail-out-loan
        // 'bail-out-loan': {
        //     'url': '/online-loan/bail-out-loan',
        //     'preInit': false,
        //     'header': {
        //         'title': 'FUNC_SUB.LOAN.BAIL_OUT_LOAN'  // 勞工紓困貸款
        //         , 'leftBtnIcon': 'back'
        //         , 'style': 'normal'
        //     }
        // },
    // -------------------- [線上申貸 End] -------------------- //


    // ======================================== 特殊專區 ======================================== //
    // -------------------- [醫療服務&產壽險服務] -------------------- //
    'hospital': {
        'url': '/hospital/menu',
        'preInit': false,
        'urlParams': {
            'type': 'hospital'
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.HOSPITAL' // 醫療服務
            // , 'leftBtnIcon': 'menu'
            , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
            // , 'rightBtnIcon': ''
            , 'backPath': 'other-service'
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'insurance': {
        'url': '/hospital/menu',
        'preInit': false,
        'urlParams': {
            'type': 'insurance'
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.INSURANCE' // 產壽險服務
            // , 'leftBtnIcon': 'menu'
            // , 'leftBtnIcon': 'back' // 20190508 改到其他服務下
            // , 'rightBtnIcon': ''
            , 'backPath': 'other-service'
            , 'style': 'normal'
        }
        , 'micro': 'insurance' // 是否顯示微交互
    },
    'hospital-branch': {
        'url': '/hospital/branch-menu',
        'preInit': false,
        'urlParams': {
            'type': 'hospital'
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.HOSPITAL' // 醫療服務
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'insurance-branch': {
        'url': '/hospital/branch-menu',
        'preInit': false,
        'urlParams': {
            'type': 'insurance'
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.INSURANCE'  // 產壽服務
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'insurance' // 是否顯示微交互
    },
    'hospital-bill': {
        'url': '/hospital/pay/bill',
        'preInit': false,
        'urlParams': {
            'type': '1'
        },
        'header': {
            'title': '' // 醫療服務  // ' // 醫療服務
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'insurance-bill': {
        'url': '/hospital/pay/bill',
        'preInit': false,
        'urlParams': {
            'type': '2'
        },
        'header': {
            'title': '' // 產壽服務  // ' // 產壽服務
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'insurance' // 是否顯示微交互
    },
    'account-set': {
        'url': '/hospital/ntuh/ntuh-paylist',
        'preInit': false,
        'urlParams': {
        },
        'header': {
            'title': '' // 扣款帳號設定
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'debit-card': {
        'url': '/hospital/debit-card',
        'preInit': false,
        'urlParams': {
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.DEBITCARD' // 繳費單繳費
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'matm-back': {
        'url': '/hospital/matm-back',
        'preInit': false,
        'urlParams': {
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.DEBITCARD' // 繳費單繳費
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'ntuh': {
        'url': '/hospital/ntuh/ntuh-menu',
        'preInit': false,
        'urlParams': {
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.HOSPITAL_NTUH' // 台大選單: 台大醫院
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'ntuh-pay': {
        'url': '/hospital/ntuh/ntuh-pay',
        'preInit': false,
        'urlParams': {
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.HOSPITAL_NTUH' // 台大繳費: 台大醫院
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'ntuh-paylist': {
        'url': '/hospital/ntuh/ntuh-paylist',
        'preInit': false,
        'urlParams': {
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.QRCODESAVE' // 服務條碼儲存區
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'ntuh-menu': {
        'url': '/hospital/ntuh/ntuh-menu',
        'preInit': false,
        'urlParams': {
            'hospitalId': 'NTUH',
            'branchId': 'T0',
            'type': '1',
            'titleName': '台大醫院醫療費用'
        },
        'header': {
            // 'title': 'FUNC_SUB.OTHER.NTUH_PAY_MENU' // 台大醫院醫療費用
            'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    'qr-code-save': {
        'url': '/hospital/ntuh/qr-code-save/list',
        'preInit': false,
        'urlParams': {
        },
        'header': {
            'title': 'FUNC_SUB.OTHER.DEBITCARD' // 服務條碼儲存區
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'hospital' // 是否顯示微交互
    },
    // -------------------- [醫療服務&產壽險服務 End] -------------------- //
    // -------------------- [合庫E Pay] -------------------- //
    // angularJS(舊的)
    // 'web:epay': {
    //     'url': 'web:epay',
    //     'header': {
    //         'title': 'FUNC.EPAY' // 合庫E Pay  // FUNC.EPAY' // 合庫E Pay
    //         , 'leftBtnIcon': 'menu'
    //     }
    // },
    'epay': {
        'url': 'epay/menu',
        'header': {}
        , 'micro': 'epay' // 是否顯示微交互
    },
    // 自動轉主掃
    'epay-scan': {
        'url': 'epay/menu',
        'urlParams': {
            'redirect': 'scan'
        },
        'header': {
            // 'leftBtnIcon': 'menu'
        }
    },
    // 自動轉出示付款碼
    'qrcodeShowPayFromHome': {
        'url': 'epay/menu',
        'urlParams': {
            'redirect': 'qrcodeShowPay'
        },
        'header': {}
    },
    'setacct': {
        'url': 'epay/setacct',
        'header': {
            'title': 'FUNC_SUB.EPAY.SET_ACCT' // 設定領獎帳號
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'invoice': { // 電子發票首頁
        'url': 'epay/invoice',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'invoicequerymobilebckey': { // 查詢手機條碼
        'url': 'epay/invoice/querymobilebc',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'invoicequerymobilebcresultkey': { // 查詢手機條碼結果
        'url': 'epay/invoice/querymobilebcresult',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'invoicebcregedit': { // 註冊手機條碼-編輯
        'url': 'epay/invoice/bcregedit',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'invoicebcregresult': { // 註冊手機條碼-結果
        'url': 'epay/invoice/bcregresult',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'invoiceeditbarcodekey': { // 設定手機條碼
        'url': 'epay/invoice/editbarcode',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'getBarcodeTerm': { // 發票載具號碼
        'url': 'epay/invoice/editbarcode',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'invoicelovecodeedit': { // 編輯捐贈碼
        'url': 'epay/invoice/lovecodeedit',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'invoiceforgetveredit': { // 查詢驗證碼 - 編輯
        'url': 'epay/invoice/forgetveredit',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'invoiceforgetverresult': { // 查詢驗證碼 - 結果
        'url': 'epay/invoice/forgetverresult',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'verification': {
        'url': 'epay/verification',
        'header': {
            'title': 'FUNC_SUB.EPAY.VERIFICATION' // 變更手機條碼驗證碼
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'search': {
        'url': 'epay/search',
        'header': {
            'title': 'FUNC_SUB.EPAY.SEARCH' // 交易紀錄/退貨
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'epayscan': {
        'url': 'epay/epayscan',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] 轉帳購物
    'qrCodeBuyForm': {
        'url': 'epay/qrCodeBuyForm',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_BUY' // 轉帳購物
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] 單筆轉帳(P2P)
    'qrCodeGetForm': {
        'url': 'epay/qrCodeGetForm',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_P2P' // 單筆轉帳
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] QR Code emv 付款-輸入金額信用卡
    'qrCodePayCardForm': {
        'url': 'epay/qrCodePayCardForm',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] 消費扣款
    'qrCodePayForm': {
        'url': 'epay/qrCodePayForm',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] 消費扣款
    'qrCodePayForm2': {
        'url': 'epay/qrCodePayForm2',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] QRCode 繳費
    'qrCodePayFormCard': {
        // 'url': 'epay/qrCodePayFormCard', // 程式整個有問題
        'url': 'epay/qrPay/card',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_FEE' // QRCode 繳費
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] QRCode 繳稅
    'qrCodePayFormTax2': {
        'url': 'epay/qrCodePayFormTax2',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_TAX' // QRCode 繳稅
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] QRCode 繳稅
    'qrCodePayFormTax4': {
        'url': 'epay/qrCodePayFormTax4',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_TAX' // QRCode 繳稅
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'qrcodePayResult': {
        'url': 'epay/qrcodePayResult',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'qrcodeRed': {
        'url': 'epay/qrcodeRed',
        'header': {
            'title': 'FUNC_SUB.EPAY.RED' // 掃描QRCode
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'qrcodeShowReceipt': {
        'url': 'epay/qrcodeShowReceipt',
        'header': {
            'title': 'FUNC_SUB.EPAY.SHOWRECEIPT' // 出示收款碼
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'qrcodeShowPay': {
        'url': 'epay/qrcodeShowPay',
        'header': {
            'title': 'FUNC_SUB.EPAY.SHOWPAY' // 出示付款碼
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'referenceEdit': {
        'url': 'epay/referenceEdit',
        'header': {
            'title': 'FUNC_SUB.EPAY.RECOMMEND' // 推薦人設定
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'qrcodePayTerms': {
        'url': 'epay/qrcodePayTerms',
        'header': {
            'title': 'FUNC_SUB.EPAY.SMART_PAY' // 開通SmartPay使用條款/設定帳號
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'qrcodePaySettingResult': {
        'url': 'epay/qrcodePayTerms/qrcodePaySettingResult',
        'header': {
            'title': 'FUNC_SUB.EPAY.SMART_PAY' // 開通SmartPay使用條款/設定帳號
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'outboundAgree': {
        'url': 'epay/outbound/term',
        'header': {
            'title': 'FUNC_SUB.EPAY.OUTBOUND' // 同意跨境匯出
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'outboundData': {
        'url': 'epay/outbound/edit',
        'header': {
            'title': 'FUNC_SUB.EPAY.OUTBOUND' // 同意跨境匯出
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'outboundResult': {
        'url': 'epay/outbound/result',
        'header': {
            'title': 'FUNC_SUB.EPAY.OUTBOUND' // 同意跨境匯出
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'qrcodePayCardTerms': {
        'url': 'epay/qrcodePayCardTerms',
        'header': {
            'title': 'FUNC_SUB.EPAY.CARD_TERM' // 信用卡交易使用條款
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'cardAdd': {
        'url': 'epay/qrcodePayCardTerms/add',
        'header': {
            'title': 'FUNC_SUB.EPAY.CARD_ADM' // 信用卡新增管理
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardBinding': {
        'url': 'epay/qrcodePayCardTerms/result',
        'header': {
            'title': 'FUNC_SUB.EPAY.CARD_BIND' // 信用卡綁定
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'taipowerOverview': {
        'url': 'epay/taipowerOverview',
        'header': {
            'title': '電費帳單'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'taipowerSumFee': {
        'url': 'epay/taipowerSumFee',
        'header': {
            'title': '電費帳單'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'eFeeResult': {
        'url': 'epay/eFeeResult',
        'header': {
            'title': '台電繳費結果',
            'style': 'result',
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // -------------------- [合庫E Pay End] -------------------- //
    // -------------------- [信用卡] -------------------- //
    'epay-card': {
        'url': 'epay-card/menu',
        'header': {}
        , 'micro': 'epay-card' // 是否顯示微交互
    },
    // 自動轉主掃
    'cardlogin-epay-scan': {
        'url': 'epay-card/cardlogin-menu',
        'urlParams': {
            'redirect': 'scan'
        },
        'header': {
            // 'leftBtnIcon': 'menu'
        }
    },
    // 自動轉出示付款碼
    'cardlogin-qrcodeShowPayFromHome': {
        'url': 'epay-card/cardlogin-menu',
        'urlParams': {
            'redirect': 'qrcodeShowPay'
        },
        'header': {}
    },
    'cardlogin-setacct': {
        'url': 'epay-card/cardlogin-setacct',
        'header': {
            'title': 'FUNC_SUB.EPAY.SET_ACCT' // 設定領獎帳號
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-invoice': { // 電子發票首頁
        'url': 'epay-card/cardlogin-invoice',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-invoicequerymobilebckey': { // 查詢手機條碼
        'url': 'epay-card/cardlogin-invoice/querymobilebc',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-invoicequerymobilebcresultkey': { // 查詢手機條碼結果
        'url': 'epay-card/cardlogin-invoice/querymobilebcresult',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-invoicebcregedit': { // 註冊手機條碼-編輯
        'url': 'epay-card/cardlogin-invoice/bcregedit',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-invoicebcregresult': { // 註冊手機條碼-結果
        'url': 'epay-card/cardlogin-invoice/bcregresult',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-invoiceeditbarcodekey': { // 設定手機條碼
        'url': 'epay-card/cardlogin-invoice/editbarcode',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-getBarcodeTerm': { // 發票載具號碼
        'url': 'epay-card/cardlogin-invoice/editbarcode',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-invoicelovecodeedit': { // 編輯捐贈碼
        'url': 'epay-card/cardlogin-invoice/lovecodeedit',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-invoiceforgetveredit': { // 查詢驗證碼 - 編輯
        'url': 'epay-card/cardlogin-invoice/forgetveredit',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-invoiceforgetverresult': { // 查詢驗證碼 - 結果
        'url': 'epay-card/cardlogin-invoice/forgetverresult',
        'header': {
            'title': 'FUNC_SUB.EPAY.INVOICE' // 發票載具號碼
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-verification': {
        'url': 'epay-card/cardlogin-verification',
        'header': {
            'title': 'FUNC_SUB.EPAY.VERIFICATION' // 變更手機條碼驗證碼
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-search': {
        'url': 'epay-card/cardlogin-search',
        'header': {
            'title': 'FUNC_SUB.EPAY.SEARCH' // 交易紀錄/退貨
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-epayscan': {
        'url': 'epay-card/cardlogin-epayscan',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] 轉帳購物
    'cardlogin-qrCodeBuyForm': {
        'url': 'epay-card/cardlogin-qrCodeBuyForm',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_BUY' // 轉帳購物
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] 單筆轉帳(P2P)
    'cardlogin-qrCodeGetForm': {
        'url': 'epay-card/cardlogin-qrCodeGetForm',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_P2P' // 單筆轉帳
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] QR Code emv 付款-輸入金額信用卡
    'cardlogin-qrCodePayCardForm': {
        'url': 'epay-card/cardlogin-qrCodePayCardForm',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] 消費扣款
    'cardlogin-qrCodePayForm': {
        'url': 'epay-card/cardlogin-qrCodePayForm',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] 消費扣款
    'cardlogin-qrCodePayForm2': {
        'url': 'epay-card/cardlogin-qrCodePayForm2',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] QRCode 繳費
    'cardlogin-qrCodePayFormCard': {
        // 'url': 'epay/qrCodePayFormCard', // 程式整個有問題
        'url': 'epay-card/cardlogin-qrPay/card',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_FEE' // QRCode 繳費
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] QRCode 繳稅
    'cardlogin-qrCodePayFormTax2': {
        'url': 'epay-card/cardlogin-qrCodePayFormTax2',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_TAX' // QRCode 繳稅
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // [Qrcode] QRCode 繳稅
    'cardlogin-qrCodePayFormTax4': {
        'url': 'epay-card/cardlogin-qrCodePayFormTax4',
        'header': {
            'title': 'FUNC_SUB.EPAY.QR_TAX' // QRCode 繳稅
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-qrcodePayResult': {
        'url': 'epay-card/cardlogin-qrcodePayResult',
        'header': {
            'title': 'FUNC_SUB.EPAY.ONSCAN' // 掃描QRCode
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-qrcodeRed': {
        'url': 'epay-card/cardlogin-qrcodeRed',
        'header': {
            'title': 'FUNC_SUB.EPAY.RED' // 掃描QRCode
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-qrcodeShowReceipt': {
        'url': 'epay-card/cardlogin-qrcodeShowReceipt',
        'header': {
            'title': 'FUNC_SUB.EPAY.SHOWRECEIPT' // 出示收款碼
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-qrcodeShowPay': {
        'url': 'epay-card/cardlogin-qrcodeShowPay',
        'header': {
            'title': 'FUNC_SUB.EPAY.SHOWPAY' // 出示付款碼
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-referenceEdit': {
        'url': 'epay-card/cardlogin-referenceEdit',
        'header': {
            'title': 'FUNC_SUB.EPAY.RECOMMEND' // 推薦人設定
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-qrcodePayTerms': {
        'url': 'epay-card/cardlogin-qrcodePayTerms',
        'header': {
            'title': 'FUNC_SUB.EPAY.SMART_PAY' // 開通SmartPay使用條款/設定帳號
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'cardlogin-qrcodePaySettingResult': {
        'url': 'epay-card/qrcodePayTerms/qrcodePaySettingResult',
        'header': {
            'title': 'FUNC_SUB.EPAY.SMART_PAY' // 開通SmartPay使用條款/設定帳號
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-outboundAgree': {
        'url': 'epay-card/outbound/term',
        'header': {
            'title': 'FUNC_SUB.EPAY.OUTBOUND' // 同意跨境匯出
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-outboundData': {
        'url': 'epay-card/cardlogin-outbound/edit',
        'header': {
            'title': 'FUNC_SUB.EPAY.OUTBOUND' // 同意跨境匯出
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-outboundResult': {
        'url': 'epay-card/cardlogin-outbound/result',
        'header': {
            'title': 'FUNC_SUB.EPAY.OUTBOUND' // 同意跨境匯出
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-qrcodePayCardTerms': {
        'url': 'epay-card/cardlogin-qrcodePayCardTerms',
        'header': {
            'title': 'FUNC_SUB.EPAY.CARD_TERM' // 信用卡交易使用條款
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'cardlogin-cardAdd': {
        'url': 'epay-card/cardlogin-qrcodePayCardTerms/add',
        'header': {
            'title': 'FUNC_SUB.EPAY.CARD_ADM' // 信用卡新增管理
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-cardBinding': {
        'url': 'epay-card/cardlogin-qrcodePayCardTerms/result',
        'header': {
            'title': 'FUNC_SUB.EPAY.CARD_BIND' // 信用卡綁定
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-taipowerOverview': {
        'url': 'epay-card/cardlogin-taipowerOverview',
        'header': {
            'title': '電費帳單'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-taipowerSumFee': {
        'url': 'epay-card/cardlogin-taipowerSumFee',
        'header': {
            'title': '電費帳單'
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    'cardlogin-eFeeResult': {
        'url': 'epay-card/cardlogin-eFeeResult',
        'header': {
            'title': '台電繳費結果',
            'style': 'result',
            // , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            // , 'style': 'normal'
        }
    },
    // -------------------- [合庫信用卡E Pay End] -------------------- //
    // -------------------- [信用卡] -------------------- //
    // angularJS(舊的)
    'web:card': {
        'url': 'web:card',
        'header': {
            'title': 'FUNC.CREDIT_CARD' // 信用卡  // FUNC.CREDIT_CARD' // 信用卡
        }
    },
    'web:pay': {
        'url': 'web:pay',
        'header': {
            'title': 'FUNC_SUB.CARD.HOME_PAY'  // 繳卡費'
        }
    },
    'web:bill': {
        'url': 'web:bill',
        'header': {
            'title': 'FUNC_SUB.CARD.HOME_BILL'  // 帳單查詢'
        }
    },
    'web:apply': {
        'url': 'web:apply',
        'header': {
            'title': 'FUNC_SUB.CARD.HOME_APPLY'  // 信用卡申請'
        }
    },
    'card': {
        'url': 'card',
        'header': {
            'title': 'FUNC.CREDIT_CARD' // 信用卡  // FUNC.CREDIT_CARD' // 信用卡
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'pay-va-card': {
        'url': 'card/card-pay/pay-va-card',
        'header': {
            'title': '繳本人卡款' // 繳本人卡款
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'pay-market-card': {
        'url': 'card/card-pay/pay-market-card',
        'header': {
            'title': '超商繳卡費' // 繳本人卡款
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    //額度調整選單
    'card-quota-menu': {
        'url': 'card/card-quota/card-quota-menu',
        'preInit': false,
        'header': {
            'title': '額度調整' // 額度調整
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'card-quota': {
        'url': 'card/card-quota/card-quota',
        'preInit': false,
        'header': {
            'title': '額度調整' // 額度調整
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'card-main-upload': {
        'url': 'card/card-main-upload',
        'preInit': false,
        'header': {
            'title': '補件上傳' // 額度調整
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    // -------------------- [信用卡 End] -------------------- //
    // -------------------- [投資理財] -------------------- //
    'fund': {
        'url': '/fund/menu',
        'preInit': false,
        'header': {
            'title': 'FUNC.FUND' // 投資理財  // FUNC.FUND' // 投資理財
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    'fund-policy': {
        'url': '/fund/menu',
        'urlParams': {
            'policy': '1'
        },
        'preInit': false,
        'header': {
            'title': 'FUNC.FUND' // 投資理財  // FUNC.FUND' // 投資理財
            , 'leftBtnIcon': 'menu'
            , 'style': 'normal'
        }
    },
    'fund-convert': {
        'url': '/fund/fund-convert',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.CONVERT'  // 基金轉換
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    'fund-pay-change': {
        'url': '/fund/pay-change',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.TermsSipOti'  // 定期(不)定額查詢/異動
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    'fund-deposit-account': {
        'url': '/fund/deposit-account',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.TermsProfitAcnt'  // 現金收益存入帳號異動'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    'fund-reserve-cancel': {
        'url': '/fund/reserve-cancel',
        'header': {
            'title': 'FUNC_SUB.FUND_HEADER.FORWARD_SEARCH'  // 查詢取消基金預約'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    'fund-group-resk-test': {
        'url': '/fund/fund-other/safe-check',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.KYC'  // '風險承受度測驗'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互

    },
    'fund-income-notify': {
        'url': '/fund/income-notify',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.AUDIT_NOTIFY'  // '停損獲利點通知'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互

    },
    'fund-group-set': {
        'url': '/fund/search-set-list/search-set-list',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.FUND_GROUP'  // 投資組合查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    'fund-group-set-edit': {
        'url': '/fund/search-set/search-set',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.FUND_GROUP_EDIT'  // 投資組合設定'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 基金投資損益報告(主控制tag)
    'fund-report': {
        'url': '/fund/profit-report/fund-report',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.BALANCE_REPORT'  // 基金投資損益報告'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 基金庫存總攬
    'fund-stock-overview': {
        'url': '/fund/profit-report/stock-overview',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.BALANCE_REPORT'  // 基金投資損益報告'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 基金庫存明細
    'fund-stock-detail': {
        'url': '/fund/profit-report/stock-detail',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.BALANCE_REPORT'  // 基金投資損益報告'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 智富投資損益報告(主控制tag)
    'rich-report': {
        'url': '/fund/rich-profit-report/rich-report',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.SMART_REPORT'  // 智富投資損益報告'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 智富庫存總覽
    'rich-stock-overview': {
        'url': '/fund/rich-profit-report/rich-overview',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.SMART_REPORT'  // 智富投資損益報告'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 智富庫存明細
    'rich-stock-detail': {
        'url': '/fund/rich-profit-report/rich-detail',
        'preInit': false,
        'header': {
            'title': 'FUNC_SUB.FUND.SMART_REPORT'  // 智富投資損益報告'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 已實現損益查詢(年度選擇)
    'has-realize-type': {
        'url': '/fund/has-realize/has-realize-type',
        'header': {
            'title': 'FUNC_SUB.FUND_HEADER.REALIZE_SEARCH'  // 已實現損益查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 已實現損益查詢(主控制tag)
    'has-realize-query': {
        'url': '/fund/has-realize/has-realize-query',
        'header': {
            'title': 'FUNC_SUB.FUND_HEADER.REALIZE_SEARCH'  // 已實現損益查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 基金申購(主控制tag)
    'fund-purchase': {
        'url': '/fund/fund-purchase/fund-purchase-tag',
        'header': {
            'title': 'FUNC_SUB.FUND.PURCHASE'  // 基金申購'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 基金贖回
    'fund-redeem': {
        'url': '/fund/fund-redeem/fund-redeem-main',
        'header': {
            'title': 'FUNC_SUB.FUND.REDEEM'  // 基金申購'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },

    // 信託對帳單寄送方式
    'fund-statement': {
        'url': '/fund/fund-statement/fund-statement',
        'header': {
            'title': 'FUNC_SUB.FUND.SET_MAIL'  // 信託對帳單寄送方式'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 基金停損點設定
    'fund-balance-set': {
        'url': '/fund/fund-balance-set/fund-balance-set',
        'header': {
            'title': 'FUNC_SUB.FUND.SET_AUDIT'  // 停損/獲利點設定'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 信託業務推介
    'fund-recommendation': {
        'url': '/fund/fund-recommendation',
        'header': {
            'title': 'FUNC_SUB.FUND.FUND_RECOMMENDATION'  // 信託業務推介
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 申請網路理財
    'fund-network': {
        'url': '/fund/fund-network',
        'header': {
            'title': 'FUNC_SUB.FUND.FUND_NETWORK'  // 信託業務推介
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'micro': 'fund' // 是否顯示微交互
    },
    // 基金通路報酬資訊
    'fund-info': {
        'url': 'web:fund-info',
        'urlParams': {
        },
        'header': {
            'title': 'FUNC_SUB.FUND.FUNDINFO'  // 基金通路報酬資訊
        }
    },
    // 境外基金資訊觀測站
    'overseas-info-fund': {
        'url': 'web:overseas-info-fund',
        'header': {
            'title': '境外基金資訊觀測站'  //
        }
    },
    // 公開資訊觀測站
    'public-info-fund': {
        'url': 'web:public-info-fund',
        'header': {
            'title': '公開資訊觀測站'  //
        }
    },
    // -------------------- [投資理財 End] -------------------- //
// -------------------- [訊息總覽] -------------------- //
    // 訊息總覽 home
    'msg-overview': {
        'url': '/msg-overview/home',
        'header': {
            'title': 'FUNC_SUB.MSG_OVERVIEW.HOME' // 訊息總覽
            , 'leftBtnIcon': 'back'
            , 'rightBtnIcon': 'nav_right_gearwheel_button'
            , 'rightSecBtn': 'noshow'
            , 'backPath': 'home'
            , 'style': 'normal'
        }
    },
    // 訊息總覽 - 推播設定
    'msg-overview-settings': {
        'url': '/msg-overview/settings',
        'header': {
            'title': 'FUNC_SUB.MSG_OVERVIEW.SETTINGS' // 通知設定
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'noshow'
            , 'backPath': 'msg-overview'
            , 'style': 'normal'
        }
    },
    // 訊息總覽 - 推播設定
    'msg-overview-otp-term': {
        'url': '/msg-overview/otp-alert-term',
        'header': {
            'title': 'FUNC_SUB.MSG_OVERVIEW.SETTINGS' // 通知設定
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'noshow'
            , 'backPath': 'msg-overview-settings'
            , 'style': 'normal'
        }
    },
    // 訊息總覽 - 外匯匯率到價通知設定
    'fund-balance-overview': {
        'url': '/msg-overview/fund-balance-overview',
        'header': {
            'title': 'FUNC_SUB.MSG_OVERVIEW.FUND_BALANCE' // 基金停損獲利點
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'noshow'
            , 'backPath': 'msg-overview-settings'
            , 'style': 'normal'
        }
    },
    // 訊息總覽 - 外匯匯率到價通知設定
    'rate-inform-overview': {
        'url': '/msg-overview/rate-inform-overview',
        'header': {
            'title': 'FUNC_SUB.MSG_OVERVIEW.RATE_INFORM' // 匯率到價通知
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'noshow'
            , 'backPath': 'msg-overview-settings'
            , 'style': 'normal'
        }
    },
    // 訊息總覽 - 匯率到價設定
    'rate-inform': {
        'url': '/msg-overview/rate-inform',
        'header': {
            'title': 'FUNC_SUB.MSG_OVERVIEW.RATE_INFORM' // 匯率到價通知
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'noshow'
            // , 'backPath': 'msg-overview-settings'
            , 'style': 'normal'
        }
    },
    // 訊息總覽 - 匯率到價設定
    'edit-rate-inform': {
        'url': '/msg-overview/edit-rate-inform',
        'header': {
            'title': 'FUNC_SUB.MSG_OVERVIEW.RATE_INFORM' // 匯率到價通知
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'noshow'
            // , 'backPath': 'rate-inform'
            , 'style': 'normal'
        }
    },
    // -------------------- [訊息總覽 End] -------------------- //
    // 其他服務
    'other-service': {
        'url': '/other-service/menu',
        'header': {
            'title': 'FUNC.OTHER' // 其他服務  // FUNC.OTHER' // 其他服務
            , 'leftBtnIcon': 'menu'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
    },
    // -------------------- [其他鏈結] -------------------- //
    // 理財金庫
    'moneydj': {
        'url': 'web:moneydj',
        'header': {
            'title': 'FUNC_SUB.OTHER.MONEYDJ' // 理財金庫  // FUNC_SUB.OTHER.MONEYDJ' // 理財金庫
        }
    },
    // 線上取號
    'ticket': {
        'url': 'take-number',
        'header': {
            'title': 'FUNC_SUB.OTHER.OTN'  // FUNC_SUB.OTHER.OTN'
        }

    },
    // 下單開戶
    'open_acct': {
        'url': 'web:open_acct',
        'header': {
            'title': 'FUNC_SUB.OTHER.LUCKYDRAW'  // FUNC_SUB.OTHER.LUCKYDRAW'
        }
    },
    // HCE [20190722 電金要求移除]
    'hce': {
        'url': 'web:hce',
        'header': {
            'title': 'FUNC_SUB.OTHER.HCE'  // FUNC_SUB.OTHER.HCE'
        }
    },
    // 智能客服
    'web:robot': {
        'url': 'web:robot',
        'header': {
            'title': 'FUNC_SUB.OTHER.ROBOT'  // FUNC_SUB.OTHER.ROBOT'
        }
    },
    // 雲端發票 [20190722 電金要求移除]
    'web:einvoice': {
        'url': 'web:einvoice',
        'header': {
            'title': 'FUNC_SUB.OTHER.EINVOICE'  // FUNC_SUB.OTHER.EINVOICE'
        }
    },
    // 網路預約投保
    'web:onlineInsurance': {
        'url': 'web:onlineInsurance',
        'header': {
            'title': 'FUNC_SUB.FRONT_DESK.ONLINE_INSURANCE'  // FUNC_SUB.FRONT_DESK.ONLINE_INSURANCE'
        }
    },
    // 隱私權
    'web:privacy': {
        'url': 'web:privacy',
        'header': {
            'title': '隱私權'  // FUNC_SUB.FRONT_DESK.ONLINE_INSURANCE'
        }
    },
    // 綜活存轉綜定存優惠資訊
    'web:demandOffer': {
        'url': 'web:demandOffer',
        'header': {
            'title': '綜活存轉綜定存之優惠'  //
        }
    },
    // -------------------- [其他鏈結 End] -------------------- //
    // -------------------- [無   障   礙] -------------------- //
    // 無障礙ＥＲＲＯＲＨＡＮＤＥＬ
    'a11yResultPage': {
        'url': '/a11y/a11yResultPage',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'noshow',
            'rightBtnIcon': 'login',
            'title': '合作金庫',
            'backPath': '',
        }
    },
    // 無障礙首頁
    'a11yhomekey': {
        'url': '/a11y',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'noshow',
            'rightBtnIcon': 'login',
            'title': '合作金庫',
            'backPath': '',
        }
    },
    //無障礙帳號查詢
    'a11yaccountkey': {
        'url': '/a11y/a11yaccountkey',
        'header': {
          'style': 'normal_a11y',
          'title': '無障礙帳號查詢'

        }
    },//無障礙登入
    'a11yloginkey': {
        'url': '/a11y/a11yloginkey',
        'header': {
            'title': '合作金庫登入',
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'home',
            'rightBtnIcon': 'noshow',
            'backPath': '',
        }
    },
    //無障礙功能導覽
    'a11yguidekey': {
        'url': '/a11y/a11yguidekey',
        'header': {
          'style': 'normal_a11y',
          'title': '無障礙功能導覽'
        }
    },
    //無障礙帳號查詢-台幣存款查詢-列表
    'a11ytaiwandepositkey': {
        'url': '/a11y/a11ytaiwandepositkey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'back',
            'rightBtnIcon': 'noshow',
            'title': '台幣存款查詢',
        }
    },
    //無障礙帳號查詢-台幣存款查詢-查詢
    'a11ytaiwandepositsearchkey': {
        'url': '/a11y/a11ytaiwandepositsearchkey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'back',
            'rightBtnIcon': 'noshow',
            'title': '台幣存款查詢',
        }
    },
    //無障礙帳號查詢-台幣存款查詢-交易明細
    'a11ytaiwandepositdetailkey': {
        'url': '/a11y/a11ytaiwandepositdetailkey',
        'header': {
          'style': 'normal_a11y',
          'title': '無障礙台幣存款查詢-交易明細'
        }
    },
    //無障礙帳號查詢-台幣存款查詢-更多餘額查詢
    'a11ytaiwandepositmoredetailkey': {
        'url': '/a11y/a11ytaiwandepositmoredetailkey',
        'header': {
          'style': 'normal_a11y',
          'title': '無障礙台幣存款查詢-更多餘額查詢'
        }
    },
    //無障礙帳號查詢-外匯存款查詢-列表
    'a11yforeigndepositkey': {
        'url': '/a11y/a11yforeigndepositkey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'back',
            'rightBtnIcon': 'noshow',
            'title': '外匯存款查詢',
        }
    },
    //無障礙帳號查詢-外匯存款查詢-查詢
    'a11yforeigndepositsearchkey': {
        'url': '/a11y/a11yforeigndepositsearchkey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'back',
            'rightBtnIcon': 'noshow',
            'title': '外匯存款查詢',
        }
    },
    //無障礙帳號查詢-外匯存款查詢-交易明細
    'a11yforeigndepositdetailkey': {
        'url': '/a11y/a11yforeigndepositdetailkey',
        'header': {
          'style': 'normal_a11y',
          'title': '無障礙台幣存款查詢-交易明細'
        }
    },
    //無障礙帳號查詢-外匯存款查詢-更多餘額查詢
    'a11yforeigndepositmoredetailkey': {
        'url': '/a11y/a11yforeigndepositmoredetailkey',
        'header': {
            'style': 'normal_a11y',
            'title': '無障礙台幣存款查詢-更多餘額查詢'
        }
    },
    // 無障礙-借款查詢
    'a11yloankey': {
        'url': '/a11y/a11yloankey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'back',
            'rightBtnIcon': 'noshow',
            'title': '借款查詢',
            'backPath': 'a11yhomekey'
        }
    },
    // 無障礙-借款查詢-明細查詢
    'a11yloansearchkey': {
        'url': '/a11y/a11yloansearchkey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'back',
            'rightBtnIcon': 'noshow',
            'title': '借款查詢',
            'backPath': 'a11yloankey'
        }
    },
    // 無障礙-借款查詢-明細結果
    'a11yloanresultkey': {
        'url': '/a11y/a11yloanresultkey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'back',
            'rightBtnIcon': 'noshow',
            'title': '借款查詢',
            'backPath': 'a11yloansearchkey'
        }
    },
      // 無障礙非約定轉帳-轉帳
      'a11yNoPredesignatedTransferkey': {
        'url': '/a11y/a11yNoPredesignatedTransferkey',
        'header': {
          'style': 'normal_a11y',
          'title': '非約定轉帳'
        }
    },
    // 無障礙非約定轉帳-確認
    'a11yNoPredesignaTedconfirmkey': {
        'url': '/a11y/a11yNoPredesignatedConfirkey',
        'header': {
          'style': 'normal_a11y',
          'title': '非約定轉帳'
        }
    },
    // 無障礙約非定轉帳-結果
    'a11yNoPredesignatedResultkey': {
        'url': '/a11y/a11yNoPredesignatedResultkey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'home',
            'rightBtnIcon': 'noshow',
            'title': '非約定轉帳',
            'backPath': 'a11yhomekey'
        }
    },
    //無障礙約定轉帳-轉帳
    'a11ypredesignatedtransferkey': {
        'url': '/a11y/a11ypredesignatedtransferkey',
        'header': {
            'style': 'normal_a11y',
            'title': '無障礙約定轉帳'
        }
    },
    //無障礙約定轉帳-確認
    'a11ypredesignatedconfirmkey': {
        'url': '/a11y/a11ypredesignatedconfirmkey',
        'header': {
            'style': 'normal_a11y',
            'title': '無障礙約定轉帳'
        }
    },
    //無障礙約定轉帳-結果
    'a11ypredesignatedresultkey': {
        'url': '/a11y/a11ypredesignatedresultkey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'home',
            'rightBtnIcon': 'noshow',
            'title': '約定轉帳',
            'backPath': 'a11yhomekey'
        }
    },
    //無障礙個人設定選單
    'a11ysettingmenutkey': {
        'url': '/a11y/a11ysettingmenutkey',
        'header': {
            'style': 'normal_a11y',
            'showMainInfo': false,
            'leftBtnIcon': 'home',
            'rightBtnIcon': 'noshow',
            'title': '個人設定',
            'backPath': 'a11yhomekey'
        }
    },
    //無障礙個人設定選單代號變更
       'a11yDeviceBind': {
        'url': '/a11y/a11yDeviceBind',
        'header': {
            'style': 'normal_a11y',
            'title': '裝置綁定服務'
        }
    },
    //無障礙個人設定選單代號變更
    'a11ychangenamekey': {
        'url': '/a11y/a11ychangenamekey',
        'header': {
            'style': 'normal_a11y',
            'title': '代號變更'
        }
    },
    //無障礙個人設定選單密碼變更
    'a11ychangepwdkey': {
        'url': '/a11y/a11ychangepwdkey',
        'header': {
            'style': 'normal_a11y',
            'title': '密碼變更'
        }
    },
    //無障礙個人設定選單SLL密碼變更
    'a11ychangesslpwdkey': {
        'url': '/a11y/a11ychangesslpwdkey',
        'header': {
            'style': 'normal_a11y',
            'title': 'SLL密碼變更'
        }
    },
    //無障礙個人設定選單變更結果
    'a11yresultkey': {
        'url': '/a11y/a11yresultkey',
        'header': {
            'style': 'normal_a11y',
            'title': '變更結果'
        }
    },
    //無障礙金融資訊-台幣存款利率
    'a11yfinancialinfokey': {
        'url': '/a11y/a11yfinancialinfokey',
        'header': {
            'style': 'normal_a11y',
            'title': '台幣存款利率'
        }
    },
    //無障礙金融資訊-外幣匯率
    'a11yforeignexchangekey': {
        'url': '/a11y/a11yforeignexchangekey',
        'header': {
            'style': 'normal_a11y',
            'title': '外幣匯率'
        }
    },
    //無障礙金融資訊
    'a11ytaiwndepositskey': {
        'url': '/a11y/a11ytaiwndepositskey',
        'header': {
            'style': 'normal_a11y',
            'title': '金融資訊'
        }
    },
    //無障礙金融資訊
    'a11ytaiwnloankey': {
        'url': '/a11y/a11ytaiwnloankey',
        'header': {
            'style': 'normal_a11y',
            'title': '台幣放款利率'
        }
    },
    //無障礙金融資訊
    'a11yforeigndepositskey': {
        'url': '/a11y/a11yforeigndepositskey',
        'header': {
            'style': 'normal_a11y',
            'title': '外幣存款利率'
        }
    },
    //無障礙金融資訊
    'a11yforeignloankey': {
        'url': '/a11y/a11yforeignloankey',
        'header': {
            'style': 'normal_a11y',
            'title': '外幣放款利率'
        }
    },
    //無障礙金融資訊
    'a11yforeigndepositsmorekey': {
        'url': '/a11y/a11yforeigndepositsmorekey',
        'header': {
            'style': 'normal_a11y',
            'title': '外幣存款利率'
        }
    },

    // -------------------- [無 障 礙 End] -------------------- //

    // -- Demo --//
    'demo1': '/lazy/1'
};

// 刪除項目：
/**

    // 生活資訊 [20190508 需求單移除]
    'newservices': {
        'url': 'web:newservices',
        'header': {
            'title': 'FUNC_SUB.OTHER.MWEBEASYINFO'  // FUNC_SUB.OTHER.MWEBEASYINFO'
        }
    },


 */


