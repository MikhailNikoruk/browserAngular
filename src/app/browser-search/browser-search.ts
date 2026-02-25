import { Component, inject } from '@angular/core';
import { BrowserSearchForm, BrowserSearchData } from './components';
import { SearchDataItem } from './types';
import { BrowserDataService } from './services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SearchMode } from './enums';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
    selector: 'app-browser-search',
    templateUrl: './browser-search.html',
    styleUrl: './browser-search.scss',
    imports: [BrowserSearchForm, BrowserSearchData, AsyncPipe],
    providers: [BrowserDataService]
})
export class BrowserSearch {
    private readonly dataService = inject(BrowserDataService);

    protected searchResults$: Observable<SearchDataItem[]> = this.dataService.dataList$;
    protected historyList$: Observable<string[]> = this.dataService.historyList$;

    protected SearchMode = SearchMode;
    protected currentSearchMode: SearchMode = SearchMode.Local;

    // constructor() {
    //     this.watchDataFlow();
    // }

    protected handleNewSearch(query: string) {
        console.log('>>> [handleNewSearch] query =>', query);
        console.log('>>> [handleNewSearch] currentSearchMode =>', this.currentSearchMode);

        if (this.currentSearchMode === SearchMode.Local) {
            this.dataService.findLocalData(query);
        }

        if (this.currentSearchMode === SearchMode.Global) {
            this.dataService.findGlobalData(query);
        }
    }

    protected handleResetSearch() {
        this.dataService.resetData()
    }

    protected applyLastQuery(query: string) {
        this.dataService.findLocalData(query);
    }

    protected selectSearchMode(mode: SearchMode): void {
        this.currentSearchMode = mode;
    }

    // private watchDataFlow(): void {
    //     this.dataService.dataList$
    //         .pipe(takeUntilDestroyed())
    //         .subscribe((data: SearchDataItem[]) => {
    //             console.log('>>> data =>', data);
    //             this.searchResults = data;
    //         });

    //     this.dataService.historyList$
    //         .pipe(takeUntilDestroyed())
    //         .subscribe((data: string[]) => {
    //             this.historyList = data;
    //         });
    // }
}
