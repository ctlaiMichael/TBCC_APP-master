import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
  selector: 'app-card-binding',
  templateUrl: './card-binding.component.html',
  styleUrls: ['./card-binding.component.css']
})
export class CardBindingComponent implements OnInit {

  constructor(
    private navgator: NavgatorService
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.navgator.push('epay');
  }

  qrcode() {
    this.navgator.push('epay-scan');
  }

}
