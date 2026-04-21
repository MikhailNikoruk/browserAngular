import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  const storageKey = 'browser-search-theme';

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    TestBed.resetTestingModule();
  });

  it('uses stored theme and applies it to the document', () => {
    localStorage.setItem(storageKey, JSON.stringify('dark'));
    TestBed.configureTestingModule({});

    const service = TestBed.inject(ThemeService);

    expect(service.getTheme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.body.dataset['theme']).toBe('dark');
  });

  it('falls back to light theme when storage contains invalid value', () => {
    localStorage.setItem(storageKey, JSON.stringify('neon'));
    TestBed.configureTestingModule({});

    const service = TestBed.inject(ThemeService);

    expect(service.getTheme()).toBe('light');
    expect(localStorage.getItem(storageKey)).toBe(JSON.stringify('light'));
  });

  it('persists selected theme', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ThemeService);

    service.setTheme('dark');

    expect(service.getTheme()).toBe('dark');
    expect(localStorage.getItem(storageKey)).toBe(JSON.stringify('dark'));
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});
