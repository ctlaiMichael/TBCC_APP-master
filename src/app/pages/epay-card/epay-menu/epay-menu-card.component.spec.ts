import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpayMenuCardComponent } from './epay-menu-card.component';

describe('EpayMenuComponent', () => {
  let component: EpayMenuCardComponent;
  let fixture: ComponentFixture<EpayMenuCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpayMenuCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpayMenuCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
