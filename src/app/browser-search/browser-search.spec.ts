import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Observable, of, Subject, throwError } from 'rxjs';

import { GoogleSearchApiService } from '../api/services';
import { GoogleBooksResponseDto } from '../api/dtos';
import { BrowserSearch } from './browser-search';

describe('BrowserSearch', () => {
  let fixture: ComponentFixture<BrowserSearch>;
  let googleApi: { searchDataByText: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');

    googleApi = {
      searchDataByText: vi.fn<(_: string) => Observable<GoogleBooksResponseDto>>(),
    };

    await TestBed.configureTestingModule({
      imports: [BrowserSearch],
      providers: [
        {
          provide: GoogleSearchApiService,
          useValue: googleApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrowserSearch);
    fixture.detectChanges();
  });

  it('shows idle state before the first search', () => {
    const idleState = fixture.nativeElement.querySelector('.status-block--idle') as HTMLElement;

    expect(idleState).not.toBeNull();
    expect(idleState.textContent).toContain('Начните с текста запроса');
  });

  it('runs local search by category and resets back to idle state', async () => {
    const categorySelect = fixture.nativeElement.querySelector(
      'select[formcontrolname="category"]',
    ) as HTMLSelectElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    categorySelect.value = 'testing';
    categorySelect.dispatchEvent(new Event('change'));
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.data-item').length).toBeGreaterThan(0);

    const resetButton = fixture.nativeElement.querySelector(
      'button[aria-label="Сбросить форму поиска"]',
    ) as HTMLButtonElement;

    resetButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.status-block--idle')).not.toBeNull();
  });

  it('restores query from history click', async () => {
    const queryInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="query"]',
    ) as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    queryInput.value = 'TypeScript';
    queryInput.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const resetButton = fixture.nativeElement.querySelector(
      'button[aria-label="Сбросить форму поиска"]',
    ) as HTMLButtonElement;

    resetButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const historyButton = fixture.nativeElement.querySelector('.history-button') as HTMLButtonElement;

    historyButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(queryInput.value).toBe('TypeScript');
    expect(fixture.nativeElement.querySelectorAll('.data-item').length).toBeGreaterThan(0);
  });

  it('switches theme from UI controls', async () => {
    const darkThemeButton = fixture.nativeElement.querySelector(
      'button[aria-label="Тёмная тема"]',
    ) as HTMLButtonElement;

    darkThemeButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.browser-search') as HTMLElement;

    expect(root.classList.contains('theme-dark')).toBe(true);
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('shows loading and error states for failed global search', async () => {
    const pendingRequest$ = new Subject<GoogleBooksResponseDto>();

    googleApi.searchDataByText.mockReturnValue(pendingRequest$.asObservable());

    const globalModeButton = fixture.nativeElement.querySelector(
      'button[aria-label="Внешний поиск"]',
    ) as HTMLButtonElement;
    const queryInput = fixture.nativeElement.querySelector(
      'input[formcontrolname="query"]',
    ) as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    globalModeButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    queryInput.value = 'Angular';
    queryInput.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Подбираю материалы в Google Books');

    pendingRequest$.error(new Error('network'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Не получилось получить внешние результаты',
    );
  });
});
