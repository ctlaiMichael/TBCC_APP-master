import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodePayEditCardComponent } from './qrcode-pay-edit-card.component';

describe('QrcodePayEditCardComponent', () => {
  let component: QrcodePayEditCardComponent;
  let fixture: ComponentFixture<QrcodePayEditCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodePayEditCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodePayEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
