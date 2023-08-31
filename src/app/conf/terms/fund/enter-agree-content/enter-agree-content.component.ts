/**
 * 帳戶資訊
 * TW: 台幣
 * FOREX: 外幣
 * GOLD: 黃金存摺
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { DepositUtil } from '@shared/util/formate/mask/deposit-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-enter-agree-content',
    templateUrl: './enter-agree-content.component.html',
    styleUrls: [],

})
export class EnterAgreeContentComponent implements OnInit {
    /**
     * 參數處理
     */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() backType: any;
    agreeChecked = false;
    content?: string;  // 自定按鈕名稱
    content2?: string;  // 自定按鈕名稱
    content3?: string;  // 自定按鈕名稱
    content4?: string;  // 自定按鈕名稱
    content5?: string;  // 自定按鈕名稱

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
    ) {
    }

    ngOnInit() {
        let content_html = [];
        content_html.push('一、委託人（即本人）以信託資金交付受託人（即本行）為投資標的指示運用前，已確實詳閱投資標的相關資料及規定，並瞭解其投資風險，包括可能發生投資標的跌價、匯兌損失所導致之本金虧損，投資標的暫停賣出或贖回、合併及解散清算等風險，並基於委託人獨立審慎之投資判斷後，決定各項投資指示。');
        content_html.push('二、本信託資金運用管理所生資本利得及其孳息收益、投資所生風險可能導致本金發生虧損、投資所生費用及賦稅等，悉數由委託人享有或負擔，受託人不為信託本金及投資收益之保證。');
        content_html.push('三、委託人已瞭解本信託資金並非一般銀行存款，非屬中央存款保險公司承保範圍。瞭解投資標的以往績效不代表未來表現，亦不保證其最低收益。');
        content_html.push('四、委託人投資可能發生各種投資風險，委託人對上述事實及投資風險已經明瞭並同意自行承擔風險。');
        content_html.push('五、委託人應負擔之費用：依投資標的種類不同，委託人應負擔之費用亦有不同。');
        content_html.push('(一)委託人信託資金投資於國內/境外共同基金時：');
        content_html.push('1、申購手續費');
        content_html.push('(1)報酬標準：費率0％至5%，依受託人所訂費率計收。');
        content_html.push('(2)計算方法：以信託本金乘上費率計算之。');
        content_html.push('(3)支付時間及方法：單筆信託投資於申購時交付，定期定額信託投資於每次扣繳信託金額時一併計付。定期定額信託投資，每次申購手續費最低為新臺幣50元（或等值外幣）。');
        content_html.push('2、遞延申購手續費及分銷費用(後收型基金適用)：');
        content_html.push('(1)報酬標準：費率0％至5%，依受託人及基金經理公司所訂費率計收。');
        content_html.push('(2)計算方法：依贖回時市價與信託本金孰低者或依贖回時市價乘以適用費率計算之(依各基金約定為之)。');
        content_html.push('(3)支付時間及方法：於基金贖回時由基金經理公司自贖回總額中扣收。');
        content_html.push('(4)分銷費用：委託人了解並同意所投資基金產品，基金經理公司需收取分銷費用，且該費用將由基金資產中支付。');
        // tslint:disable-next-line:max-line-length
        content_html.push('3、轉換手續費');
        content_html.push('(1)報酬標準：於每次轉換時，除依各投資標的經理公司約定方式收取外，受託人另按每筆轉換計收投資國內基金新臺幣200元、境外基金新臺幣500元。');
        content_html.push('(2)計算方法：於每次基金轉換時逐次收取。');
        content_html.push('(3)支付時間及方法：由委託人給付予受託人，申請轉換時一次給付。');
        // tslint:disable-next-line:max-line-length
        content_html.push('4、信託管理費');
        content_html.push('(1)報酬標準：費率0.2%。');
        content_html.push('(2)計算方法：自申購日後滿一年起，以信託本金乘上費率乘上持有期間計算。');
        content_html.push('(3)支付時間及方法：於受託人返還贖回金額中扣除信託管理費，惟每筆最低收取費用：投資國內基金新臺幣200元、投資境外基金新臺幣500元(或等值外幣)。');
        content_html.push('5、申購時之通路服務費');
        content_html.push('(1)報酬標準：費率0％至5%。');
        content_html.push('(2)計算方法：以信託本金乘上費率計算之。');
        content_html.push('(3)支付時間及方法：由交易對手或基金經理公司於申購時給付予受託人。此服務費如係已包含於基金公開說明書所規定之費用，將由基金公司逕自各基金之每日淨資產價值中扣除。');
        // tslint:disable-next-line:max-line-length
        content_html.push('6、持有期間之通路服務費');
        content_html.push('(1) 報酬標準：年費率0％至5%。');
        content_html.push('(2) 計算方法：以受託人於交易對手或基金經理公司之淨資產價值乘上費率計算之。');
        content_html.push('(3) 支付時間及方法：由交易對手或基金經理公司給付予受託人，支付方式依各基金公司而有所不同，可能採取月、季、半年、年度支付方式為之。此服務費如係已包含於基金公開說明書所規定之費用，將由基金公司逕自各基金之每日淨資產價值中扣除。');
        // tslint:disable-next-line:max-line-length
        content_html.push('(二)如委託人信託資金投資於結構型商品(含連動債券)時，受託人收取之信託報酬另依委託人與受託人之產品說明書與特約條款	約定為之。');
        content_html.push('(三)受託人如調高前項各款信託費用時，應於受託人網站或其他依法規定之方式通知委託人；委託人如不同意，應於通知後十五日內以書面向受託人為終止	信託契約之意思表示，若於上述期間委託人未為終止信託契約之表示即視為同意。');
        content_html.push('(四)委託人瞭解並同意受託人辦理本契約項下信託業務之相關交易時，可能得自交易對手之任何費用，均係作為受託人收取之信託報酬。');
        content_html.push('(五)其他費用有關投資標的所應支付或發生之賦稅、保管費、簽證費、會計師費用，及就本信託資金交易有不可歸責於受託人之事由，而與第三人為訴訟或提付仲裁或其他交涉時所發生之訴訟費、仲裁費、律師費及依慣例應由委託人負擔之其他費用等，悉數由委託人負擔。');
        // tslint:disable-next-line:max-line-length
        content_html.push('六、委託人知悉並同意受託所銷售基金之投資人須知及公開說明書或其中譯本（包括但不限於短線交易、擇時交易及洗錢防制等事項）等相關基金資訊，委託人除可至受託人各營業單位索取外，亦可由「<a href="http://announce.fundclear.com.tw">境外基金公開觀測站</a>」及「<a href="http://mops.twse.com.tw">公開資訊觀測站</a>」自行擷取使用，受託人已依「境外基金管理辦法」、「證券投資信託事業募集證券投資信託基金處理準則」及主管機關相關規定，善盡銷售機構告知義務。');
        content_html.push('七、委託人同意並已依「境外基金管理辦法」及「證券投資信託事業募集證券投資信託基金處理準則」等規定，提供相關風險屬性資料予受託人。');
        content_html.push('八、委託人如已約定由受託人寄發交易確認單（含相關表報），將於次月收到「信託資產報告書暨結算書」。');
        content_html.push('九、國內基金申購以交易日當日淨值計算，贖回價格以次一營業日計算，國內基金之轉換係以贖回再申購方式辦理。境外基金申購(贖回)原則上係以基金註冊地當日淨值計算(惟仍需視個別基金而定，部份境外基金以次一營業日淨值計算)，另部份境外基金採雙向淨值報價(如:JF)，即申購與贖回淨值不同， 請詳情參閱各基金公開說明書及投資人須知。');
        // tslint:disable-next-line:max-line-length
        content_html.push('十、委託人於網路銀行上進行交易時，該交易經客戶確認且完成後(如為申購/轉換等扣款交易，存款及基金帳務均需完成，如任一端未成功，即視為未完成)，為維護客戶權益及資料安全，本行(受託人)恕不接受修改資料或取消交易。');
        content_html.push('十一、委託人具備相當之投資專業及財務能力，且已充分瞭解本次投資基金商品之所有可能風險，並足以承擔所投資標的之風險。委託人確認該投資標的之交易係自行判斷之投資決定，即本行係依據委託人之運用指示，由本行以受託人名義代委託人與交易相對人進行該筆投資交易。且委託人同意 貴行並不保證此交易能於時限內完成（包括但不限於投資標的已額滿、未核備、已清算或交易對象不受理等因素），且本行亦不須對此負責。');
        content_html.push('十二、委託人已依「境外基金管理辦法」、「證券投資信託事業募集證券投資信託基金處理準則」及主管機關規定，填寫「財富管理貴賓戶KYC表」/「非財富管理部門客戶KYC表」予本行，並瞭解自身投資屬性。');
        content_html.push('十三、配息型之基金，基金的配息可能由基金的收益或本金中支付，基金配息前可能未先扣除行政管理相關費用。任何涉及由本金支出的部份，可能導致原始投資金額減損。');

        this.content = `
            <p class="inner_content">
            ` + content_html.join('<br>') + `
            </p>
        `;

        let content_html2 = [];
        // tslint:disable-next-line:max-line-length
        content_html2.push('(一)本人具備相當之投資專業及財務能力，且已充分瞭解本次投資基金商品之所有可能風險（包含但不限於投資風險、信用風險、市場風 險、流動性風險和匯兌風險，另若基金為配息型，基金的配息可能由基金的收益或本金中支付，基金配息前可能未先扣除行政管理相關費用。任何涉及由本金支出的部份，可能導致原始投資金額減損），並足以承擔所投資標的之風險。本人確認該投資標的之交易係自行判斷之投資決定，即 貴行係依據本人之運用指示，由 貴行以受託人名義代本人與交易相對人進行該筆投資交易。本人同意 貴行並不保證此交易能於時限內完成（包括但不限於投資標的已額滿、未核備、已清算或交易對象不受理等因素），且　貴行亦不須對此負責。');
        content_html2.push('(二)貴行並已依「境外基金管理辦法」（境外基金適用）、「證券投資信託事業募集證券投資信託基金處理準則」（國內基金適用）等相關規定，善盡銷售機構告知義務。');
        content_html2.push('(三)本人已於申購時取得貴行基金通路報酬資訊，嗣後若 貴行於對帳單有通知變動情形，本人同意自行至http//：www.tcb-bank.com.tw查閱變動詳情。');
        content_html2.push('(四)本人已依「境外基金管理辦法」、「證券投資信託事業募集證券投資信託基金處理準則」及主管機關規定，填寫「財富管理貴賓戶/非財富管理部門客戶資料（KYC）暨風險承受度測驗表」予 貴行，並瞭解自身投資屬性。');
        content_html2.push('(五)本人如已約定由　貴行寄發交易確認單(含相關表報)，將於次月收到「信託資產報告書暨結算書」。本申請書未盡事宜，悉依本人與  貴行簽訂之「特定金錢信託投資國內外有價證券信託約定事項」及其他約定辦理。');
        // tslint:disable-next-line:max-line-length
        content_html2.push('(六)本人已充分了解基金公開說明書及相關投資規範中，有關短線交易日數限制及額外費用之規定，為避免因短線交易影響基金操作與管理，本人同意申請贖回或轉換時，倘若涉及短線交易，或基金機構未完成交易確認前，如基金機構限制、拒絕或取消該贖回或轉換交易(包括受託人已接受贖回或轉換之交易)，本人絕無異議。');
        content_html2.push('(七)本信託業務並非一般銀行存款業務，非屬存款保險範圍。委託人瞭解受託人不為信託本金及投資收益之保證，投資有一定之風險(包含但不限於投資風險、信用風險、市場風險、流動性風險和匯兌風險)，所生風險可能導致本金之虧損(最大可能損失為投資本金之全部)。委託人之投資標的以往績效不代表未來表現，亦不保證其最低收益。');

        this.content2 = `
            <p class="inner_content">
            ` + content_html2.join('<br>') + `
            </p>
        `;

        let content_html3 = [];
        // tslint:disable-next-line:max-line-length
        content_html3.push('一、若委託人從事基金交易符合該公開說明書之短線交易認定標準時，委託人同意本行(受託人)得將境外基金管理辦法及境外基金註冊地法令所要求之委託人相關資料 (包括但不限於身份證字號、交易資訊)，提供予境外基金機構或總代理人。');
        content_html3.push('二、辦理境外系列基金，如有短線交易發生時，基金公司有將收取一定比例的額外交易手續費、拒絕該次申請之交易、或限制新增申購等權利，若有任何相關的問題，可逕洽各分行理財專員。（依境外基金管理辦法第5條之1第1項及第42條第3項規定辦理。）');
        content_html3.push('三、各基金「短線交易」之相關規定，請詳閱各基金公司之最新公開說明書或中華民國證券投資信託暨顧問商業同業公會查詢。');
        content_html3.push('<a href="https://www.sitca.org.tw/ROC/SHT/SH3003.aspx?PGMID=SH03&PORDER=8">境外基金短線、公平價格 、反稀釋查詢</a>');
        content_html3.push('<a href="https://www.sitca.org.tw/ROC/SHT/SH2001.aspx?PGMID=SH02&PORDER=9">國內基金短線交易規定查詢</a>');

        this.content3 = `
            <p class="inner_content">
            ` + content_html3.join('<br>') + `
            </p>
        `;

        let content_html4 = [];
        // tslint:disable-next-line:max-line-length
        content_html4.push('委託人如為受經濟制裁、外國政府或國際洗錢防制組織認定或追查之恐怖分子或團體者，本行(受託人)得拒絕業務往來或逕行關戶；且對於不配合本行審視、拒絕提供實際受益人或對委託人行使控制權之人等資訊、對交易之性質與目的或資金來源不願配合說明等客戶，本行得暫時停止交易、暫時停止或終止業務關係或採行其他必要之措施。');

        this.content4 = `
            <p class="inner_content">
            ` + content_html4.join('<br>') + `
            </p>
        `;

        let content_html5 = [];
        // tslint:disable-next-line:max-line-length
        content_html5.push('親愛的客戶，為維護個資安全，請您於基金交易時，避免由他人代為處理，以保障您的權益。');

        this.content5 = `
            <p class="inner_content">
            ` + content_html5.join('<br>') + `
            </p>
        `;
        
                if (this.backType && this.backType == 'search') {
            this._headerCtrl.setLeftBtnClick(() => {
                this.backPageEmit.emit({
                    'page':'enter-agree',
                    'data':false
                });
            });
        };
    }

    checkClick() {
        this.agreeChecked = !this.agreeChecked;
    }

    agreeSend(agreeResult) {
        if (agreeResult == false) {
            this.onBackPageData(agreeResult);
        } else {
            if (this.agreeChecked == true) {
                this.onBackPageData(agreeResult);
            } else {
                this._handleError.handleError({
                    type: 'dialog',
                    title: 'POPUP.NOTICE.TITLE',
                    content: '未勾選已閱讀條款。'
                });
            }
        }
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item) {
        let output = {
            'page': 'enter-agree',
            'type': 'success',
            'data': item,
        };
        this.backPageEmit.emit(output);
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj) {
        let output = {
            'page': 'enter-agree',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'gold', error_obj);
        this.errorPageEmit.emit(output);
    }
}

