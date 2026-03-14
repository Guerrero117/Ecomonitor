import { TestBed } from '@angular/core/testing';

import { WeatherServiceTs } from './weather.service.ts';

describe('WeatherServiceTs', () => {
  let service: WeatherServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
