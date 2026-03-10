import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Config } from './config';

describe('Config', () => {
  let component: Config;
  let fixture: ComponentFixture<Config>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Config],
    }).compileComponents();

    fixture = TestBed.createComponent(Config);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
