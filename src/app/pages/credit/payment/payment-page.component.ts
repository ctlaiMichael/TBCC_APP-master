
import { Component, OnInit } from "@angular/core";
import { Logger } from "@core/system/logger/logger.service";

import { CreditPayService } from "../shared/service/credit-pay.service";
import { HandleErrorService } from "@core/handle-error/handle-error.service";
import { NavgatorService } from "@core/navgator/navgator.service";

@Component({
    selector: 'app-payment',
    templateUrl: './payment-page.component.html',
    providers: [CreditPayService]
})
export class PaymentComponent implements OnInit {

    showData = true;
    showNextPage = false;
    // 列表資訊
    datas = [];
    info_data: any = {};
    pageSize: number;
    totalRowCount: number;
    totalPages: number;
    // 取得選取的物件，傳入子component
    data = {};


    constructor(
        private _logger: Logger
        , private _mainService: CreditPayService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
    ) {
    }

    ngOnInit() {
        this._mainService.getData(1).then(
            (result) => {
                //success
                this._logger.step('Financial', 'getData', result);
                this.info_data = result.info_data;
                this.datas = result.data;


                this.totalPages = result.page_info['totalPages'];
                this.pageSize = result.page_info['pageSize'];

            }

            // }
            , (errorObj) => {
                //error
                this._logger.step('Financial', 'getData', errorObj);
                let error_msg = 'Error';
                if (typeof errorObj === 'object' && errorObj.hasOwnProperty('msg')) {
                    error_msg = errorObj.msg;
                }
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                // this.navgator.push('credit');
            }
        )

    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * go
     *
     */
    onListEvent(data) {
        this.data = data;

        this.showNextPage = true;
    }

}


