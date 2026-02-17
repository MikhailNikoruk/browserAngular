import { Component, EventEmitter, Output, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-browser-search-form',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './browser-search-form.html',
  styleUrl: './browser-search-form.scss',
})
export class BrowserSearchForm {
  @Output() submitEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();

  protected searchForm = new FormGroup({
    query: new FormControl(''),
  });

  protected get queryValue(): string {
    return this.searchForm.controls.query.value || '';
  }

  protected submitForm(): void {
    const submitQuery = this.searchForm.value.query
    console.log('>>> [search-form] submitQuery =>', submitQuery);

    this.submitEvent.emit(submitQuery);
  }

  protected resetForm(): void {
    this.searchForm.reset();

    this.resetEvent.emit();
  }
}
