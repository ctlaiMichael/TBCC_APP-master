import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodePayCardEditComponent } from './qrcode-pay-card-edit.component';

describe('QrcodePayCardEditComponent', () => {
  let component: QrcodePayCardEditComponent;
  let fixture: ComponentFixture<QrcodePayCardEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodePayCardEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodePayCardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
