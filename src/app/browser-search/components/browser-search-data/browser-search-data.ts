import { Component, Input } from '@angular/core';
import { SearchDataItem } from '../../types';

@Component({
  selector: 'app-browser-search-data',
  imports: [],
  templateUrl: './browser-search-data.html',
  styleUrl: './browser-search-data.scss',
})
export class BrowserSearchData {
  @Input() dataList: SearchDataItem[] = [];
}
