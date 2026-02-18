import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface SearchFormControls {
  query: FormControl<string>;
}

@Component({
  selector: 'app-browser-search-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './browser-search-form.html',
  styleUrl: './browser-search-form.scss',
})
export class BrowserSearchForm {
  @Output() submitEvent = new EventEmitter<string>();
  @Output() resetEvent = new EventEmitter<void>();

  protected searchForm = new FormGroup<SearchFormControls>({
    query: new FormControl('', { nonNullable: true }),
  });

  protected get queryControl(): FormControl<string> {
    return this.searchForm.controls.query;
  }

  protected get queryValue(): string {
    return this.queryControl.value;
  }

  protected submitForm(): void {
    const rawQuery: string = this.queryValue;
    const validatedQuery: string = rawQuery.trim();

    if (validatedQuery !== rawQuery) {
      this.queryControl.setValue(validatedQuery);
    }

    this.submitEvent.emit(validatedQuery);
  }

  protected resetForm(): void {
    this.searchForm.reset();
    this.resetEvent.emit();
  }
}
