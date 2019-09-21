import { TestBed } from '@angular/core/testing';

import { GapiService } from './gapi.service';

describe('GapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GapiService = TestBed.get(GapiService);
    expect(service).toBeTruthy();
  });
});
