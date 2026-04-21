import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  public readonly dataList$: Observable<SearchDataItem[]> = this.dataListSubject.asObservable();
  public readonly requestStatus$: Observable<SearchRequestStatus> =
    this.requestStatusSubject.asObservable();
  public readonly errorMessage$: Observable<string | null> = this.errorMessageSubject.asObservable();

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

    this.errorMessageSubject.next(null);
    this.requestStatusSubject.next('loading');

    this.googleApi
      .searchDataByText(normalizedQuery)
      .subscribe({
        next: (response) => {
          const results = (response.items ?? []).map((item: GoogleBookItemDto) =>
            this.mapGoogleBook(item),
          );

          this.dataListSubject.next(results);
          this.requestStatusSubject.next(results.length ? 'success' : 'empty');
        },
        error: () => {
          this.dataListSubject.next([]);
          this.errorMessageSubject.next('Не удалось загрузить результаты из Google Books.');
          this.requestStatusSubject.next('error');
        },
      });
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
