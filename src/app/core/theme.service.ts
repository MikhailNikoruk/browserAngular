import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

export const THEMES = ['light', 'dark'] as const;
export type Theme = 'light' | 'dark';

const DEFAULT_THEME: Theme = 'light';
const THEME_STORAGE_KEY = 'browser-search-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storage = inject(LocalStorageService);
  private readonly document = inject(DOCUMENT);
  private readonly themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());

  public readonly theme$: Observable<Theme> = this.themeSubject.asObservable();

  public constructor() {
    this.applyTheme(this.themeSubject.getValue());
  }

  public getTheme(): Theme {
    return this.themeSubject.getValue();
  }

  public setTheme(theme: Theme): void {
    if (!this.isTheme(theme)) {
      return;
    }

    this.themeSubject.next(theme);
    this.storage.setItem(THEME_STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  private getInitialTheme(): Theme {
    const storedTheme = this.storage.getItem<unknown>(THEME_STORAGE_KEY, DEFAULT_THEME);
    const theme = this.isTheme(storedTheme) ? storedTheme : DEFAULT_THEME;

    if (theme !== storedTheme) {
      this.storage.setItem(THEME_STORAGE_KEY, theme);
    }

    return theme;
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.dataset['theme'] = theme;
    this.document.body.dataset['theme'] = theme;
  }

  private isTheme(value: unknown): value is Theme {
    return typeof value === 'string' && THEMES.includes(value as Theme);
  }
}
