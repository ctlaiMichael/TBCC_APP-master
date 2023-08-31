/**
 * Cache 設定參數處理
 * groupList: 設定群組類別，可透過刪除群組刪除相關資料
 */
export const CACHE_SET = {
    // -------------------- [銀行代碼] -------------------- //
    'bank-code': {
        ttl: 60,
        keepAlive: 'always',
        groupList: ['bank-code', 'bank-code']
    }
    // -------------------- [存摺] -------------------- //
    , 'user-home-deposit': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'user-home']
    }
    // 存款查詢 (首頁資產)
    , 'deposit-assets': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-assets', 'user-home']
    }
    , 'deposit-tw': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-tw', 'user-home']
    }
    // 存款查詢-活存明細
    , 'deposit-tw-demand': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-tw', 'deposit-tw-demand']
    }
    // 存款查詢-定存明細
    , 'deposit-tw-time': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-tw', 'deposit-tw-time']
    }
    // 存款查詢(外幣)
    , 'deposit-forex': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-forex']
    }
    // 存款查詢(外幣)-活存明細
    , 'deposit-forex-demand': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-forex', 'deposit-forex-demand']
    }
    // 存款查詢(外幣)-定存明細
    , 'deposit-forex-time': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-forex', 'deposit-forex-time']
    }
    , 'deposit-gold': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-gold']
    }
    // 台幣轉帳-可用餘額查詢
    , 'balance': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'balance']
    }
    // 外幣轉帳-可用餘額查詢
    , 'balance-forex': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'balance']
    }
    // -------------------- [金融資訊] -------------------- //
    // 黃金
    , 'gold': {
        ttl: 20,
        keepAlive: 'always',
        groupList: ['financial', 'gold']
    }
    // 外幣匯率
    , 'forex-rate': {
        ttl: 0,
        keepAlive: 'always',
        groupList: ['financial', 'forex-rate']
    }
    // 台幣存款利率
    , 'twdSave': {
        ttl: 20,
        keepAlive: 'always',
        groupList: ['financial', 'twdSave']
    }
    // 台幣放款利率
    , 'twdLoan': {
        ttl: 20,
        keepAlive: 'always',
        groupList: ['financial', 'twdLoan']
    }
    // 外幣存款利率
    , 'foreignSave': {
        ttl: 20,
        keepAlive: 'always',
        groupList: ['financial', 'foreignSave']
    }
    // 外幣放款利率
    , 'foreignLoan': {
        ttl: 20,
        keepAlive: 'always',
        groupList: ['financial', 'foreignLoan']
    }
    // 票券利率
    , 'ticketRate': {
        ttl: 20,
        keepAlive: 'always',
        groupList: ['financial', 'ticketRate']
    }
    // 債券利率
    , 'bondRate': {
        ttl: 20,
        keepAlive: 'always',
        groupList: ['financial', 'bondRate']
    }
    // -------------------- [信用卡] -------------------- //
    // 信用卡本期帳單 (首頁信用卡資產設定)
    , 'card-bill': {
        ttl: 20,
        keepAlive: 'login',
        groupList: ['card', 'user-home']
    }
    // -------------------- [授信業務] -------------------- //
    // 借款查詢
    , 'loan-inquiry': {
        ttl: 20,
        keepAlive: 'login',
        groupList: ['loan', 'loan-inquiry']
    }
    // -------------------- [轉出轉入帳號] -------------------- //
    // 台幣活存約定轉出及轉入帳號查詢
    , 'acct-deposit': {
        ttl: 0,
        keepAlive: 'login',
        groupList: ['account', 'acct-deposit']
    }
    , 'acct-forex': {
        ttl: 0,
        keepAlive: 'login',
        groupList: ['account', 'acct-forex']
    }
    , 'acct-gold': {
        ttl: 0,
        keepAlive: 'login',
        groupList: ['account', 'acct-gold']
    }
    // -------------------- [醫療產壽險] -------------------- //
    , 'hosptial': {
        ttl: 60,
        keepAlive: 'always',
        groupList: ['hosp-insurance', 'hosptial']
    }
    , 'insurance': {
        ttl: 60,
        keepAlive: 'always',
        groupList: ['hosp-insurance', 'insurance']
    }
    // -------------------- [基金] -------------------- //
    // 基金換約註記
    , 'fund-newAgrCD': {
        ttl: 60,
        keepAlive: 'login',
        groupList: ['fund-newAgrCD', 'fund-first', 'fund']
    }
    , 'fund-stock': {   // 基金庫存總覽
        ttl: 20,
        keepAlive: 'login',
        groupList: ['fund-stock', 'fund-stock-list', 'fund-report', 'fund']
    }
    , 'fund-stock-detail': {   // 基金明細
        ttl: 20,
        keepAlive: 'login',
        groupList: ['fund-stock-detail', 'fund-stock-list', 'fund-report', 'fund']
    }
    , 'fund-rich-stock': {   // 智富庫存總覽
        ttl: 20,
        keepAlive: 'login',
        groupList: ['fund-rich-stock', 'fund-rich-list', 'fund-report', 'fund']
    }
    , 'fund-rich-stock-detail': {   // 智富庫存總覽明細
        ttl: 20,
        keepAlive: 'login',
        groupList: ['fund-rich-stock-detail', 'fund-rich-list', 'fund-report', 'fund']
    }
    , 'fund-profit-loss': {   // 已實現損益查詢
        ttl: 20,
        keepAlive: 'login',
        groupList: ['fund-profit-loss', 'fund-proloss-list', 'fund-report', 'fund']
    }
    , 'fund-profit-loss-detail': {   // 已實現損益查詢明細
        ttl: 20,
        keepAlive: 'login',
        groupList: ['fund-profit-loss-detail', 'fund-proloss-list', 'fund-report', 'fund']
    }
    , 'fund-redeem': {   // 基金贖回
        ttl: 10,
        keepAlive: 'login',
        groupList: ['fund-redeem', 'fund']
    }
    , 'fund-group1': {   // 基金組合1
        ttl: 10,
        keepAlive: 'login',
        groupList: [ 'fund-group1','fund-group-set']
    }
    , 'fund-group2': {   // 基金組合2
        ttl: 10,
        keepAlive: 'login',
        groupList: ['fund-group2' ,'fund-group-set']
    }
    , 'fund-group3': {   // 基金組合3
        ttl: 10,
        keepAlive: 'login',
        groupList: [ 'fund-group3','fund-group-set']
    }
    // -------------------- [E Pay] -------------------- //
    , 'epay-security': {
        ttl: false,
        keepAlive: 'login',
        groupList: ['epay-security', 'epay']
    }
    , 'acct-epay-t': {
        ttl: 60,
        keepAlive: 'login',
        groupList: ['account', 'epay']
    }
    // 無卡提款-交易紀錄查詢
    , 'nocard-record': {
      ttl: 20,
      keepAlive: 'login',
      groupList: ['CARDLESS', 'nocard-record']
  }
};
