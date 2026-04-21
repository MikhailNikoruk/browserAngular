import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { SearchHistoryService } from './search-history.service';

describe('SearchHistoryService', () => {
  const storageKey = 'browser-search-history';
  let service: SearchHistoryService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [SearchHistoryService],
    });

    service = TestBed.inject(SearchHistoryService);
  });

  it('loads sanitized history from storage', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify([' Angular ', '', 'angular', 42, 'Testing', 'testing']),
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [SearchHistoryService],
    });

    const restoredService = TestBed.inject(SearchHistoryService);

    expect(restoredService.getHistory()).toEqual(['Angular', 'Testing']);
  });

  it('moves duplicate query to the top without duplication', () => {
    service.addQuery('Angular');
    service.addQuery('Testing');
    service.addQuery(' angular ');

    expect(service.getHistory()).toEqual(['angular', 'Testing']);
  });

  it('keeps only the latest ten queries', () => {
    for (let index = 1; index <= 12; index += 1) {
      service.addQuery(`query-${index}`);
    }

    expect(service.getHistory()).toHaveLength(10);
    expect(service.getHistory()[0]).toBe('query-12');
    expect(service.getHistory()[9]).toBe('query-3');
  });

  it('clears history and removes storage key', () => {
    service.addQuery('Angular');

    service.clearHistory();

    expect(service.getHistory()).toEqual([]);
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
});
