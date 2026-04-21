import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

import { SearchDataItem, SearchParams } from '../types';
import { SEARCH_DATA_LIST } from '../consts';
import { GoogleSearchApiService } from '../../api/services';
import { GoogleBookItemDto, GoogleBooksResponseDto } from '../../api/dtos';

@Injectable()
export class BrowserDataService {
  private readonly googleApi = inject(GoogleSearchApiService);
  private readonly dataListSubject = new BehaviorSubject<SearchDataItem[]>([]);

  public readonly dataList$: Observable<SearchDataItem[]> = this.dataListSubject.asObservable();

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
  }

  public findGlobalData(query: string): void {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      this.resetData();
      return;
    }

    this.googleApi
      .searchDataByText(normalizedQuery)
      .pipe(
        map((response: GoogleBooksResponseDto) =>
          (response.items ?? []).map((item: GoogleBookItemDto) => this.mapGoogleBook(item)),
        ),
        catchError(() => of([])),
      )
      .subscribe((results) => {
        this.dataListSubject.next(results);
      });
  }

  public resetData(): void {
    this.dataListSubject.next([]);
  }

  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase();
  }

  private mapGoogleBook(item: GoogleBookItemDto): SearchDataItem {
    return {
      id: item.id || '',
      title: item.volumeInfo.title || 'Untitled',
      text: item.volumeInfo.description ? `${item.volumeInfo.description.slice(0, 120)}...` : '',
      link: item.selfLink || '',
      category: 'all',
    };
  }
}
