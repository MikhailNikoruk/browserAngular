import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_SEARCH_PARAMS, SearchParamsService } from './search-params.service';

describe('SearchParamsService', () => {
  let service: SearchParamsService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [SearchParamsService],
    });

    service = TestBed.inject(SearchParamsService);
  });

  it('starts with default params', () => {
    expect(service.getParams()).toEqual(DEFAULT_SEARCH_PARAMS);
  });

  it('updates params partially', () => {
    service.updateParams({ query: 'angular' });
    service.updateParams({ category: 'testing' });

    expect(service.getParams()).toEqual({
      query: 'angular',
      category: 'testing',
    });
  });

  it('resets params to defaults', () => {
    service.updateParams({ query: 'angular', category: 'css' });

    service.resetParams();

    expect(service.getParams()).toEqual(DEFAULT_SEARCH_PARAMS);
  });
});
