import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public getItem<T>(key: string, fallback: T): T {
    try {
      const rawValue = localStorage.getItem(key);

      if (rawValue === null) {
        return fallback;
      }

      return JSON.parse(rawValue) as T;
    } catch {
      return fallback;
    }
  }

  public setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      return;
    }
  }
}
