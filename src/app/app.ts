import { Component } from '@angular/core';
import { BrowserSearch } from './browser-search';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [BrowserSearch]
})
export class App {
  protected readonly title = 'browser search';
}
