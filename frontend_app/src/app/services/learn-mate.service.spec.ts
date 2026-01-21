import { TestBed } from '@angular/core/testing';

import { LearnMateService } from './learn-mate.service';

describe('LearnMateService', () => {
  let service: LearnMateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnMateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
