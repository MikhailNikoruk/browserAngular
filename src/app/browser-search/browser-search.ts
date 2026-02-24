import { Component, inject } from '@angular/core';
import { BrowserSearchForm, BrowserSearchData } from './components';
import { SearchDataItem } from './types';
import { BrowserDataService } from './services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-browser-search',
    templateUrl: './browser-search.html',
    styleUrl: './browser-search.scss',
    imports: [BrowserSearchForm, BrowserSearchData],
    providers: [BrowserDataService]
})
export class BrowserSearch {
    private readonly dataService = inject(BrowserDataService);

    protected searchResults: SearchDataItem[] = [];

    protected historyList: string[] = [];

    constructor() {
        this.watchDataFlow();
    }

    protected handleNewSearch(query: string) {
        this.dataService.findData(query);
    }

    protected handleResetSearch() {
        this.dataService.resetData()
    }

    protected applyLastQuery(query: string) {
        this.dataService.findData(query);
    }

    private watchDataFlow(): void {
        this.dataService.dataList$
            .pipe(takeUntilDestroyed())
            .subscribe((data: SearchDataItem[]) => {
                this.searchResults = data;
            });

        this.dataService.historyList$
            .pipe(takeUntilDestroyed())
            .subscribe((data: string[]) => {
                this.historyList = data;
            });
    }
}
