import { Component, input } from '@angular/core';
import { SearchDataItem } from '../../types';

@Component({
  selector: 'app-browser-search-data',
  imports: [],
  templateUrl: './browser-search-data.html',
  styleUrl: './browser-search-data.scss',
})
export class BrowserSearchData {
  dataList = input<SearchDataItem[]>([]);

  protected getLinkLabel(link: string): string {
    try {
      const parsedUrl = new URL(link);

      return parsedUrl.hostname.replace('www.', '');
    } catch {
      return link;
    }
  }
}
