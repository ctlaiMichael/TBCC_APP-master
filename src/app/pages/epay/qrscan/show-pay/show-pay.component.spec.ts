import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPayComponent } from './show-pay.component';

describe('ShowPayComponent', () => {
  let component: ShowPayComponent;
  let fixture: ComponentFixture<ShowPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
