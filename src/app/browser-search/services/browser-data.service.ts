import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SearchDataItem } from '../types';
import { SEARCH_DATA_LIST } from '../consts';

@Injectable()
export class BrowserDataService {
    private dataList = new BehaviorSubject<SearchDataItem[]>([]); // Observable + Observer
    dataList$ = this.dataList.asObservable();

    private historyList = new BehaviorSubject<string[]>([]); // Observable + Observer
    historyList$ = this.historyList.asObservable();

    findData(query: string) {
        console.log('>>> findData =>', query);

        const oldHistoryList: string[] = this.historyList.getValue();

        if (!oldHistoryList.includes(query)) {
            const newHistoryList = [query, ...oldHistoryList];
            this.historyList.next(newHistoryList);
        }

        const validateQuery: string = query.toLowerCase();

        const filteredDataList: SearchDataItem[] =  SEARCH_DATA_LIST.filter((item: SearchDataItem) => {
            const validatedItemTitle = item.title.toLowerCase();
            const isQueryInTitle = validatedItemTitle.includes(validateQuery);

            const validatedItemText = item.text.toLowerCase();
            const isQueryInText = validatedItemText.includes(validateQuery);

            return isQueryInTitle || isQueryInText;
        });

        this.dataList.next(filteredDataList);
    }

    resetData() {
        this.dataList.next([]);
    }
}
