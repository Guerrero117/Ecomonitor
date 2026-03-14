import { TestBed } from '@angular/core/testing';

import { Grupos } from './grupos';

describe('Grupos', () => {
  let service: Grupos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Grupos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
