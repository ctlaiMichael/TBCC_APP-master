import { Component, OnInit } from '@angular/core';
import { EditService } from '@pages/edit/shared/edit.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-edit-hot-key',
  templateUrl: './edit-hot-key.component.html',
  styleUrls: ['./edit-hot-key.component.css']
})
export class EditHotKeyComponent implements OnInit {

  constructor(
    private _logger: Logger,
    private editService: EditService,
    private navgator: NavgatorService
  ) { }

  ngOnInit() {
  }

  go(path) {
    this._logger.log(path);
    this.navgator.push(path);
  }

}
