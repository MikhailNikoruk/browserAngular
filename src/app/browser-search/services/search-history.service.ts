import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LocalStorageService } from '../../core';

const HISTORY_STORAGE_KEY = 'browser-search-history';
const HISTORY_LIMIT = 10;

@Injectable()
export class SearchHistoryService {
  private readonly storage = inject(LocalStorageService);
  private readonly historySubject = new BehaviorSubject<string[]>(
    this.storage.getItem<string[]>(HISTORY_STORAGE_KEY, []),
  );

  public readonly history$: Observable<string[]> = this.historySubject.asObservable();

  public getHistory(): string[] {
    return this.historySubject.getValue();
  }

  public addQuery(query: string): void {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    const nextHistory = [
      normalizedQuery,
      ...this.getHistory().filter((historyItem) => historyItem !== normalizedQuery),
    ].slice(0, HISTORY_LIMIT);

    this.setHistory(nextHistory);
  }

  public clearHistory(): void {
    this.historySubject.next([]);
    this.storage.removeItem(HISTORY_STORAGE_KEY);
  }

  private setHistory(history: string[]): void {
    this.historySubject.next(history);
    this.storage.setItem(HISTORY_STORAGE_KEY, history);
  }
}
