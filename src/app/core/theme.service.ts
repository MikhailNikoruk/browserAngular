import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

export type Theme = 'light' | 'dark';

const DEFAULT_THEME: Theme = 'light';
const THEME_STORAGE_KEY = 'browser-search-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storage = inject(LocalStorageService);
  private readonly themeSubject = new BehaviorSubject<Theme>(
    this.storage.getItem<Theme>(THEME_STORAGE_KEY, DEFAULT_THEME),
  );

  public readonly theme$: Observable<Theme> = this.themeSubject.asObservable();

  public getTheme(): Theme {
    return this.themeSubject.getValue();
  }

  public setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.storage.setItem(THEME_STORAGE_KEY, theme);
  }
}
