import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaxTwoComponent } from './edit-tax-two.component';

describe('EditTaxTwoComponent', () => {
  let component: EditTaxTwoComponent;
  let fixture: ComponentFixture<EditTaxTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaxTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaxTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
