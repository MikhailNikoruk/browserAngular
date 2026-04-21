import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GoogleBooksResponseDto } from '../dtos';

@Injectable({
  providedIn: 'root',
})
export class GoogleSearchApiService {
  private readonly baseUrl = 'https://www.googleapis.com';
  private readonly searchPath = '/books/v1/volumes';

  private readonly http = inject(HttpClient);

  public searchDataByText(text: string): Observable<GoogleBooksResponseDto> {
    const params = new HttpParams().set('q', text);

    return this.http.get<GoogleBooksResponseDto>(`${this.baseUrl}${this.searchPath}`, {
      params,
    });
  }
}
