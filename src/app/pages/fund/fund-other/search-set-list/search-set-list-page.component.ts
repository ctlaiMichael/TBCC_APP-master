/**
 * 我的願望清單
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search-set-list',
  templateUrl: './search-set-list-page.component.html',
  styleUrls: [],

})
export class SearchSetListPageComponent implements OnInit {

  constructor(
    private _logger: Logger
    , private router: Router

  ) {
  }

  ngOnInit() {
    // alert('inin');

  }

  /**
   * go
   *
   */

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

}
