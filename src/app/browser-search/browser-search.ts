import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BrowserSearchForm, BrowserSearchData } from './components';
import { SEARCH_CATEGORY_LABELS } from './consts';
import { SEARCH_CATEGORIES, SearchDataItem, SearchParams } from './types';
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
  protected readonly historyList$: Observable<string[]> = this.historyService.history$;
  protected readonly params$: Observable<SearchParams> = this.searchParamsService.params$;
  protected readonly theme$: Observable<Theme> = this.themeService.theme$;
  protected readonly searchCategories = [...SEARCH_CATEGORIES];
  protected readonly searchCategoryLabels = SEARCH_CATEGORY_LABELS;

  protected readonly SearchMode = SearchMode;
  protected currentSearchMode: SearchMode = SearchMode.Local;
  protected hasSearched = false;

  protected handleNewSearch(params: SearchParams): void {
    const normalizedParams = this.normalizeParams(params);
    this.searchParamsService.updateParams(normalizedParams);

    if (!normalizedParams.query) {
      this.handleResetSearch();
      return;
    }

    this.hasSearched = true;
    this.executeSearch(normalizedParams);
    this.historyService.addQuery(normalizedParams.query);
  }

  protected handleResetSearch(): void {
    this.hasSearched = false;
    this.searchParamsService.resetParams();
    this.dataService.resetData();
  }

  protected applyLastQuery(query: string): void {
    const params = this.normalizeParams({
      ...this.searchParamsService.getParams(),
      query,
    });

    this.searchParamsService.updateParams(params);
    this.hasSearched = true;
    this.executeSearch(params);
    this.historyService.addQuery(params.query);
  }

  protected selectSearchMode(mode: SearchMode): void {
    this.currentSearchMode = mode;

    const params = this.searchParamsService.getParams();

    if (!params.query) {
      return;
    }

    this.hasSearched = true;
    this.executeSearch(params);
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
}
