import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllCustomers } from './all-customers';

describe('AllCustomers', () => {
  let component: AllCustomers;
  let fixture: ComponentFixture<AllCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCustomers],
    }).compileComponents();

    fixture = TestBed.createComponent(AllCustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
