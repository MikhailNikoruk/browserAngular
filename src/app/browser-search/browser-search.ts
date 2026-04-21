import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BrowserSearchForm, BrowserSearchData } from './components';
import { SEARCH_CATEGORY_LABELS } from './consts';
import { SEARCH_CATEGORIES, SearchDataItem, SearchParams, SearchRequestStatus } from './types';
import {
  BrowserDataService,
  DEFAULT_SEARCH_PARAMS,
  SearchHistoryService,
  SearchParamsService,
} from './services';
import { SearchMode } from './enums';
import { AsyncPipe } from '@angular/common';
import { Theme, ThemeService } from '../core';

@Component({
  selector: 'app-browser-search',
  templateUrl: './browser-search.html',
  styleUrl: './browser-search.scss',
  imports: [BrowserSearchForm, BrowserSearchData, AsyncPipe],
  providers: [BrowserDataService, SearchHistoryService, SearchParamsService],
})
export class BrowserSearch {
  private readonly dataService = inject(BrowserDataService);
  private readonly historyService = inject(SearchHistoryService);
  private readonly searchParamsService = inject(SearchParamsService);
  private readonly themeService = inject(ThemeService);

  protected readonly defaultSearchParams = DEFAULT_SEARCH_PARAMS;
  protected readonly searchResults$: Observable<SearchDataItem[]> = this.dataService.dataList$;
  protected readonly requestStatus$: Observable<SearchRequestStatus> = this.dataService.requestStatus$;
  protected readonly errorMessage$: Observable<string | null> = this.dataService.errorMessage$;
  protected readonly historyList$: Observable<string[]> = this.historyService.history$;
  protected readonly params$: Observable<SearchParams> = this.searchParamsService.params$;
  protected readonly theme$: Observable<Theme> = this.themeService.theme$;
  protected readonly searchCategories = [...SEARCH_CATEGORIES];
  protected readonly searchCategoryLabels = SEARCH_CATEGORY_LABELS;

  protected readonly SearchMode = SearchMode;
  protected currentSearchMode: SearchMode = SearchMode.Local;

  protected get isLoading(): boolean {
    return this.dataService.getRequestStatus() === 'loading';
  }

  protected handleNewSearch(params: SearchParams): void {
    const normalizedParams = this.normalizeParams(params);
    this.searchParamsService.updateParams(normalizedParams);
    this.runSearch(normalizedParams, true);
  }

  protected handleResetSearch(): void {
    this.searchParamsService.resetParams();
    this.clearSearchState();
  }

  protected applyLastQuery(query: string): void {
    const params = this.normalizeParams({
      ...this.searchParamsService.getParams(),
      query,
    });

    this.searchParamsService.updateParams(params);
    this.runSearch(params, true);
  }

  protected selectSearchMode(mode: SearchMode): void {
    this.currentSearchMode = mode;

    const params = this.searchParamsService.getParams();

    if (!this.canSearch(params)) {
      this.clearSearchState();
      return;
    }

    this.runSearch(params);
  }

  protected selectTheme(newTheme: Theme): void {
    this.themeService.setTheme(newTheme);
  }

  protected clearHistory(): void {
    this.historyService.clearHistory();
  }

  protected get isCategoryDisabled(): boolean {
    return this.currentSearchMode === SearchMode.Global;
  }

  private executeSearch(params: SearchParams): void {
    if (this.currentSearchMode === SearchMode.Local) {
      this.dataService.findLocalData(params);
      return;
    }

    this.dataService.findGlobalData(params.query);
  }

  private normalizeParams(params: SearchParams): SearchParams {
    return {
      ...params,
      query: params.query.trim(),
    };
  }

  private runSearch(params: SearchParams, saveToHistory = false): void {
    if (!this.canSearch(params)) {
      this.clearSearchState();
      return;
    }

    this.executeSearch(params);

    if (saveToHistory && params.query) {
      this.historyService.addQuery(params.query);
    }
  }

  private clearSearchState(): void {
    this.dataService.resetData();
  }

  private canSearch(params: SearchParams): boolean {
    if (this.currentSearchMode === SearchMode.Global) {
      return Boolean(params.query);
    }

    return Boolean(params.query) || params.category !== DEFAULT_SEARCH_PARAMS.category;
  }
}
