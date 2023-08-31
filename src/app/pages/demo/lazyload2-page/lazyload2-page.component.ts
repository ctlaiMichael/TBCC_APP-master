import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lazyload2-page',
  templateUrl: './lazyload2-page.component.html',
  styleUrls: ['./lazyload2-page.component.css']
})
export class Lazyload2PageComponent implements OnInit {

  dfVal = {};
  testList = [
    {id: 1, name: 'data1'},
    {id: 2, name: 'data2'},
    {id: 3, name: 'data3'},
    {id: 4, name: 'data4'}
  ];

  testList2 = {
    'one': [
      {id: 4, name: 'data4'}
    ],
    'more': [
      {id: 1, name: 'data1'},
      {id: 2, name: 'data2'},
      {id: 3, name: 'data3'},
      {id: 4, name: 'data4'}
    ]
  };

  testData: any;

  constructor() { }

  ngOnInit() {
  }

  onChange(item) {
    console.log('now val:', item, this.testData);
  }

  onClick(item) {
    if (!!this.testList2[item]) {
      this.testList = this.testList2[item];
    }
  }


}
