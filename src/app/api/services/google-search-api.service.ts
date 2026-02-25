import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GoogleBooksResponseDto } from "../dtos";

@Injectable({
    providedIn: 'root'
})
export class GoogleSearchApiService {
    private baseUrl = 'https://www.googleapis.com';

    private http = inject(HttpClient);

    public searchDataByText(text: string): Observable<GoogleBooksResponseDto> {
        const requestUrl = `${this.baseUrl}/books/v1/volumes?q=${text}`;
        console.log('>>> requestUrl');

        return this.http.get<GoogleBooksResponseDto>(requestUrl)
    }
}
