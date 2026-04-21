import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Observable, of, Subject, throwError } from 'rxjs';

import { GoogleSearchApiService } from '../../api/services';
import { GoogleBooksResponseDto } from '../../api/dtos';
import { BrowserDataService } from './browser-data.service';

describe('BrowserDataService', () => {
  let service: BrowserDataService;
  let googleApi: { searchDataByText: ReturnType<typeof vi.fn> };
  let latestResults: ReturnType<typeof service['dataList$']['subscribe']> extends infer _ ? unknown : never;
  let latestStatus: string;
  let latestError: string | null;

  beforeEach(() => {
    latestResults = [];
    latestStatus = 'idle';
    latestError = null;
    googleApi = {
      searchDataByText: vi.fn<(_: string) => Observable<GoogleBooksResponseDto>>(),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        BrowserDataService,
        {
          provide: GoogleSearchApiService,
          useValue: googleApi,
        },
      ],
    });

    service = TestBed.inject(BrowserDataService);
    service.dataList$.subscribe((results) => {
      latestResults = results;
    });
    service.requestStatus$.subscribe((status) => {
      latestStatus = status;
    });
    service.errorMessage$.subscribe((message) => {
      latestError = message;
    });
  });

  it('filters local data by category without query text', () => {
    service.findLocalData({
      query: '',
      category: 'testing',
    });

    expect(Array.isArray(latestResults)).toBe(true);
    expect((latestResults as { category: string }[]).length).toBeGreaterThan(0);
    expect((latestResults as { category: string }[]).every((item) => item.category === 'testing')).toBe(
      true,
    );
    expect(latestStatus).toBe('success');
  });

  it('maps successful global search results', () => {
    googleApi.searchDataByText.mockReturnValue(
      of({
        items: [
          {
            id: 'book-1',
            volumeInfo: {
              title: 'Angular Deep Dive',
              description: 'A'.repeat(140),
              infoLink: 'https://books.example/angular',
            },
          },
        ],
      }),
    );

    service.findGlobalData('angular');

    expect(googleApi.searchDataByText).toHaveBeenCalledWith('angular');
    expect(latestStatus).toBe('success');
    expect(latestError).toBeNull();
    expect(latestResults).toEqual([
      {
        id: 'book-1',
        title: 'Angular Deep Dive',
        text: `${'A'.repeat(120)}...`,
        link: 'https://books.example/angular',
        category: 'all',
      },
    ]);
  });

  it('returns empty state when global API response has no items', () => {
    googleApi.searchDataByText.mockReturnValue(of({ items: [] }));

    service.findGlobalData('missing');

    expect(latestResults).toEqual([]);
    expect(latestStatus).toBe('empty');
  });

  it('returns error state when global API fails', () => {
    googleApi.searchDataByText.mockReturnValue(
      throwError(() => new Error('google api is unavailable')),
    );

    service.findGlobalData('angular');

    expect(latestResults).toEqual([]);
    expect(latestStatus).toBe('error');
    expect(latestError).toContain('Google Books');
  });

  it('ignores stale global search responses after a newer request', () => {
    const firstRequest$ = new Subject<GoogleBooksResponseDto>();
    const secondRequest$ = new Subject<GoogleBooksResponseDto>();

    googleApi.searchDataByText.mockImplementation((query: string) => {
      return query === 'first' ? firstRequest$.asObservable() : secondRequest$.asObservable();
    });

    service.findGlobalData('first');
    service.findGlobalData('second');

    firstRequest$.next({
      items: [
        {
          id: 'stale-book',
          volumeInfo: { title: 'Stale result' },
        },
      ],
    });
    secondRequest$.next({
      items: [
        {
          id: 'fresh-book',
          volumeInfo: { title: 'Fresh result' },
        },
      ],
    });

    expect(latestResults).toEqual([
      {
        id: 'fresh-book',
        title: 'Fresh result',
        text: '',
        link: '',
        category: 'all',
      },
    ]);
    expect(latestStatus).toBe('success');
  });

  it('resets to idle state', () => {
    googleApi.searchDataByText.mockReturnValue(of({ items: [] }));
    service.findGlobalData('angular');

    service.resetData();

    expect(latestResults).toEqual([]);
    expect(latestStatus).toBe('idle');
    expect(latestError).toBeNull();
  });
});
