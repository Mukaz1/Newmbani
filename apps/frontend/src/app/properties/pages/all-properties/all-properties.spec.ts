import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllProperties } from './all-properties';

describe('AllProperties', () => {
  let component: AllProperties;
  let fixture: ComponentFixture<AllProperties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProperties],
    }).compileComponents();

    fixture = TestBed.createComponent(AllProperties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
