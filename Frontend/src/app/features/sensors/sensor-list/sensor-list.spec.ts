import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorList } from './sensor-list';

describe('SensorList', () => {
  let component: SensorList;
  let fixture: ComponentFixture<SensorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorList],
    }).compileComponents();

    fixture = TestBed.createComponent(SensorList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
