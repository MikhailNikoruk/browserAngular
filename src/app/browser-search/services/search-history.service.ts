import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LocalStorageService } from '../../core';

const HISTORY_STORAGE_KEY = 'browser-search-history';
const HISTORY_LIMIT = 10;

@Injectable()
export class SearchHistoryService {
  private readonly storage = inject(LocalStorageService);
  private readonly historySubject = new BehaviorSubject<string[]>(this.getInitialHistory());

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
      ...this.getHistory().filter(
        (historyItem) => this.getHistoryKey(historyItem) !== this.getHistoryKey(normalizedQuery),
      ),
    ];

    this.setHistory(nextHistory);
  }

  public clearHistory(): void {
    this.historySubject.next([]);
    this.storage.removeItem(HISTORY_STORAGE_KEY);
  }

  private getInitialHistory(): string[] {
    const storedHistory = this.storage.getItem<unknown>(HISTORY_STORAGE_KEY, []);
    const history = this.normalizeHistory(storedHistory);

    if (history.length) {
      this.storage.setItem(HISTORY_STORAGE_KEY, history);
    } else {
      this.storage.removeItem(HISTORY_STORAGE_KEY);
    }

    return history;
  }

  private setHistory(history: string[]): void {
    const normalizedHistory = this.normalizeHistory(history);

    this.historySubject.next(normalizedHistory);

    if (normalizedHistory.length) {
      this.storage.setItem(HISTORY_STORAGE_KEY, normalizedHistory);
      return;
    }

    this.storage.removeItem(HISTORY_STORAGE_KEY);
  }

  private normalizeHistory(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    const uniqueHistory = new Map<string, string>();

    for (const item of value) {
      if (typeof item !== 'string') {
        continue;
      }

      const normalizedItem = item.trim();

      if (!normalizedItem) {
        continue;
      }

      const historyKey = this.getHistoryKey(normalizedItem);

      if (!uniqueHistory.has(historyKey)) {
        uniqueHistory.set(historyKey, normalizedItem);
      }
    }

    return Array.from(uniqueHistory.values()).slice(0, HISTORY_LIMIT);
  }

  private getHistoryKey(query: string): string {
    return query.trim().toLowerCase();
  }
}
