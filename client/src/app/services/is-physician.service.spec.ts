import { TestBed } from '@angular/core/testing';

import { IsPhysician } from './is-physician.service';

describe('IsPhysician', () => {
  let service: IsPhysicianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsPhysicianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
