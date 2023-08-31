import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodePayResultComponent } from './qrcode-pay-result.component';

describe('QrcodePayResultComponent', () => {
  let component: QrcodePayResultComponent;
  let fixture: ComponentFixture<QrcodePayResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodePayResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodePayResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
