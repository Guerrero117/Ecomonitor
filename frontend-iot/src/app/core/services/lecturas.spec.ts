import { TestBed } from '@angular/core/testing';

import { Lecturas } from './lecturas';

describe('Lecturas', () => {
  let service: Lecturas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lecturas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
