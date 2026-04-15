import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsIot } from './logs-iot';

describe('LogsIot', () => {
  let component: LogsIot;
  let fixture: ComponentFixture<LogsIot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsIot],
    }).compileComponents();

    fixture = TestBed.createComponent(LogsIot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
