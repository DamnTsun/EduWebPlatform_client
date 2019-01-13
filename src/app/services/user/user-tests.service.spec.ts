import { TestBed } from '@angular/core/testing';

import { UserTestsService } from './user-tests.service';

describe('UserTestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserTestsService = TestBed.get(UserTestsService);
    expect(service).toBeTruthy();
  });
});
