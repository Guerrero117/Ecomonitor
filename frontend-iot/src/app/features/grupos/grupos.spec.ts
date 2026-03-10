import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grupos } from './grupos';

describe('Grupos', () => {
  let component: Grupos;
  let fixture: ComponentFixture<Grupos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grupos],
    }).compileComponents();

    fixture = TestBed.createComponent(Grupos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
