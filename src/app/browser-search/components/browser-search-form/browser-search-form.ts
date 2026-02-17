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

  protected query: string = '';

  protected submit(): void {
    const submitQuery = this.query;
    console.log('>>> [search-form] submitQuery =>', submitQuery);

    this.query = '';
    this.submitEvent.emit(submitQuery);
  }
}
