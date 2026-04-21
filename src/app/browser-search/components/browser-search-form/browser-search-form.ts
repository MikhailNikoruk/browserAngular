import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SearchCategory, SearchParams } from '../../types';
import { DEFAULT_SEARCH_PARAMS } from '../../services';

interface SearchFormControls {
  query: FormControl<string>;
  category: FormControl<SearchCategory>;
}

@Component({
  selector: 'app-browser-search-form',
  imports: [ReactiveFormsModule],
  templateUrl: './browser-search-form.html',
  styleUrl: './browser-search-form.scss',
})
export class BrowserSearchForm implements OnChanges {
  @Input() params: SearchParams = DEFAULT_SEARCH_PARAMS;
  @Input() categoryDisabled = false;
  @Input() isLoading = false;
  @Input() categories: SearchCategory[] = [];
  @Input() categoryLabels: Record<SearchCategory, string> = {
    all: 'Все темы',
    frontend: 'Frontend',
    javascript: 'JavaScript',
    css: 'CSS',
    performance: 'Performance',
    architecture: 'Architecture',
    testing: 'Testing',
    browser: 'Browser',
  };

  @Output() submitEvent = new EventEmitter<SearchParams>();
  @Output() resetEvent = new EventEmitter<void>();

  protected readonly searchForm = new FormGroup<SearchFormControls>({
    query: new FormControl(DEFAULT_SEARCH_PARAMS.query, { nonNullable: true }),
    category: new FormControl(DEFAULT_SEARCH_PARAMS.category, { nonNullable: true }),
  });

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['params']) {
      this.searchForm.patchValue(this.params, { emitEvent: false });
    }

    this.updateControlStates();
  }

  protected get queryControl(): FormControl<string> {
    return this.searchForm.controls.query;
  }

  protected get queryValue(): string {
    return this.queryControl.value;
  }

  protected get categoryValue(): SearchCategory {
    return this.searchForm.controls.category.value;
  }

  protected get canSubmit(): boolean {
    if (this.categoryDisabled) {
      return Boolean(this.queryValue.trim());
    }

    return Boolean(this.queryValue.trim()) || this.categoryValue !== DEFAULT_SEARCH_PARAMS.category;
  }

  protected submitForm(): void {
    const formValue = this.searchForm.getRawValue();
    const normalizedQuery = formValue.query.trim();

    if (normalizedQuery !== formValue.query) {
      this.queryControl.setValue(normalizedQuery, { emitEvent: false });
    }

    this.submitEvent.emit({
      query: normalizedQuery,
      category: formValue.category,
    });
  }

  protected resetForm(): void {
    this.searchForm.reset(DEFAULT_SEARCH_PARAMS);
    this.resetEvent.emit();
  }

  protected getCategoryLabel(category: SearchCategory): string {
    return this.categoryLabels[category] ?? category;
  }

  private updateControlStates(): void {
    if (this.isLoading) {
      this.queryControl.disable({ emitEvent: false });
    } else {
      this.queryControl.enable({ emitEvent: false });
    }

    if (this.categoryDisabled || this.isLoading) {
      this.searchForm.controls.category.disable({ emitEvent: false });
      return;
    }

    this.searchForm.controls.category.enable({ emitEvent: false });
  }
}
