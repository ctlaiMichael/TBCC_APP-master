/**
 * 功能設定檔
 * MENU_SETTING : Menu的主要資料
 * DEFAULT_MENU : 預設值
 */
/**
 * id長度不能超過10
 * MENU_SETTING 說明
 *   '唯一功能編號' : {
 *       id : '唯一功能編號',
 *       name : '顯示的名稱', // 顯示的名稱(i18n keyName)
 *       name_location: {} 不同地區名稱(i18n keyName)
 *       enabled : true, // 是否啟動
 *       need_login: false, //是否需要登入, true要登入,false不用登入
 * need_login: true,
 *       url : 'deposit', // url位置
 *       url_params : {}, // url params
 *       auth : {}, // 權限(false 表示全權限)
 *          ├─ object : 權限設定 {
 *          │               'moduleId' : '', // (可為array)FBO的模組 (預設只要一個符合就打開)
 *          │               'fnctId' : '',   // (可為array)FBO的功能 (預設全部符合就打開)
 *          │               'fnctId_allow_all' : true,   // tru 預設fnctId全部符合,如果不設定fnctId全符合才允許權限，請設為false
 *          │               'serviceId' : '' // FOB的service_id,目前無用處
 *          │           }
 *          ├─ false : 全區開放
 *          └─ pap_location : 母公司地區使用
 *       image: {}, // 圖片
 *       class : {}, // class
 *       return_page : '', 返回頁面id
 *   },
 */

// export const MENU_SETTING = {
//     // == Layout == //
//     // --- 首頁 --- //
//     'F_00_00': {
//         id: 'F_00_00',
//         name: 'HOME.BTN_NAME', // 首頁
//         enabled: true,
//         need_login: false,
//         url: 'home',
//         url_params: {},
//         auth: false,
//         class: {
//             main: {

//             },
//             footer: 'i-home'
//         }
//     }
// };
import { SUB_MENU } from '@conf/menu/sub-menu'; // 匯入子選單做設定
import { ObjectUtil } from '@shared/util/formate/modify/object-util';

let subMenuObj = ObjectUtil.clone(SUB_MENU); // 避免賦予值時出錯

// 快捷選單（設定）
let ALL_SLIDER: any = [
    {
        name: 'LEFT_MENU.HOME', // 首頁
        icon: 'icon_slider_home',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        url: 'home', // 對映routing-path
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.NEWS', // 最新消息
        icon: 'icon_slider_news',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'news',
        url_params: {}
        // , subMenu: (!!subMenuObj['news'] && !!subMenuObj['news']['data']) ? subMenuObj['news']['data'] : []
    }
    , {
        name: 'LEFT_MENU.EPAY', // 合庫E Pay
        icon: 'icon_slider_epay',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        // url: 'web:epay',
        url: 'epay-scan',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.DEPOSIT', // 存款查詢
        icon: 'icon_slider_deposit',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'deposit',
        url_params: {}
        , subMenu: (!!SUB_MENU['deposit'] && !!SUB_MENU['deposit']['data']) ? SUB_MENU['deposit']['data'] : []
    }
    , {
        name: 'LEFT_MENU.TRANSFER', // 轉帳服務
        icon: 'icon_slider_exchange',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'transfer',
        url_params: {}
        , subMenu: [
            // 台幣轉帳
            {
                name: 'FUNC_SUB.TRANSFER.TWD', url: 'twd-transfer'
            }
            // 預約轉帳查詢及註銷
            , {
                name: 'FUNC_SUB.TRANSFER.RESERVE', url: 'reservation-search-writeoff'
            }
            // // 綜活存轉綜定存
            // , {
            //     name: 'FUNC_SUB.TRANSFER.TO_TIME', url: 'current-to-fixed'
            // }
            // // 綜定存中途解約
            // , {
            //     name: 'FUNC_SUB.TRANSFER.RELEASE', url: 'fixed-release'
            // }
        ]
    }
    // 無卡提款
    , {
      name: 'LEFT_MENU.CARDLESS', // 無卡提款
      icon: 'icon_slider_nocard',
      hasSubMenu: true,
      enabled: true,
      display_role: false,
      url: 'nocard',
      url_params: {}
      , subMenu: [
           // 預約無卡提款
           {
              name: 'FUNC_SUB.CARDLESS.RESERVE_TRANS', url: 'nocardreservationkey'
          }
          // 交易紀錄查詢
          , {
              name: 'FUNC_SUB.CARDLESS.SEARCH_TRANS', url: 'nocardrecordkey'
          }
          // 無卡提款帳號設定
          , {
              name: 'FUNC_SUB.CARDLESS.ACCOUNT_SET', url: 'nocardagreementkey'
          }
        ]
    }
    , {
        name: 'LEFT_MENU.CREDIT_CARD', // 信用卡
        icon: 'icon_slider_card',
        hasSubMenu: false,
        enabled: true,
        display_role: false,
        // url: 'card',
        url: 'web:card',
        url_params: {}
    }
    , {
        name: 'LEFT_MENU.FOREIGN_EXCHANGE', // 外匯業務
        icon: 'icon_slider_foreign',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'foreign-exchange',
        url_params: {}
        , subMenu: (!!SUB_MENU['foreign-exchange'] && !!SUB_MENU['foreign-exchange']['data']) ? SUB_MENU['foreign-exchange']['data'] : []
    }
    , {
        name: 'LEFT_MENU.INVESTMENT', // 投資理財
        icon: 'icon_slider_fund',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'fund',
        url_params: {}
        , subMenu: [
            // 基金投資損益報告
            {
                name: 'FUNC_SUB.FUND.BALANCE_REPORT', url: 'fund-report' // 基金投資損益報告
            },
            // 智富投資損益報告
            {
                name: 'FUNC_SUB.FUND.SMART_REPORT', url: 'rich-report' // 智富投資損益報告
            },
            // 基金已實現損益查詢
            {
                name: 'FUNC_SUB.FUND.REALIZE_SEARCH', url: 'has-realize-type' // 基金已實現損益查詢
            },
            // 基金申購
            {
                name: 'FUNC_SUB.FUND.PURCHASE', url: 'fund-purchase' // 基金申購
            },
            // 基金贖回
            {
                name: 'FUNC_SUB.FUND.REDEEM', url: '' // 基金贖回
            },
            // 基金轉換
            {
                name: 'FUNC_SUB.FUND.CONVERT', url: 'fund-convert' // 基金轉換
            },
            // 定期(不)定額查詢/異動
            {
                name: 'FUNC_SUB.FUND.TermsSipOti', url: 'fund-pay-change' // 定期(不)定額查詢/異動
            },
            // 查詢/取消預約
            {
                name: 'FUNC_SUB.FUND.FORWARD_SEARCH', url: 'fund-reserve-cancel' // 查詢/取消預約
            },
            // 停損獲利點通知
            {
                name: 'FUNC_SUB.FUND.AUDIT_NOTIFY', url: 'fund-income-notify' // 停損獲利點通知
            }
        ]
    }
    , {
        name: 'LEFT_MENU.LOAN',  // 線上申貸
        icon: 'icon_slider_loan',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'online-loan',
        url_params: {}
        , subMenu: [
            //線上申貸選單
            {
                name: 'FUNC_SUB.LOAN.MORTGAGE_INCREASE', url: 'online-loan-menu'
            },
            // 房貸增貸
            {
                name: 'FUNC_SUB.LOAN.MORTGAGE_INCREASE', url: 'mortgage-increase'
            },
            {
                name: 'FUNC_SUB.LOAN.CREDIT_LOAN', url: 'credit-loan'
            },
            {
                name: 'FUNC_SUB.LOAN.FILE_UPLOAD', url: 'file-upload'
            },
            {
                name: 'FUNC_SUB.LOAN.SCHEDULE_QUERY', url: 'schedule-query'
            },
            {
                name: 'FUNC_SUB.LOAN.SIGN_PROTECTION', url: 'sign-protection'
            },
            {
                name: 'FUNC_SUB.LOAN.CONTRACT_DOWNLOAD', url: 'contract-download'
            }
        ]
    }
    , {
        name: 'LEFT_MENU.CREDIT', // 授信業務
        icon: 'icon_slider_loan',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'credit',
        url_params: {}
        , subMenu: (!!SUB_MENU['credit'] && !!SUB_MENU['credit']['data']) ? SUB_MENU['credit']['data'] : []
    }
    // // 第二階段功能，暫時關閉
    , {
        name: 'LEFT_MENU.GOLD', // 黃金存摺
        icon: 'icon_slider_gold',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'gold-business',
        url_params: {}
        , subMenu: [
            // 黃金交易明細查詢
            {
                name: 'FUNC_SUB.GOLD.OVERVIEW', url: 'gold-detail'
            }
            // 黃金存摺牌價
            , {
                name: 'FUNC_SUB.FINANCIAL.GOLD', url: 'gold'
            }
            // 黃金存摺申請啟用
            , {
                name: 'FUNC_SUB.GOLD.APPLY', url: 'gold-apply'
            }
            // 黃金買進
            , {
                name: 'FUNC_SUB.GOLD.BUY', url: 'gold-buy'
            }
            // 黃金回售
            , {
                name: 'FUNC_SUB.GOLD.SELL', url: 'gold-detail'
            }
            // 黃金定期定額買進/變更/終止
            , {
                name: 'FUNC_SUB.GOLD.TERMS', url: 'gold-terms'
            }
        ]
    }
    , {
        name: 'SLIDER_MENU.TAX', // 繳稅費
        icon: 'icon_slider_bill',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'taxes-fees',
        url_params: {}
        , subMenu: [
            // 各類稅費款
            {
                name: 'FUNC_SUB.TAX.TAX', url: 'taxes'
            }
            // 中華電信費
            , {
                name: 'FUNC_SUB.TAX.HINET', url: 'hinet-fee'
            }
            // 台灣自來水費
            , {
                name: 'FUNC_SUB.TAX.WATER', url: 'water'
            }
            // 臺北自來水費
            , {
                name: 'FUNC_SUB.TAX.TAIPEI_WATER', url: 'taipei-water'
            }
            // 電費
            , {
                name: 'FUNC_SUB.TAX.ELECT', url: 'electricity'
            }
            // 健保費
            , {
                name: 'FUNC_SUB.TAX.HEALTH', url: 'labor-health-national'
            }
            // 勞保費
            , {
                name: 'FUNC_SUB.TAX.LABOR', url: 'labor-health-national'
            }
            // 國民年金保費
            , {
                name: 'FUNC_SUB.TAX.NATIONAL', url: 'labor-health-national'
            }
            // e-Bill全國繳費網
            , {
                name: 'FUNC_SUB.TAX.EBILL', url: 'web:ebill'
            }
        ]
    }
    , {
        name: 'LEFT_MENU.USER_SET', // 個人設定(整合安控管理&其他服務)
        icon: 'icon_slider_save',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'user-set',
        url_params: {}
        , subMenu: [
            // 快速登入/交易設定
            {
                name: 'FUNC_SUB.USER_SET.BIOMETIC', url: 'security_ftlogin_set'
            }
            // 常用帳號設定
            , {
                name: 'FUNC_SUB.USER_SET.COMM_ACNT', url: 'commonAccount'
            }
            // 約定轉入帳號設定
            , {
                name: 'FUNC_SUB.USER_SET.AGREED_ACNT', url: 'agreedAccount'
            }
        ]
    }
    , {
        name: 'LEFT_MENU.FINANCIAL', // 金融資訊
        icon: 'icon_slider_financial',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'financial',
        url_params: {}
        , subMenu: (!!SUB_MENU['financial'] && !!SUB_MENU['financial']['data']) ? SUB_MENU['financial']['data'] : []
    }
    , {
        name: 'FUNC.OTHER', // 其他服務
        icon: 'icon_slider_othifo',
        hasSubMenu: true,
        enabled: true,
        display_role: false,
        url: 'other-service',
        url_params: {}
        , subMenu: [
            // 醫療服務
            {
                name: 'FUNC_SUB.OTHER.HOSPITAL', url: 'hospital'
                , icon: 'icon_slider_hospital'
            }
            // 產壽險服務
            , {
                name: 'FUNC_SUB.OTHER.INSURANCE', url: 'insurance'
                , icon: 'icon_slider_protection'
            }
            // 理財金庫
            , {
                name: 'FUNC_SUB.OTHER.MONEYDJ', url: 'web:moneydj'
                , icon: 'icon_slider_mgt'
            }
            // 智能客服
            , {
                name: 'FUNC_SUB.OTHER.ROBOT', url: 'web:robot'
                , icon: 'icon_slider_service'
            }
            // 下單開戶
            , {
                name: 'FUNC_SUB.OTHER.LUCKYDRAW', url: 'web:luckydraw'
                , icon: 'icon_slider_buy'
            }
            // 線上取號
            , {
                name: 'FUNC_SUB.OTHER.OTN', url: 'take-number'
                , icon: 'icon_slider_ticket'
            }
            // // 雲端發票 [20190722 電金要求移除]
            // , {
            //     name: 'FUNC_SUB.OTHER.EINVOICE', url: 'web:einvoice'
            //     , icon: 'icon_slider_cloud'
            // }
            // // HCE [20190722 電金要求移除]
            // , {
            //     name: 'FUNC_SUB.OTHER.HCE', url: 'app:hce'
            //     , icon: 'icon_slider_hce'
            // }
            // // 生活資訊 [20190508 需求單移除]
            // , {
            //     name: 'FUNC_SUB.OTHER.MWEBEASYINFO', url: 'web:mWebEasyInfo'
            //     , icon: 'icon_slider_life'
            // }
            // 網路預約投保
            , {
                name: 'FUNC_SUB.FRONT_DESK.ONLINE_INSURANCE', url: 'web:onlineInsurance'
                , icon: 'icon_insurance'
            }
            // 服務據點
            , {
                name: 'FUNC.LOCATION', url: 'locationkey'
                , icon: 'icon_slider_location'
            }
            // 線上櫃台
            , {
                name: 'FUNC.FRONT_DESK', url: 'front-desk'
                , icon: 'icon_slider_infor'
            }
            // 友善行動網銀
            , {
              name: 'FUNC_SUB.FRONT_DESK.FRIENDLY_EBANK', url: 'friendly'
              , icon: 'icon_slider_accessibility'
          }
        ]
    }
];

ALL_SLIDER.forEach((item, item_key) => {
    if (!!item.enabled && !!item.hasSubMenu
        && typeof item['subMenu'] !== 'undefined'
        && (item['subMenu'] instanceof Array)
    ) {
        const tmp_icon = item.icon;
        item['subMenu'].forEach(sub_item => {
            if (typeof sub_item['icon'] === 'undefined' || sub_item['icon'] == '') {
                sub_item['icon'] = tmp_icon;
            }
        });
    }
});
// console.log('slider', JSON.parse(JSON.stringify(ALL_SLIDER)));


export const MENU_SETTING = {
    // 不會動的選項
    'FIX': [
        {
            name: 'MAIN_MENU.ONSCAN', // 掃描條碼
            icon: 'icon_epay01',
            enabled: true,
            need_login: true,
            url: 'epay-scan',
            auth: false
        },
        {
            name: 'MAIN_MENU.SHOWPAY', // 出示付款碼
            icon: 'icon_epay02',
            enabled: true,
            need_login: true,
            url: 'qrcodeShowPayFromHome',
            auth: false
        },
        // {
        //     name: 'MAIN_MENU.SHOWRECEIPT', // 出示收款碼
        //     icon: 'icon_epay02',
        //     enabled: true,
        //     need_login: true,
        //     url: 'qrcodeShowReceipt',
        //     auth: false
        // },
        {
            name: 'MAIN_MENU.TRANSFER', // 轉帳
            icon: 'icon_epay03',
            enabled: true,
            need_login: true,
            url: 'twd-transfer',
            auth: false
            }
            ,
        {
          name: '三倍券綁定',
          icon: 'icon_tricoupon',
          enabled: true,
          need_login: false,
          url: 'web:tricoupon',
          auth: false
        }
    ],
    // 快捷選單（設定）
    ALL_SLIDER: ALL_SLIDER,
    // 可滑動的選項(預設值)
    'SLIDER': [
        //--------20190920 Boy 因應合庫需求變更-------//
        //--------20190925 Boy 因應合庫需求變更-------//
        // {
        //     name: 'MAIN_MENU.EPAY', // 合庫E-Pay
        //     icon: 'icon_slider_epay',
        //     enabled: true,
        //     need_login: true,
        //     // url: 'web:epay',
        //     url: 'epay-scan',
        //     auth: false
        // },
        {
            name: 'MAIN_MENU.DEPOSIT', // 存款查詢
            icon: 'icon_slider_deposit',
            enabled: true,
            need_login: true,
            url: 'deposit',
            auth: false
        },
        {
            name: 'MAIN_MENU.FINANCIAL', // 金融資訊
            icon: 'icon_slider_financial',
            enabled: true,
            need_login: true,
            url: 'financial',
            auth: false
        },
        {
            name: 'MAIN_MENU.INVESTMENT', // 投資理財
            icon: 'icon_slider_fund',
            enabled: true,
            need_login: false,
            url: 'fund',
            auth: false
        },
        {
            name: 'MAIN_MENU.TICKET', // 線上取號
            icon: 'icon_slider_ticket',
            enabled: true,
            need_login: false,
            url: 'take-number',
            auth: false
        },
        {
            name: 'MAIN_MENU.NEWS', // 最新消息
            icon: 'icon_slider_news',
            enabled: true,
            need_login: false,
            url: 'news',
            auth: false
        },
        {
            name: 'MAIN_MENU.CREDIT_CARD', // 信用卡
            icon: 'icon_slider_card',
            enabled: true,
            need_login: false,
            url: 'web:card',
            auth: false
        },
        {
            name: 'MAIN_MENU.CUSTOMER_SERVICE', // 智能客服
            icon: 'icon_slider_service',
            enabled: true,
            need_login: true,
            url: 'web:robot',
            auth: false
        },
        {
          name: 'LEFT_MENU.CARDLESS', // 無卡提款
          icon: 'icon_slider_nocard',
          enabled: true,
          need_login: true,
          url: 'nocard',
          auth: false
        },
        {
            name: 'MAIN_MENU.FOREIGN_EXCHANGE', // 外匯業務
            icon: 'icon_slider_foreign',
            enabled: true,
            need_login: true,
            url: 'foreign-exchange',
            auth: false
        },
        {
            name: 'FUNC.CREDIT', // 授信業務
            icon: 'icon_slider_loan',
            enabled: true,
            need_login: true,
            url: 'credit',
            auth: false
        },
        {
            name: 'MAIN_MENU.TAX', // 各項費用稅款
            icon: 'icon_slider_bill',
            enabled: true,
            need_login: true,
            url: 'taxes-fees',
            auth: false
        },
        // 20190920 Boy 原為無卡提款，暫改為產壽險服務
        {
            name: 'FUNC_SUB.OTHER.INSURANCE', // 產壽險服務
            icon: 'icon_slider_protection',
            enabled: true,
            need_login: false,
            url: 'insurance',
            auth: false
        },
        // 20190923 wei 原epay移除，故追加
        {
            name: 'FUNC_SUB.OTHER.HOSPITAL', // 醫療服務
            icon: 'icon_slider_hospital',
            enabled: true,
            need_login: false,
            url: 'hospital',
            auth: false
        }

        //--------20190920 Boy 因應合庫需求變更-------//
    ]
};

