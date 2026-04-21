import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, Subject, switchMap, tap } from 'rxjs';

import { SearchDataItem, SearchParams, SearchRequestStatus } from '../types';
import { SEARCH_DATA_LIST } from '../consts';
import { GoogleSearchApiService } from '../../api/services';
import { GoogleBookItemDto } from '../../api/dtos';

@Injectable()
export class BrowserDataService {
  private readonly googleApi = inject(GoogleSearchApiService);
  private readonly dataListSubject = new BehaviorSubject<SearchDataItem[]>([]);
  private readonly requestStatusSubject = new BehaviorSubject<SearchRequestStatus>('idle');
  private readonly errorMessageSubject = new BehaviorSubject<string | null>(null);
  private readonly globalSearchQuerySubject = new Subject<string>();

  public readonly dataList$: Observable<SearchDataItem[]> = this.dataListSubject.asObservable();
  public readonly requestStatus$: Observable<SearchRequestStatus> =
    this.requestStatusSubject.asObservable();
  public readonly errorMessage$: Observable<string | null> = this.errorMessageSubject.asObservable();

  public constructor() {
    this.globalSearchQuerySubject
      .pipe(
        tap(() => {
          this.errorMessageSubject.next(null);
          this.requestStatusSubject.next('loading');
        }),
        switchMap((query) =>
          this.googleApi.searchDataByText(query).pipe(
            map((response) => ({
              results: (response.items ?? []).map((item: GoogleBookItemDto) => this.mapGoogleBook(item)),
              errorMessage: null,
              status: 'success' as const,
            })),
            catchError(() =>
              of({
                results: [] as SearchDataItem[],
                errorMessage: 'Не удалось загрузить результаты из Google Books.',
                status: 'error' as const,
              }),
            ),
          ),
        ),
      )
      .subscribe(({ errorMessage, results, status }) => {
        this.dataListSubject.next(results);
        this.errorMessageSubject.next(errorMessage);
        this.requestStatusSubject.next(results.length || status === 'error' ? status : 'empty');
      });
  }

  public findLocalData(params: SearchParams): void {
    const normalizedQuery = this.normalizeQuery(params.query);
    const filteredDataList = SEARCH_DATA_LIST.filter((item) => {
      const matchesCategory = params.category === 'all' || item.category === params.category;
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.text.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    this.dataListSubject.next(filteredDataList);
    this.errorMessageSubject.next(null);
    this.requestStatusSubject.next(filteredDataList.length ? 'success' : 'empty');
  }

  public findGlobalData(query: string): void {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      this.resetData();
      return;
    }

    this.globalSearchQuerySubject.next(normalizedQuery);
  }

  public resetData(): void {
    this.dataListSubject.next([]);
    this.errorMessageSubject.next(null);
    this.requestStatusSubject.next('idle');
  }

  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase();
  }

  private mapGoogleBook(item: GoogleBookItemDto): SearchDataItem {
    const volumeInfo = item.volumeInfo ?? {};
    const description = volumeInfo.description?.trim() ?? '';

    return {
      id: item.id ?? '',
      title: volumeInfo.title ?? 'Untitled',
      text: this.getPreviewText(description),
      link: volumeInfo.infoLink ?? volumeInfo.canonicalVolumeLink ?? item.selfLink ?? '',
      category: 'all',
    };
  }

  private getPreviewText(text: string): string {
    if (!text) {
      return '';
    }

    if (text.length <= 120) {
      return text;
    }

    return `${text.slice(0, 120)}...`;
  }
}
