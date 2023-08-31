## 路由定義 routing-path.ts
{
    'KEY_NAME': {           KEY_NAME為各頁面要顯示時的名稱
        url : ''            頁面的路由設定
        urlParams : {}      參數設定queryParams 
        header: {           各頁面的Header設定
            style: string;          // 背景樣式 normal(預設)/login/user_home normal:一般頁面 user_home:登入後顯示帳戶資訊
            showMainInfo: boolean;  // 是否顯示帳戶資訊(only for user-home)
            leftBtnIcon: string;    // 'menu'為選單, 'back'時為上一頁(可在component中覆寫動作), 其他則為className
            backPath: string;       // 返回路徑預設為前頁
            title: string;          // 'logo'時顯示"合庫金庫銀行"圖片，其他則為i18n KeyName
            rightBtnIcon: string;   // nav_right_edit_button/nav_right_remind_button initPage
        }
    }
}

## 左側選單定義 left-menu.ts
{
    name: 'LEFT_MENU.DEPOSIT', 選項名稱
    icon: 'icon_am',           選項圖案
    hasSubMenu: true,          是否有子選單
    enabled: true,             是否可選
    display_role: false,       顯示權限
    url: 'home',               routing-path對應key name
    url_params: {}             傳參數
}

## 主選單定義 main-ment.ts



## 第二層選單定義 sub-menu.ts
### 基本版型：
    {
        menuType: '1',
        data: [
            // 最新消息
            {
                name: '最新消息', url: 'news-board'
            }
            , {
                name: 'e-Bill全國繳費網', url: 'web:ebill'
            }
        ]
    }

    const news_set = {
        menuType: '1',
        data: [
            // 最新消息
            {
                name: '最新消息', url: 'news-board'
            }
            // e-Bill全國繳費網
            , {
                name: 'e-Bill全國繳費網', url: 'web:ebill'
            }
        ]
    };


### 群組版型：
    {
        menuType: '2',
        data: [
            // 基金損益報告
            {
                name: '基金損益報告',
                data: [
                    // 最新消息
                    {
                        name: '最新消息', url: 'news-board'
                    }
                    // e-Bill全國繳費網
                    , {
                        name: 'e-Bill全國繳費網', url: 'web:ebill'
                    }
            }
        ]
    }

    const fund_set = {
        menuType: '2',
        data: [
            // 基金損益報告
            {
                name: '基金損益報告',
                data: [
                    // 最新消息
                    {
                        name: '最新消息', url: 'news-board'
                    }
                    // e-Bill全國繳費網
                    , {
                        name: 'e-Bill全國繳費網', url: 'web:ebill'
                    }
                ]
            }
            // 基金交易功能
            , {
                name: '基金交易功能',
                data: [
                    // 最新消息
                    {
                        name: '最新消息', url: 'news-board'
                    }
                    // e-Bill全國繳費網
                    , {
                        name: 'e-Bill全國繳費網', url: 'web:ebill'
                    }
                ]
            }
        ]
    };



---

# FIX 不會動的選項
- name: 'MAIN_MENU.TRANSFER',   選項名稱
- icon: 'icon_epay03',          選項圖案
- enabled: true,                是否可選
- need_login: true,             需要登入
- url: 'onScan',                routing-path對應key name
- auth: false                   權限
# SLIDER 可滑動的選項
- name: 'MAIN_MENU.TRANSFER',   選項名稱
- icon: 'icon_epay03',          選項圖案
- enabled: true,                是否可選
- need_login: true,             需要登入
- url: 'onScan',                routing-path對應key name
- auth: false                   權限

# 微交互選單定義 micro-interaction-menu.ts 
    default: [ // 模組名稱
        {
            id: '1',
            image_path: 'assets/images/plus03.png', // 圖片
            name: '醫療服務', // 名稱
            routing_path: 'hospital' // 路徑
        },
        {
            id: '2',
            image_path: 'assets/images/plus01.png',
            name: '信用卡',
            routing_path: 'web:card'
        },
        {
            id: '3',
            image_path: 'assets/images/plus02.png',
            name: '金融資訊',
            routing_path: 'financial'
        },
        {
            id: '4',
            image_path: 'assets/images/plus04.png',
            name: '合庫E Pay',
            routing_path: 'epay'
        }
    ]

# 微交互設定
## 設定檔介紹

### micro-func-option.ts
Key1: 每一顆的名字

定義每一顆微交互資料，包含圖片、點擊後的動線。


    // 台幣存款查詢
    , 'deposit-overview': {
        name: 'FUNC_SUB.FOREX.OVERVIEW',
        image_path: image_list['deposit-overview'],
        url: 'deposit-overview'
    }


### micro-interaction-menu.ts
Key2: 每一組的名字

定義每一組由哪四顆微交互項目組成。透過指定4個Key1


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

### routing-path.ts

決定每一頁是否開啟微交互，且使用哪一組微交互(Key2)

透過設定micro決定

不顯示時，不要設定 micro
    'deposit': {
        'url': 'deposit/menu',
        'header': {
            'title': 'FUNC.DEPOSIT'  // 存款查詢'
            , 'leftBtnIcon': 'menu'
            , 'style': 'normal'
        }
        // , 'micro': 'deposit' // 是否顯示微交互
    },


顯示時，設定 micro
    'user-asset': {
        'url': '/deposit/user-asset',
        'header': {
            'style': 'normal',
            'leftBtnIcon': 'back',
            'title': 'FUNC_SUB.DEPOSIT.SUMMARY',  // 帳務總覽',
        }
        , 'micro': 'deposit' // 是否顯示微交互
    },
