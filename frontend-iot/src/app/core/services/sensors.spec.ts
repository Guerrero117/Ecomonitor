import { TestBed } from '@angular/core/testing';

import { Sensors } from './sensors';

describe('Sensors', () => {
  let service: Sensors;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sensors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
