import { TestBed } from '@angular/core/testing';

import { NavigationServiceService } from './navigation-service.service';

describe('NavigationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigationServiceService = TestBed.get(NavigationServiceService);
    expect(service).toBeTruthy();
  });
});
