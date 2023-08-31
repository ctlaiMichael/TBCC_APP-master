import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeRedComponent } from './qrcode-red.component';

describe('QrcodeRedComponent', () => {
  let component: QrcodeRedComponent;
  let fixture: ComponentFixture<QrcodeRedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeRedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
