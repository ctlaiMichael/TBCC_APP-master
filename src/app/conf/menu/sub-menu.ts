/**
 * 請設定子選單
 * [異動紀錄]
 * 20191216 證券下單開戶調整
 *      1. 將「線上櫃台 > 證券線上開戶」更為「證券下單開戶」，連結同「下單開戶」
 *      2. 刪除「其他服務 > 下單開戶」
 * 20200113 線上申貸
 */

export const SUB_MENU = {
    // ======================================== 主要功能 ======================================== //
    // -------------------- [存款查詢] -------------------- //
    'deposit': {
        menuType: '1',
        data: [
            // 帳務總覽
            {
                name: 'FUNC_SUB.DEPOSIT.SUMMARY', url: 'user-asset'
            },
            // 台幣存款總覽
            {
                name: 'FUNC_SUB.DEPOSIT.OVERVIEW', url: 'deposit-overview'
            }
            // 存款不足票據查詢
            , {
                name: 'FUNC_SUB.DEPOSIT.INSUFFICIENT', url: 'deposit-insufficient-bill'
            }
            // 當日匯入匯款查詢
            , {
                name: 'FUNC_SUB.DEPOSIT.DAY_REMITTANCE', url: 'deposit-day-remittance'
            }
            // 外幣存款查詢
            , {
                name: 'FUNC_SUB.FOREX.OVERVIEW', url: 'foreign-exchange-inquiry'
            }
            // 第一階段暫時不開放
            // 黃金交易明細查詢
            // , {
            //     name: 'FUNC_SUB.GOLD.OVERVIEW', url: 'gold-deposit'
            // }
        ]
    },
    // -------------------- [存款查詢 End] -------------------- //
    // -------------------- [外匯業務] -------------------- //
    'foreign-exchange': {
        menuType: '1',
        data: [
            // 外幣存款查詢
            {
                name: 'FUNC_SUB.FOREX.OVERVIEW', url: 'foreign-exchange-inquiry'
            }
            // 台幣轉外幣
            , {
                name: 'FUNC_SUB.FOREX.TWD_TO_FOREX', url: 'foreign-exchange-twd-to-foreign'
            }
            // 外幣轉台幣
            , {
                name: 'FUNC_SUB.FOREX.FOREX_TO_TWD', url: 'foreign-exchange-foreign-to-twd'
            }
            // 外幣存款轉帳
            , {
                name: 'FUNC_SUB.FOREX.FOREX_TO_FOREX', url: 'foreign-exchange-foreign-to-foreign'
            }
            // 綜活存轉綜定存
            , {
                name: 'FUNC_SUB.FOREX.TO_TIME', url: 'foreign-exchange-demand-to-time'
            }
            // 綜定存中途解約
            , {
                name: 'FUNC_SUB.FOREX.RELEASE', url: 'foreign-exchange-time-deposit-terminate'
            }
            // 預約外幣轉帳查詢
            , {
                name: 'FUNC_SUB.FOREX.RESERVE', url: 'foreign-exchange-reservation-inquiry'
            }
            // 外幣繳保費
            , {
                // name: '外幣繳保費', url: 'foreign-exchange-insurance'
                name: 'FUNC_SUB.FOREX.INSURANCE', url: 'foreign-insurance-pay'
            }
            // 累計結匯查詢
            , {
                name: 'FUNC_SUB.FOREX.QUOTA', url: 'foreign-exchange-personal-quota'
            }
             // 匯率到價通知
            , {
              name: 'FUNC_SUB.MSG_OVERVIEW.RATE_INFORM_SETTING', url: 'rate-inform'
            }
        ]
    },
    // -------------------- [外匯業務 End] -------------------- //
    // -------------------- [黃金存摺] -------------------- //
    'gold-business': {
        menuType: '1',
        data: [
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
                name: 'FUNC_SUB.GOLD.SELL', url: 'gold-sell'
            }
            // 黃金定期定額買進/變更/終止
            , {
                name: 'FUNC_SUB.GOLD.TERMS', url: 'gold-terms'
            }

        ]
    },
    // -------------------- [黃金存摺 End] -------------------- //
    // -------------------- [授信業務] -------------------- //
    'credit': {
        menuType: '1',
        data: [
            // 借款查詢
            {
                name: 'FUNC_SUB.CREDIT.INQUIRY', url: 'credit-inquiry'
            }
            // 繳納借款本息
            , {
                name: 'FUNC_SUB.CREDIT.PAYMENT', url: 'credit-payment'
            }
        ]
    },
    // -------------------- [授信業務 End] -------------------- //
    // -------------------- [轉帳服務] -------------------- //
    'transfer': {
        menuType: '1',
        data: [
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
            // 台幣轉外幣
            , {
                name: 'FUNC_SUB.FOREX.TWD_TO_FOREX', url: 'transfer-twd-to-foreign'
            }
            // 外幣轉台幣
            , {
                name: 'FUNC_SUB.FOREX.FOREX_TO_TWD', url: 'transfer-foreign-to-twd'
            }
            // 外幣存款轉帳
            // , {
            //     name: 'FUNC_SUB.FOREX.FOREX_TO_FOREX', url: 'foreign-exchange-foreign-to-foreign'
            // }
        ]
    },
    // -------------------- [轉帳服務 End] -------------------- //
    // -------------------- [繳交各項費用稅款] -------------------- //
    'taxes-fees': {
        menuType: '1',
        data: [
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
                name: 'FUNC_SUB.TAX.HEALTH', url: 'health-insurance'
            }
            // 勞保費
            , {
                name: 'FUNC_SUB.TAX.LABOR', url: 'labor-insurance'
            }
            // 國民年金保費
            , {
                name: 'FUNC_SUB.TAX.NATIONAL', url: 'national-annuity'
            }
            // 學費
            , {
                name: 'FUNC_SUB.TAX.TUITION', url: 'tuition'
            }
            // 汽機車燃料使用費
            , {
                name: 'FUNC_SUB.TAX.FUEL', url: 'fuel-fee'
            }
            // e-Bill全國繳費網
            , {
                name: 'FUNC_SUB.TAX.EBILL', url: 'web:ebill'
            }
        ]
    },
    // -------------------- [繳交各項費用稅款 End] -------------------- //
    // -------------------- [無卡提款] -------------------- //
    'nocard': {
        menuType: '1',
        data: [
            // 預約無卡提款
            {
                name: 'FUNC_SUB.CARDLESS.RESERVE_TRANS', url: 'nocardreservationkey'
            }
            // 交易紀錄查詢
            , {
                name: 'FUNC_SUB.CARDLESS.SEARCH_TRANS', url: 'nocardrecordkey'
            }
            // 交易紀錄查詢-交易明細
            , {
              name: 'FUNC_SUB.CARDLESS.SEARCH_DETAIL', url: 'nocarddetailrecordkey'
            }
            // 無卡提款帳號設定
            , {
                name: 'FUNC_SUB.CARDLESS.ACCOUNT_SET', url: 'nocardagreementkey'
            }
            // // ATM待綁定帳號
            // , {
            //     name: 'FUNC_SUB.TRANSFER.RELEASE', url: 'fixed-release'
            // }
        ]
    },
    // -------------------- [無卡提款 End] -------------------- //
    // -------------------- [個人設定] -------------------- //
    'user-set': {
        // 5/2 整併為個人設定
        menuType: '2',
        data: [
            {
                // 轉帳機制管理
                titleName: 'FUNC_SUB.USER_SET.GROUP_TRANS',
                content: [
                    // 憑證服務
                    {
                        name: 'FUNC_SUB.USER_SET.TRANS_CA', url: 'certificateService'
                    }
                    // OTP服務
                    , {
                        name: 'FUNC_SUB.USER_SET.TRANS_OTP', url: 'otp-service'
                    }
                    // 裝置綁定服務
                    , {
                        name: 'FUNC_SUB.USER_SET.TRANS_DEVICE', url: 'device-bind'
                    }
                    // SSL轉帳密碼變更
                    , {
                        name: 'FUNC_SUB.USER_SET.TRANS_SSL', url: 'sslChg'
                    }
                ]
            },
            {
                // 個人資訊管理
                titleName: 'FUNC_SUB.USER_SET.GROUP_USER',
                content: [
                    // 通訊地址變更
                    {
                        name: 'FUNC_SUB.USER_SET.USER_ADDRE', url: 'addressChg'
                    }
                    // E-mail變更
                    , {
                        name: 'FUNC_SUB.USER_SET.USER_EMAIL', url: 'mailChg'
                    }
                    // 綜合對帳單服務
                    , {
                        name: 'FUNC_SUB.USER_SET.USER_BILL', url: 'statementMenu'
                    }
                ]
            },
            {
                // 登入管理
                titleName: 'FUNC_SUB.USER_SET.GROUP_LOGIN',
                content: [
                    // 網路連線密碼變更
                    {
                        name: 'FUNC_SUB.USER_SET.USER_PSWD', url: 'netPwdChg'
                    }
                    // 網路連線代號變更
                    , {
                        name: 'FUNC_SUB.USER_SET.USER_ID', url: 'netCodeChg'
                    }
                    // 快速登入/交易設定
                    , {
                        name: 'FUNC_SUB.USER_SET.BIOMETIC', url: 'security_ftlogin_set'
                    }
                ]
            },
            {
                // 其他服務
                titleName: 'FUNC_SUB.USER_SET.GROUP_OTHER',
                content: [
                    // 常用帳號設定
                    {
                        name: 'FUNC_SUB.USER_SET.COMM_ACNT', url: 'commonAccount'
                    }
                    // 約定轉入帳號設定
                    , {
                        name: 'FUNC_SUB.USER_SET.AGREED_ACNT', url: 'agreedAccount'
                    }
                    // 共同行銷
                    , {
                        name: 'FUNC_SUB.USER_SET.MARKETING', url: 'commonMarket'
                    }
                    // 掛失服務
                    , {
                        name: 'FUNC_SUB.USER_SET.LOSS', url: 'lost-report'
                    }
                     // 通知設定
                     , {
                        name: 'FUNC_SUB.MSG_OVERVIEW.SETTINGS', url: 'msg-overview-settings'
                    }
                    // 編輯版面
                    , {
                        name: '編輯版面', url: 'edit_mainBlock'
                    }
                    // 系統資訊
                    , {
                        name: 'FUNC_SUB.USER_SET.SYSTEM', url: 'systemInfo'
                    }

                ]
            }
        ]
    },
    // -------------------- [個人設定 End] -------------------- //

    // ======================================== 其他功能 ======================================== //
    // -------------------- [最新消息] -------------------- //
    'news': {
        menuType: '1',
        data: [
            // 最新消息
            {
                name: 'FUNC.NEWS', url: 'news-board'
            }
            // 優惠活動資訊
            , {
                name: 'FUNC_SUB.NEWS.ABOUTHOT', url: 'web:abouthot'
            }
            // 信用卡活動資訊
            , {
                name: 'FUNC_SUB.NEWS.CARDHOT', url: 'web:creditcard'
            }
        ]
    },
    // -------------------- [最新消息 End] -------------------- //
    // -------------------- [金融資訊] -------------------- //
    'financial': {
        menuType: '1',
        data: [
            // 黃金存摺牌價
            {
                name: 'FUNC_SUB.FINANCIAL.GOLD', url: 'gold'
            }
            // 外幣匯率
            , {
                name: 'FUNC_SUB.FINANCIAL.FOREX', url: 'exchange'
            }
            // 台幣存款利率
            , {
                name: 'FUNC_SUB.FINANCIAL.DEPOSIT_RATE', url: 'twdSave'
            }
            // 台幣放款利率
            , {
                name: 'FUNC_SUB.FINANCIAL.LOAD_RATE', url: 'twdLoan'
            }
            // 外幣存款利率
            , {
                name: 'FUNC_SUB.FINANCIAL.FOREX_DEPOSIT_RATE', url: 'foreignSave'
            }
            // 外幣放款利率
            , {
                name: 'FUNC_SUB.FINANCIAL.FOREX_LOAD_RATE', url: 'foreignLoan'
            }
            // 票券利率
            , {
                name: 'FUNC_SUB.FINANCIAL.TICKET', url: 'ticketRate'
            }
            // 債券利率
            , {
                name: 'FUNC_SUB.FINANCIAL.BOND', url: 'bondRate'
            }
            // 理財金庫 8/9 電金少玲科長與信託部討論，決定移到金融資訊
            , {
                name: 'FUNC_SUB.OTHER.MONEYDJ', url: 'web:moneydj'
            }
        ]
    },
    // -------------------- [金融資訊 End] -------------------- //
    // -------------------- [服務據點] -------------------- //
    // -------------------- [服務據點 End] -------------------- //
    // -------------------- [線上櫃台] -------------------- //
    'front-desk': {
        menuType: '1',
        data: [
            //
            { // 醫療服務
                name: 'FUNC_SUB.OTHER.HOSPITAL', url: 'hospital'
            }
            , { // 產壽險服務
                name: 'FUNC_SUB.OTHER.INSURANCE', url: 'insurance'
            }
            , { // 服務據點
                name: 'FUNC.LOCATION', url: 'locationkey'
            }
            , { // 線上取號
                name: 'FUNC_SUB.OTHER.OTN', url: 'take-number'
            }
            // 數位存款開戶
            , {
                name: 'LEFT_MENU.DIGITALDEP', url: 'web:digital'
            }
            // 線上申貸   上線先關閉之後開啟 2020/01/10
            , {
                name: 'LEFT_MENU.LOAN', url: 'online-loan-desk'
            }
            // 線上信用卡申請
            , {
                name: 'FUNC_SUB.FRONT_DESK.APPLY_CARD', url: 'web:apply'
            }
            // 2019/12/16 證劵線上開戶 => 證劵下單開戶
            // , { // 證劵線上開戶
            //     name: 'FUNC_SUB.FRONT_DESK.LUCKYDRAW', url: 'web:luckydrawRegister'
            // }
            // 證劵下單開戶
            , {
                name: 'FUNC_SUB.OTHER.LUCKYDRAW', url: 'web:luckydraw'
            }
            , { // 線上申請存款餘額證明申請
                name: 'FUNC_SUB.FRONT_DESK.ACNT_BLA_CERT', url: 'acnt-bla-cert'
            }
            , { // 網路預約投保
                name: 'FUNC_SUB.FRONT_DESK.ONLINE_INSURANCE', url: 'web:onlineInsurance'
            }
            // 預約填單
            , {
                name: 'FUNC_SUB.FRONT_DESK.RESER_FORM', url: 'reser-form'
            }
            , { // 友善行動網銀
                name: 'FUNC_SUB.FRONT_DESK.FRIENDLY_EBANK', url: 'friendly'
            }
        ]
    },
    // -------------------- [線上櫃台 End] -------------------- //
    // -------------------- [線上申貸Start] -------------------- //
    'online-loan': {
        menuType: '1',
        data: [
            // 房貸增貸
            {
                name: 'FUNC_SUB.LOAN.MORTGAGE_INCREASE', url: 'mortgage-loan'
            },
            // 信用貸款
            {
                name: 'FUNC_SUB.LOAN.CREDIT_LOAN', url: 'credit-loan'
            },
            // 申請文件上傳
            {
                name: 'FUNC_SUB.LOAN.FILE_UPLOAD', url: 'main-upload'
            },
            // 進度查詢
            {
                name: 'FUNC_SUB.LOAN.SCHEDULE_QUERY', url: 'schedule-query'
            },
            // 簽約對保
            {
                name: 'FUNC_SUB.LOAN.SIGN_PROTECTION', url: 'sign-protection'
            },
            // 約據下載
            {
                name: 'FUNC_SUB.LOAN.CONTRACT_DOWNLOAD', url: 'contract-download'
            }
            // bail-out-loan 勞工紓困方案
            // ,{
            //     name: 'FUNC_SUB.LOAN.BAIL_OUT_LOAN', url: 'bail-out-loan'
            // }
        ]
    },
    // -------------------- [線上申貸 End] -------------------- //

    // -------------------- [預約填單] -------------------- //
    'reser-form': {
        menuType: '1',
        data: [
            // 預約填單-台幣存款
            {
                name: 'FUNC_SUB.RESER_FORM.RESER_DEPOSIT', url: 'web:reser-deposit'
            }
            // 預約填單-台幣提款
        , {
                name: 'FUNC_SUB.RESER_FORM.RESER_WITHDRAWAL', url: 'web:reser-withdrawal'
            }
            // 預約填單-台幣自行轉帳
            , {
                name: 'FUNC_SUB.RESER_FORM.RESER_TRANSFER', url: 'web:reser-transfer'
            }
            // 預約開立一般存款帳戶
            , {
                name: 'FUNC_SUB.RESER_FORM.RESER_NORM', url: 'web:reser-norm'
            }
        ]
    },
    // -------------------- [預約填單 End] -------------------- //
    // ======================================== 特殊專區 ======================================== //
    // -------------------- [醫療服務&產壽險服務] -------------------- //
    // -------------------- [醫療服務&產壽險服務 End] -------------------- //
    // -------------------- [合庫E Pay] -------------------- //
    'epay': {
        menuType: '1',
        data: [
            // 掃描QRCode
            {
                name: 'FUNC_SUB.EPAY.ONSCAN', url: 'epayscan'
            }
            // 出示付款碼
            , {
                name: 'FUNC_SUB.EPAY.SHOWPAY', url: 'qrcodeShowPay'
            }
            // 出示收款碼
            , {
                name: 'FUNC_SUB.EPAY.SHOWRECEIPT', url: 'qrcodeShowReceipt'
            }
            // 推薦人設定
            , {
                name: 'FUNC_SUB.EPAY.RECOMMEND', url: 'referenceEdit'
            }
            // 開通SmartPay使用條款/設定帳號
            , {
                name: 'FUNC_SUB.EPAY.SMART_PAY', url: 'qrcodePayTerms'
            }
            // 信用卡新增/變更預設
            , {
                name: 'FUNC_SUB.EPAY.CARD', url: 'qrcodePayCardTerms'
            }
            // 台灣Pay消費據點查詢
            , {
                name: 'FUNC_SUB.EPAY.LOCATION', url: 'web:epay-location'
            }
            // 發票載具號碼
            , {
                name: 'FUNC_SUB.EPAY.INVOICE', url: 'invoice'
            }
            // 設定領獎帳號
            , {
                name: 'FUNC_SUB.EPAY.SET_ACCT', url: 'setacct'
            }
            // 變更手機條碼驗證碼
            , {
                name: 'FUNC_SUB.EPAY.VERIFICATION', url: 'verification'
            }
            // 交易紀錄/退貨
            , {
                name: 'FUNC_SUB.EPAY.SEARCH', url: 'search'
            }
            // 快速登入/交易設定
            , {
                name: 'FUNC_SUB.EPAY.FLOGIN', url: 'epay_security_ftlogin_set'
            }
        ]
    },
    // -------------------- [合庫E Pay End] -------------------- //
// -------------------- [信用卡登入合庫E Pay] -------------------- //
    'cardLogin_epay': {
        menuType: '1',
        data: [
            // 掃描QRCode
            {
                name: 'FUNC_SUB.EPAY.ONSCAN', url: 'cardlogin-epayscan'
            }
            // 出示付款碼
            , {
                name: 'FUNC_SUB.EPAY.SHOWPAY', url: 'cardlogin-qrcodeShowPay'
            }
            // 信用卡新增/變更預設
            , {
                name: 'FUNC_SUB.EPAY.CARD', url: 'cardlogin-qrcodePayCardTerms'
            }
            // 台灣Pay消費據點查詢
            , {
                name: 'FUNC_SUB.EPAY.LOCATION', url: 'web:epay-location'
            }
            // 交易紀錄/退貨
            , {
                name: 'FUNC_SUB.EPAY.SEARCH', url: 'cardlogin-search'
            }
            // 快速登入/交易設定
            , {
                name: 'FUNC_SUB.EPAY.FLOGIN', url: 'security_ftlogin_set'
            }
        ]
    },
    // -------------------- [信用卡登入合庫E Pay End] -------------------- //
    // -------------------- [信用卡] -------------------- //
    'card': {
        menuType: '1',
        data: [
        ]
    },
    //額度調整
    'card-quota-menu': {
        menuType: '1',
        data: [
            //額度調整
            {
                name: '額度調整', url: 'card-quota'
            },
            //補件上傳
            {
                name: '補件上傳', url: 'card-main-upload'
            }
        ]
    },
    // -------------------- [信用卡 End] -------------------- //
    // -------------------- [投資理財] -------------------- //
    'fund': {
        menuType: '2',
        data: [
            {
                // 基金損益報告
                titleName: 'FUNC_SUB.FUND.GROUP_REPORT',
                content: [
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
                    // 我的觀察清單
                    {
                        name: 'FUNC_SUB.FUND.FUND_GROUP', url: 'fund-group-set' // 投資組合查詢
                    },
                    // 投資組合設定
                    {
                        name: 'FUNC_SUB.FUND.FUND_GROUP_EDIT', url: 'fund-group-set-edit' // 投資組合設定
                    }
                ]
            },
            {
                // 基金交易功能
                titleName: 'FUNC_SUB.FUND.GROUP_TRANS',
                content: [
                    // 基金申購
                    {
                        name: 'FUNC_SUB.FUND.PURCHASE', url: 'fund-purchase' // 基金申購
                    },
                    // 基金贖回
                    {
                        name: 'FUNC_SUB.FUND.REDEEM', url: 'fund-redeem' // 基金贖回
                    },
                    // 基金轉換
                    {
                        name: 'FUNC_SUB.FUND.CONVERT', url: 'fund-convert' // 基金轉換
                    },
                    // 定期(不)定額查詢/異動
                    {
                        name: 'FUNC_SUB.FUND.TermsSipOti', url: 'fund-pay-change' // 定期(不)定額查詢/異動
                    },
                    // 現金收益存入帳號異動
                    {
                        name: 'FUNC_SUB.FUND.TermsProfitAcnt', url: 'fund-deposit-account' // 現金收益存入帳號異動
                    },
                    // 查詢/取消預約
                    {
                        name: 'FUNC_SUB.FUND.FORWARD_SEARCH', url: 'fund-reserve-cancel' // 查詢/取消預約
                    },
                ]
            },
            {
                // 其他
                titleName: 'FUNC_SUB.FUND.GROUP_OTHER',
                content: [
                    // // 我的觀察清單
                    // {
                    //     name: 'FUNC_SUB.FUND.FUND_GROUP', url: 'fund-group-set' // 投資組合查詢
                    // },
                    // // 投資組合設定
                    // {
                    //     name: 'FUNC_SUB.FUND.FUND_GROUP_EDIT', url: 'fund-group-set-edit' // 投資組合設定
                    // },
                    // 風險承受度測驗
                    {
                        name: 'FUNC_SUB.FUND.KYC', url: 'fund-group-resk-test' // 風險承受度測驗
                    },
                    // 停損/獲利點設定
                    {
                        name: 'FUNC_SUB.FUND.SET_AUDIT', url: 'fund-balance-set' // 停損/獲利點設定
                    },
                    // 停損/停利點通知
                    {
                        name: 'FUNC_SUB.FUND.AUDIT_NOTIFY', url: 'fund-income-notify' // 停損/停利點通知
                    },
                    // 信託對帳單寄送方式
                    // {
                    //     name: 'FUNC_SUB.FUND.SET_MAIL', url: 'fund-statement' // 信託對帳單寄送方式
                    // },
                    // 信託業務推介
                    {
                        name: 'FUNC_SUB.FUND.FUND_RECOMMENDATION', url: 'fund-recommendation' // 信託業務推介
                    }
                ]
            }
        ]
    },
    // -------------------- [投資理財 End] -------------------- //

    // -------------------- [其他服務] -------------------- //
    'other-service': {
        menuType: '1',
        data: [
            // 醫療服務
            //{
            //    name: 'FUNC_SUB.OTHER.HOSPITAL', url: 'hospital'
            //}
            // 產壽險服務
            //, {
            //    name: 'FUNC_SUB.OTHER.INSURANCE', url: 'insurance'
            //}
            // 理財金庫 8/9 電金少玲科長與信託部討論，決定移到金融資訊
            // , {
            //     name: 'FUNC_SUB.OTHER.MONEYDJ', url: 'web:moneydj'
            // }
            // 智能客服
            {
                name: 'FUNC_SUB.OTHER.ROBOT', url: 'web:robot'
            }
            // 2019/12/16 證劵線上開戶 => 證劵下單開戶
            // // 下單開戶
            // , {
            //     name: 'FUNC_SUB.OTHER.LUCKYDRAW', url: 'web:luckydraw'
            // }
            // 雲端發票 [2019/7/22 電金部要求過度期功能隱藏]
            // , {
            //     name: 'FUNC_SUB.OTHER.EINVOICE', url: 'web:einvoice'
            // }
            // HCE [2019/7/22 電金部要求過度期功能隱藏]
            // , {
            //     name: 'FUNC_SUB.OTHER.HCE', url: 'app:hce'
            // }
            // // 生活資訊  [20190508 需求單移除]
            // , {
            //     name: 'FUNC_SUB.OTHER.MWEBEASYINFO', url: 'web:mWebEasyInfo'
            // }
            // 網路預約投保
            //, {
            //    name: 'FUNC_SUB.FRONT_DESK.ONLINE_INSURANCE', url: 'web:onlineInsurance'
            //}
            // 服務據點
            //, {
            //    name: 'FUNC.LOCATION', url: 'locationkey'
            //}
            // 線上櫃台
            // , {
            //     name: 'FUNC.FRONT_DESK', url: 'front-desk'
            // }
            // 導覽說明
            // , {
            //     name: '導覽說明', url: 'guide'
            // }
            // 操作說明
            // , {
            //     name: '操作說明', url: 'operating'
            // }
        ]
    }
    // -------------------- [其他服務 End] -------------------- //
};


// 範例：基礎版型
// const news_set = {
//     menuType: '1',
//     data: [
//         // 最新消息
//         {
//             name: '最新消息', url: 'news-board'
//         }
//         // e-Bill全國繳費網
//         , {
//             name: 'e-Bill全國繳費網', url: 'web:ebill'
//         }
//     ]
// };



// // 範例：群組版型
// const fund_set = {
//     menuType: '2',
//     data: [
//         // 基金損益報告
//         {
//             titleName: '基金損益報告',
//             content: [
//                 // 最新消息
//                 {
//                     name: '最新消息', url: 'news-board'
//                 }
//                 // e-Bill全國繳費網
//                 , {
//                     name: 'e-Bill全國繳費網', url: 'web:ebill'
//                 }
//             ]
//         }
//         // 基金交易功能
//         , {
//             titleName: '基金交易功能',
//             content: [
//                 // 最新消息
//                 {
//                     name: '最新消息', url: 'news-board'
//                 }
//                 // e-Bill全國繳費網
//                 , {
//                     name: 'e-Bill全國繳費網', url: 'web:ebill'
//                 }
//             ]
//         }
//     ]
// };
