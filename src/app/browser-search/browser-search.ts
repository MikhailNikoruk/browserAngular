import { Component } from '@angular/core';
import { BrowserSearchForm, BrowserSearchData } from './components';
import { SearchDataItem } from './types';

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
  protected searchResults: SearchDataItem[] = [
    {
      id: '1',
      title: 'Angular',
      text: 'Fast state updates with fine-grained reactivity based on Angular Signals. Fully featured. Everything works together with Angular',
      link: 'angular.dev'
    }
  ];

  protected handleNewSearch(query: string) {
    console.log('query =>', query);
  }
}
