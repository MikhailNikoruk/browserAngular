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
    expect(fixture.nativeElement.textContent).toContain(
      'Введите запрос или выберите категорию, чтобы отфильтровать локальные материалы.',
    );
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

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const resetButton = buttons.find((button) => button.textContent?.includes('Сбросить')) as HTMLButtonElement;

    resetButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Введите запрос или выберите категорию, чтобы отфильтровать локальные материалы.',
    );
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

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const resetButton = buttons.find((button) => button.textContent?.includes('Сбросить')) as HTMLButtonElement;

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
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('.pill-button')) as HTMLButtonElement[];
    const darkThemeButton = buttons.find((button) => button.textContent?.includes('Темная')) as HTMLButtonElement;

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

    const modeButtons = Array.from(fixture.nativeElement.querySelectorAll('.pill-button')) as HTMLButtonElement[];
    const globalModeButton = modeButtons.find((button) => button.textContent?.includes('Глобальный')) as HTMLButtonElement;
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

    expect(fixture.nativeElement.textContent).toContain('Ищу результаты в Google Books');

    pendingRequest$.error(new Error('network'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Не удалось загрузить результаты из Google Books.',
    );
  });
});
