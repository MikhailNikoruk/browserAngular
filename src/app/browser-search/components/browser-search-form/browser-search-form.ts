import { Component, EventEmitter, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-browser-search-form',
  imports: [
    FormsModule,
  ],
  templateUrl: './browser-search-form.html',
  styleUrl: './browser-search-form.scss',
})
export class BrowserSearchForm {
  @Output() submitEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();

  protected query: string = '';

  protected submit(): void {
    const submitQuery = this.query;
    console.log('>>> [search-form] submitQuery =>', submitQuery);

    this.submitEvent.emit(submitQuery);
  }

  protected reset(): void {
    console.log('>>> reset');

    this.query = '';
    this.resetEvent.emit();
  }
}
