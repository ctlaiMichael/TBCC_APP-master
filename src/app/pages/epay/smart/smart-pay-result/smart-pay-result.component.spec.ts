import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartPayResultComponent } from './smart-pay-result.component';

describe('SmartPayResultComponent', () => {
  let component: SmartPayResultComponent;
  let fixture: ComponentFixture<SmartPayResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartPayResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartPayResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
