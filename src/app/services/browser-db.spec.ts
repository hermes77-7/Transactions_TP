import { TestBed } from '@angular/core/testing';

import { BrowserDb } from './browser-db';

describe('BrowserDb', () => {
  let service: BrowserDb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserDb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
