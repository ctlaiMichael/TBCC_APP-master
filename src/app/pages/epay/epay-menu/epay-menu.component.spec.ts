import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpayMenuComponent } from './epay-menu.component';

describe('EpayMenuComponent', () => {
  let component: EpayMenuComponent;
  let fixture: ComponentFixture<EpayMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpayMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpayMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
