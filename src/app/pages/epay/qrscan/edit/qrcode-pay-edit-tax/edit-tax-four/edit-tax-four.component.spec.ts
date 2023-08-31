import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaxFourComponent } from './edit-tax-four.component';

describe('EditTaxFourComponent', () => {
  let component: EditTaxFourComponent;
  let fixture: ComponentFixture<EditTaxFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaxFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaxFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
