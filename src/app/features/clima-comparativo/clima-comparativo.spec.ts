import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimaComparativo } from './clima-comparativo';

describe('ClimaComparativo', () => {
  let component: ClimaComparativo;
  let fixture: ComponentFixture<ClimaComparativo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClimaComparativo],
    }).compileComponents();

    fixture = TestBed.createComponent(ClimaComparativo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
