import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SearchParams } from '../types';

export const DEFAULT_SEARCH_PARAMS: SearchParams = {
  query: '',
  category: 'all',
};

@Injectable()
export class SearchParamsService {
  private readonly paramsSubject = new BehaviorSubject<SearchParams>(DEFAULT_SEARCH_PARAMS);

  public readonly params$: Observable<SearchParams> = this.paramsSubject.asObservable();

  public getParams(): SearchParams {
    return this.paramsSubject.getValue();
  }

  public updateParams(patch: Partial<SearchParams>): void {
    this.paramsSubject.next({
      ...this.getParams(),
      ...patch,
    });
  }

  public resetParams(): void {
    this.paramsSubject.next(DEFAULT_SEARCH_PARAMS);
  }
}
