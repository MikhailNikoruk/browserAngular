import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageRepositoryService {
    public getData<T>(key: string): T | null {
        try {
            const dataStr: string | null = localStorage.getItem(key) || null;
            if (!dataStr) {
                return null;
            }
            const data: T = JSON.parse(dataStr);
            return data;
        } catch (err) {
            console.log('[local storage] get data ERROR');
            return null;
        }
    }

    public setData<T>(key: string, data: T): void {
        try {
            const dataStr: string = JSON.stringify(data);
            localStorage.setItem(key, dataStr);
            return;
        } catch (err) {
            console.log('[local storage] set data ERROR');
            return;
        }
    }
}
