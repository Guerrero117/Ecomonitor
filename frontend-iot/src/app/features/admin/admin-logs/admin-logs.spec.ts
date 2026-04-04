import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLogs } from './admin-logs';

describe('AdminLogs', () => {
  let component: AdminLogs;
  let fixture: ComponentFixture<AdminLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
