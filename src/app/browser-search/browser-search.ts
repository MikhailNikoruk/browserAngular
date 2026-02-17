import { Component } from '@angular/core';
import { BrowserSearchForm, BrowserSearchData } from './components';
import { SearchDataItem } from './types';
import { SEARCH_DATA_LIST } from './consts';

@Component({
  selector: 'app-browser-search',
  templateUrl: './browser-search.html',
  styleUrl: './browser-search.scss',
  imports: [
    BrowserSearchForm,
    BrowserSearchData
  ],
})
export class BrowserSearch {
  protected searchResults: SearchDataItem[] = SEARCH_DATA_LIST;

  protected handleNewSearch(query: string) {
    console.log('query =>', query);

    const validateQuery: string = query.toLowerCase();

    this.searchResults = SEARCH_DATA_LIST.filter((item: SearchDataItem) => {
      const validatedItemTitle = item.title.toLowerCase()
      const isQueryInTitle = validatedItemTitle.includes(validateQuery);

      const validatedItemText = item.text.toLowerCase()
      const isQueryInText = validatedItemText.includes(validateQuery);
      
      return isQueryInTitle || isQueryInText;
    });
  }

  protected handleResetSearch() {
    this.searchResults = SEARCH_DATA_LIST;
  }
}
