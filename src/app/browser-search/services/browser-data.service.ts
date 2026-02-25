import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SearchDataItem } from '../types';
import { SEARCH_DATA_LIST } from '../consts';
import { GoogleSearchApiService } from '../../api/services';
import { GoogleBookItemDto, GoogleBooksResponseDto } from '../../api/dtos';

@Injectable()
export class BrowserDataService {
    private dataList: BehaviorSubject<SearchDataItem[]> = new BehaviorSubject<SearchDataItem[]>([]); // Observable + Observer
    public dataList$: Observable<SearchDataItem[]> = this.dataList.asObservable();

    private historyList = new BehaviorSubject<string[]>([]); // Observable + Observer
    historyList$ = this.historyList.asObservable();

    private readonly googleApi = inject(GoogleSearchApiService);

    findLocalData(query: string) {
        console.log('>>> [local] findData =>', query);
        this.checkHistory(query);
        const validateQuery: string = this.validateQuery(query);

        const filteredDataList: SearchDataItem[] = SEARCH_DATA_LIST.filter((item: SearchDataItem) => {
            const validatedItemTitle = item.title.toLowerCase();
            const isQueryInTitle = validatedItemTitle.includes(validateQuery);

            const validatedItemText = item.text.toLowerCase();
            const isQueryInText = validatedItemText.includes(validateQuery);

            return isQueryInTitle || isQueryInText;
        });

        // this.dataList = filteredDataList;
        this.dataList.next(filteredDataList);
    }

    findGlobalData(query: string) {
        console.log('>>> [global] findData =>', query);
        this.checkHistory(query);
        const validateQuery: string = this.validateQuery(query);

        this.googleApi
            .searchDataByText(validateQuery)
            .subscribe((response: GoogleBooksResponseDto) => {
                const results: SearchDataItem[] = response.items
                    .map((item: GoogleBookItemDto) => {
                        return {
                            id: item.id || '',
                            title: item.volumeInfo.title || '',
                            text: item.volumeInfo.description
                                ? item.volumeInfo.description?.slice(0, 100)+'..'
                                : '',
                            link: item.selfLink || ''
                        } as SearchDataItem
                    });

                this.dataList.next(results);
            });
    }

    private checkHistory(query: string) {
        const oldHistoryList: string[] = this.historyList.getValue();

        if (!oldHistoryList.includes(query)) {
            const newHistoryList = [query, ...oldHistoryList];
            this.historyList.next(newHistoryList);
        }
    }

    private validateQuery(query: string): string {
        return query.toLowerCase();
    }

    resetData() {
        this.dataList.next([]);
    }
}
