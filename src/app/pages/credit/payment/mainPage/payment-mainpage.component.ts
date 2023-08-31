
import { Component, OnInit } from "@angular/core";
import { Logger } from "@core/system/logger/logger.service";

import { HandleErrorService } from "@core/handle-error/handle-error.service";

@Component({
    selector: 'app-payment-mainpage',
    templateUrl: './payment-mainpage.component.html',
    providers: []
})
export class PaymentMainComponent implements OnInit {

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
        , private _handleError: HandleErrorService
    ) {
    }

    ngOnInit() {
       

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


