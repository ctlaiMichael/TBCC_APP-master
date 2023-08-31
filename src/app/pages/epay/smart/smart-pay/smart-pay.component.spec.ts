import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartPayComponent } from './smart-pay.component';

describe('SmartPayComponent', () => {
  let component: SmartPayComponent;
  let fixture: ComponentFixture<SmartPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
