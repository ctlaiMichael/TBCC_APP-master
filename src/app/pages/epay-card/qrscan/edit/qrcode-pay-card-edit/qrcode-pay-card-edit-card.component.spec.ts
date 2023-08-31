import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodePayCardEditCardComponent } from './qrcode-pay-card-edit-card.component';

describe('QrcodePayCardEditCardComponent', () => {
  let component: QrcodePayCardEditCardComponent;
  let fixture: ComponentFixture<QrcodePayCardEditCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodePayCardEditCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodePayCardEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
