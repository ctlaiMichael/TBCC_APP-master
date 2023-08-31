import { Component, OnInit } from '@angular/core';
import { SUB_MENU } from '@conf/menu/sub-menu';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit {
  menuData = SUB_MENU['reser-form'];
  constructor() {
  }

  ngOnInit() {
  }

}

