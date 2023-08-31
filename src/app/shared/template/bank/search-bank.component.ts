/**
 * search Bank
 */
import { Component, OnInit, Input, Renderer2, NgZone, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { AuthService } from '@core/auth/auth.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';
import { F4000103ReqBody } from '@api/f4/f4000103/f4000103-req';
import { SearchBankService } from './search-bank.srevice';
import { elementAt } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CacheService } from '@core/system/cache/cache.service';


@Component({
    selector: 'app-search-bank-page',
    templateUrl: './search-bank.component.html',
    styleUrls: [],
    providers: [SearchBankService]
})
/**
  * 選擇銀行代號
  */
export class SearchBankComponent implements OnInit {

    bankObj = {
        bankcode: "",
        bankname: "",
        bankName: "",
    };
    bankList = []; // now
    allBankList = []; // all
    showData = false;
    //使用者輸入框
    search_input = '';
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        private _logger: Logger
        , private authService: AuthService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _mainService: SearchBankService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
    ) { }

    ngOnInit() {
        this.getBank();
    }



    getBankCode(bankcode, bankname) {
        this.bankObj = {
            bankcode: bankcode,
            bankname: bankname,
            bankName: bankcode + '-' + bankname,
        };
        this.backPageEmit.emit(this.bankObj);
    }


    //============================================================取得銀行列表
    getBank(): Promise<any> {



        return this._mainService.getBank().then(
            (res) => {
                this.bankList = res['data'];
                this.allBankList = res['data'];
                this.showData = true;
            },
            (errorObj) => {
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
            }
        );
    }

    //============================================================點選查詢
    onSearch() {
        this.showData = true;
        this.bankList = this._mainService.searchData(this.search_input, this.allBankList);
        if (this.bankList.length == 0) {
            this.showData = false;
        }
    }

}
