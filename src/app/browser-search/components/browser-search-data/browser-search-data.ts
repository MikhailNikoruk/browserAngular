import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SearchDataItem } from '../../types';

@Component({
  selector: 'app-browser-search-data',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './browser-search-data.html',
  styleUrl: './browser-search-data.scss',
})
export class BrowserSearchData {
  dataList = input<SearchDataItem[]>([]);
  protected readonly featuredItem = computed(() => this.dataList()[0] ?? null);
  protected readonly secondaryItems = computed(() => this.dataList().slice(1));

  protected getLinkLabel(link: string): string {
    try {
      const parsedUrl = new URL(link);

      return parsedUrl.hostname.replace('www.', '');
    } catch {
      return link;
    }
  }

  protected getResultEyebrow(index: number, featured = false): string {
    if (featured) {
      return 'Lead result';
    }

    return index < 3 ? 'Strong match' : 'Result item';
  }

  protected getResultSummary(dataItem: SearchDataItem, featured = false): string {
    if (dataItem.text) {
      return dataItem.text;
    }

    if (featured) {
      return 'Описание недоступно, но материал можно открыть и использовать как отправную точку для дальнейшего поиска.';
    }

    return 'Краткое описание отсутствует, но материал можно открыть по ссылке ниже.';
  }

  protected getResultActionLabel(dataItem: SearchDataItem, featured = false): string {
    if (!dataItem.link) {
      return featured ? 'Источник недоступен' : 'Ссылка недоступна';
    }

    return featured ? 'Открыть главный материал' : 'Открыть источник';
  }
}
