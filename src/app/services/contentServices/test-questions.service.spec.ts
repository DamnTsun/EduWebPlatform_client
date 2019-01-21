import { TestBed } from '@angular/core/testing';

import { TestQuestionsService } from './test-questions.service';

describe('TestQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestQuestionsService = TestBed.get(TestQuestionsService);
    expect(service).toBeTruthy();
  });
});
