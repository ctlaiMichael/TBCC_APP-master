import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
  selector: 'app-card-login-binding',
  templateUrl: './card-login-binding.component.html',
  styleUrls: ['./card-login-binding.component.css']
})
export class CardLoginBindingComponent implements OnInit {

  constructor(
    private navgator: NavgatorService
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.navgator.push('epay-card');
  }

  qrcode() {
    this.navgator.push('epay-scan-card');
  }

}
